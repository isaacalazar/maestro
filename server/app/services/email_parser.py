from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from app.db.supabase import supabase
from app.models.job import ApplicationStatus
from app.services.email_classifier import get_email_classifier
from app.config import config
import re
import base64
from datetime import datetime
from typing import List, Dict
import traceback
from email.utils import parsedate_to_datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import ssl
from googleapiclient.errors import HttpError

async def parse_and_classify_emails(credentials: Credentials, user_id: str):
    """High-performance email parsing with batch processing and parallel operations"""
    try:
        print(f"\n🚀 STARTING OPTIMIZED EMAIL PARSING FOR USER: {user_id}")
        
        # Print configuration for debugging
        config.print_config()
        
        # Build Gmail service
        service = build('gmail', 'v1', credentials=credentials)
        print("✅ Gmail service built successfully")
        
        # Get emails in parallel batches
        email_data_list = await fetch_emails_parallel(service)
        
        if not email_data_list:
            print("📭 No emails found")
            return []
        
        print(f"📧 Fetched {len(email_data_list)} emails")
        
        # Batch classify all emails at once
        print("🤖 Starting batch NLP classification...")
        classifier = get_email_classifier()
        job_results = classifier.batch_classify_emails(email_data_list)
        
        # Filter out None results
        valid_jobs = [job for job in job_results if job is not None]
        print(f"✅ {len(valid_jobs)} valid job applications found")
        
        if not valid_jobs:
            return []
        
        # Bulk database operations
        processed_jobs = await bulk_database_operations(valid_jobs, user_id)
        
        print(f"\n🎉 OPTIMIZED EMAIL PARSING COMPLETE")
        print(f"📊 Total emails processed: {len(email_data_list)}")
        print(f"💼 Jobs processed: {len(processed_jobs)}")
        
        return processed_jobs
        
    except Exception as e:
        print(f"❌ ERROR in optimized parsing: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return []

async def fetch_emails_parallel(service) -> List[Dict]:
    """Fetch emails in parallel for maximum speed with robust error handling"""
    try:
        print(f"📧 Using search query: {config.GMAIL_SEARCH_QUERY}")
        
        # Get message IDs with retry logic
        messages = get_message_list_with_retry(
            service, 
            config.GMAIL_SEARCH_QUERY, 
            max_results=config.GMAIL_MAX_RESULTS
        )
        
        if not messages:
            return []
        
        print(f"📬 Found {len(messages)} potentially relevant emails")
        
        # Fetch email details in parallel with robust error handling
        email_data_list = []
        successful_fetches = 0
        failed_fetches = 0
        
        with ThreadPoolExecutor(max_workers=config.THREAD_POOL_MAX_WORKERS) as executor:
            # Submit all email fetching tasks
            future_to_message = {
                executor.submit(fetch_single_email_with_retry, service, msg['id']): msg 
                for msg in messages
            }
            
            # Collect results as they complete
            for future in as_completed(future_to_message):
                try:
                    email_data = future.result(timeout=config.EMAIL_FETCH_TIMEOUT)
                    if email_data:
                        email_data_list.append(email_data)
                        successful_fetches += 1
                    else:
                        failed_fetches += 1
                except Exception as e:
                    failed_fetches += 1
                    print(f"⚠️ Failed to fetch email after retries: {e}")
        
        print(f"✅ Successfully fetched {successful_fetches} emails, {failed_fetches} failed")
        return email_data_list
        
    except Exception as e:
        print(f"❌ Error fetching emails: {e}")
        return []

def get_message_list_with_retry(service, query: str, max_results: int = 100, max_retries: int = None) -> List[Dict]:
    """Get message list with retry logic for network issues"""
    if max_retries is None:
        max_retries = config.MAX_RETRIES
        
    for attempt in range(max_retries):
        try:
            messages_result = service.users().messages().list(
                userId='me', 
                q=query,
                maxResults=max_results
            ).execute()
            
            return messages_result.get('messages', [])
            
        except (ssl.SSLError, HttpError, ConnectionError) as e:
            print(f"⚠️ Attempt {attempt + 1} failed to get message list: {e}")
            if attempt < max_retries - 1:
                if config.EXPONENTIAL_BACKOFF:
                    wait_time = config.RETRY_DELAY_BASE * (2 ** attempt)
                else:
                    wait_time = config.RETRY_DELAY_BASE
                print(f"   Retrying in {wait_time} seconds...")
                time.sleep(wait_time)
            else:
                print(f"❌ Failed to get message list after {max_retries} attempts")
                return []
        except Exception as e:
            print(f"❌ Unexpected error getting message list: {e}")
            return []

def fetch_single_email_with_retry(service, message_id: str, max_retries: int = None) -> Dict:
    """Fetch a single email's data with retry logic for SSL/network errors"""
    if max_retries is None:
        max_retries = config.MAX_RETRIES
        
    for attempt in range(max_retries):
        try:
            msg_detail = service.users().messages().get(
                userId='me', 
                id=message_id,
                format='full'
            ).execute()
            
            return extract_email_data(msg_detail)
            
        except ssl.SSLError as e:
            print(f"⚠️ SSL error on attempt {attempt + 1} for email {message_id}: {e}")
            if attempt < max_retries - 1:
                wait_time = config.RETRY_DELAY_BASE + (attempt * 0.5)
                time.sleep(wait_time)
            else:
                print(f"❌ SSL error persisted after {max_retries} attempts for email {message_id}")
                return None
                
        except (HttpError, ConnectionError) as e:
            print(f"⚠️ Network error on attempt {attempt + 1} for email {message_id}: {e}")
            if attempt < max_retries - 1:
                wait_time = config.RETRY_DELAY_BASE + (attempt * 0.5)
                time.sleep(wait_time)
            else:
                print(f"❌ Network error persisted after {max_retries} attempts for email {message_id}")
                return None
                
        except Exception as e:
            print(f"⚠️ Unexpected error fetching email {message_id}: {e}")
            return None
    
    return None

def fetch_single_email(service, message_id: str) -> Dict:
    """Legacy function - use fetch_single_email_with_retry for better reliability"""
    return fetch_single_email_with_retry(service, message_id)

async def bulk_database_operations(valid_jobs: List[Dict], user_id: str) -> List[Dict]:
    """Perform bulk database operations for speed"""
    try:
        print("🗄️ Starting bulk database operations...")
        
        # Get all existing jobs for this user in one query
        existing_jobs_response = supabase.table("jobs").select("*").eq("user_id", user_id).execute()
        existing_jobs = {(job['company'], job['position']): job for job in existing_jobs_response.data}
        
        # Prepare batch operations
        jobs_to_insert = []
        jobs_to_update = []
        
        for job_info in valid_jobs:
            key = (job_info['company'], job_info['position'])
            
            if key in existing_jobs:
                # Check if update is needed
                existing_job = existing_jobs[key]
                if should_update_status(existing_job['status'], job_info['status']):
                    jobs_to_update.append({
                        'id': existing_job['id'],
                        'status': job_info['status'],
                        'applied_date': job_info['applied_date']
                    })
            else:
                # New job to insert
                jobs_to_insert.append({
                    "user_id": user_id,
                    "company": job_info['company'],
                    "position": job_info['position'],
                    "status": job_info['status'],
                    "applied_date": job_info['applied_date']
                })
        
        processed_jobs = []
        
        # Bulk insert new jobs
        if jobs_to_insert:
            print(f"📝 Bulk inserting {len(jobs_to_insert)} new jobs...")
            insert_result = supabase.table("jobs").insert(jobs_to_insert).execute()
            processed_jobs.extend(insert_result.data)
            print(f"✅ Inserted {len(insert_result.data)} new jobs")
        
        # Bulk update existing jobs
        if jobs_to_update:
            print(f"🔄 Bulk updating {len(jobs_to_update)} existing jobs...")
            for job_update in jobs_to_update:
                update_result = supabase.table("jobs").update({
                    "status": job_update["status"],
                    "applied_date": job_update["applied_date"]
                }).eq("id", job_update["id"]).execute()
                processed_jobs.extend(update_result.data)
            print(f"✅ Updated {len(jobs_to_update)} existing jobs")
        
        return processed_jobs
        
    except Exception as e:
        print(f"❌ Error in bulk database operations: {e}")
        return []

def should_update_status(current_status: str, new_status: str) -> bool:
    """Fast status priority check"""
    status_priority = {
        'applied': 1,
        'interviewing': 2,
        'offered': 3,
        'rejected': 2
    }
    
    current_priority = status_priority.get(current_status.lower(), 1)
    new_priority = status_priority.get(new_status.lower(), 1)
    
    return (new_priority > current_priority or 
            (new_status.lower() == 'rejected' and current_status.lower() != 'rejected') or
            (new_status.lower() == 'interviewing' and current_status.lower() == 'applied'))

def extract_email_data(message) -> Dict:
    """Optimized email data extraction with better error handling"""
    try:
        headers = message['payload'].get('headers', [])
        
        # Extract headers efficiently
        header_dict = {h['name']: h['value'] for h in headers}
        subject = header_dict.get('Subject', '')
        sender = header_dict.get('From', '')
        date = header_dict.get('Date', '')
        
        # Fast body extraction - use configurable max length
        body = extract_email_body(message['payload'])[:config.EMAIL_BODY_MAX_LENGTH]
        
        return {
            'subject': subject,
            'sender': sender,
            'date': date,
            'body': body
        }
    except Exception as e:
        print(f"⚠️ Error extracting email data: {e}")
        return {
            'subject': '',
            'sender': '',
            'date': '',
            'body': ''
        }

def extract_email_body(payload) -> str:
    """Fast email body extraction with better error handling"""
    try:
        # Check for plain text in parts
        if 'parts' in payload:
            for part in payload['parts']:
                if part['mimeType'] == 'text/plain' and 'data' in part['body']:
                    return base64.urlsafe_b64decode(part['body']['data']).decode('utf-8', errors='ignore')
        
        # Check body directly
        if payload['body'].get('data'):
            return base64.urlsafe_b64decode(payload['body']['data']).decode('utf-8', errors='ignore')
        
        return ""
    except Exception as e:
        print(f"⚠️ Error extracting email body: {e}")
        return ""

def parse_email_date(date_string: str) -> str:
    """Fast email date parsing"""
    try:
        if date_string:
            parsed_date = parsedate_to_datetime(date_string)
            return parsed_date.isoformat()
    except Exception:
        pass
    return datetime.now().isoformat()

# Legacy function for backward compatibility
def classify_email(email_data: Dict) -> Dict:
    """Legacy single email classification - use batch processing for better performance"""
    print("⚠️ Using legacy single email classification - consider using batch processing")
    
    subject = email_data['subject']
    body = email_data['body']
    sender = email_data['sender']
    date = email_data['date']
    
    # Use fast classification
    classifier = get_email_classifier()
    
    if not classifier._fast_prefilter(email_data):
        return None
    
    result = classifier._classify_single_email(email_data)
    return result 