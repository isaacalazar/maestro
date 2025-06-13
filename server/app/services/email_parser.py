from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from app.db.supabase import supabase
from app.models.job import ApplicationStatus
from app.services.email_classifier import get_email_classifier
import re
import base64
from datetime import datetime
from typing import List, Dict
import traceback
from email.utils import parsedate_to_datetime

async def parse_and_classify_emails(credentials: Credentials, user_id: str):
    """Parse emails and classify job applications"""
    try:
        print(f"\n=== STARTING EMAIL PARSING FOR USER: {user_id} ===")
        
        # Build Gmail service
        service = build('gmail', 'v1', credentials=credentials)
        print("✅ Gmail service built successfully")
        
        # Search for job-related emails
        job_keywords = [
            'application', 'interview', 'position', 'job', 'internship',
            'career', 'opportunity', 'thank you for applying', 'hiring',
            'recruitment', 'candidate', 'role'
        ]
        
        # Create search query
        query = ' OR '.join([f'"{keyword}"' for keyword in job_keywords])
        print(f"\n📧 Search query: {query}")
        
        # Get messages
        messages_result = service.users().messages().list(
            userId='me', 
            q=query,
            maxResults=50  # Limit to recent emails
        ).execute()
        
        messages = messages_result.get('messages', [])
        print(f"📬 Found {len(messages)} potentially job-related emails")
        
        processed_jobs = []
        
        for i, message in enumerate(messages):
            print(f"\n--- Processing email {i+1}/{len(messages)} ---")
            
            msg_detail = service.users().messages().get(
                userId='me', 
                id=message['id']
            ).execute()
            
            # Extract email content
            email_data = extract_email_data(msg_detail)
            print(f"📧 Subject: {email_data['subject']}")
            print(f"👤 From: {email_data['sender']}")
            print(f"📅 Date: {email_data['date']}")
            print(f"📄 Body preview: {email_data['body'][:200]}...")
            
            # Classify and extract job info
            job_info = classify_email(email_data)
            
            if job_info:
                print(f"✅ CLASSIFIED AS JOB APPLICATION:")
                print(f"   🏢 Company: {job_info['company']}")
                print(f"   💼 Position: {job_info['position']}")
                print(f"   📊 Status: {job_info['status']}")
                print(f"   📅 Applied: {job_info['applied_date']}")
                
                # Check if job already exists
                existing_job = supabase.table("jobs").select("*").eq(
                    "user_id", user_id
                ).eq(
                    "company", job_info['company']
                ).eq(
                    "position", job_info['position']
                ).execute()
                
                if existing_job.data:
                    # Job exists - check if we should update the status
                    existing_record = existing_job.data[0]
                    existing_status = existing_record['status']
                    new_status = job_info['status']
                    
                    print(f"   📋 Existing job found:")
                    print(f"      Current status: {existing_status}")
                    print(f"      New email status: {new_status}")
                    
                    # Define status priority (higher number = more important)
                    status_priority = {
                        'applied': 1,
                        'interviewing': 2,
                        'offered': 3,
                        'rejected': 2  # Rejection can happen from any stage
                    }
                    
                    current_priority = status_priority.get(existing_status.lower(), 1)
                    new_priority = status_priority.get(new_status.lower(), 1)
                    
                    # Update if new status has higher priority OR if it's a meaningful change
                    should_update = (
                        new_priority > current_priority or 
                        (new_status.lower() == 'rejected' and existing_status.lower() != 'rejected') or
                        (new_status.lower() == 'interviewing' and existing_status.lower() == 'applied')
                    )
                    
                    if should_update:
                        # Update existing record with new status and latest email date
                        update_data = {
                            "status": new_status,
                            "applied_date": job_info['applied_date']  # Update to latest email date
                        }
                        
                        updated_result = supabase.table("jobs").update(update_data).eq(
                            "id", existing_record['id']
                        ).execute()
                        
                        print(f"   ✅ UPDATED existing job status: {existing_status} → {new_status}")
                        processed_jobs.append(updated_result.data[0])
                    else:
                        print(f"   ⚠️  No status update needed (current: {existing_status}, new: {new_status})")
                else:
                    # Create new job entry
                    job_data = {
                        "user_id": user_id,
                        "company": job_info['company'],
                        "position": job_info['position'],
                        "status": job_info['status'],
                        "applied_date": job_info['applied_date']
                    }
                    
                    result = supabase.table("jobs").insert(job_data).execute()
                    processed_jobs.append(result.data[0])
                    print(f"   ✅ Successfully added NEW job to database!")
            else:
                print(f"❌ Not classified as job application (no company found or other criteria not met)")
        
        print(f"\n=== EMAIL PARSING COMPLETE ===")
        print(f"📊 Total emails processed: {len(messages)}")
        print(f"💼 Jobs processed (new + updated): {len(processed_jobs)}")
        print(f"🎯 Jobs processed details:")
        for job in processed_jobs:
            action = "UPDATED" if job.get('updated_at') else "ADDED"
            print(f"   {action}: {job['company']} - {job['position']} ({job['status']})")
        
        return processed_jobs
        
    except Exception as e:
        print(f"❌ ERROR parsing emails: {str(e)}")
        print(f"Full traceback: {traceback.format_exc()}")
        return []

def extract_email_data(message) -> Dict:
    """Extract relevant data from Gmail message"""
    headers = message['payload'].get('headers', [])
    
    # Get subject and sender
    subject = ""
    sender = ""
    date = ""
    
    for header in headers:
        if header['name'] == 'Subject':
            subject = header['value']
        elif header['name'] == 'From':
            sender = header['value']
        elif header['name'] == 'Date':
            date = header['value']
    
    # Get email body
    body = ""
    if 'parts' in message['payload']:
        for part in message['payload']['parts']:
            if part['mimeType'] == 'text/plain':
                if 'data' in part['body']:
                    body = base64.urlsafe_b64decode(part['body']['data']).decode('utf-8')
                    break
    else:
        if message['payload']['body'].get('data'):
            body = base64.urlsafe_b64decode(message['payload']['body']['data']).decode('utf-8')
    
    return {
        'subject': subject,
        'sender': sender,
        'date': date,
        'body': body
    }

def parse_email_date(date_string: str) -> str:
    """Parse email date string to ISO format"""
    try:
        if date_string:
            # Parse the email date string (RFC 2822 format)
            parsed_date = parsedate_to_datetime(date_string)
            return parsed_date.isoformat()
    except Exception as e:
        print(f"   ⚠️ Could not parse email date '{date_string}': {e}")
    
    # Fallback to current time
    return datetime.now().isoformat()

def classify_email(email_data: Dict) -> Dict:
    """Classify email using NLP and extract job information"""
    subject = email_data['subject']
    body = email_data['body']
    sender = email_data['sender']
    date = email_data['date']
    
    print(f"   🔍 Starting NLP-based classification...")
    
    # First check: Is this actually an application response?
    if not get_email_classifier().is_actual_application(subject, body, sender):
        print(f"   ❌ Not an actual application response - skipping")
        return None
    
    # Extract company using improved logic
    company = get_email_classifier().extract_company_from_content(subject, body)
    if not company:
        # Fall back to extracting from sender domain
        company = get_email_classifier().extract_company_from_email(sender)
        if not company:
            print(f"   ❌ Could not extract valid company name from content or sender")
            return None
    
    # Extract position using improved patterns
    position = get_email_classifier().extract_position_from_content(subject, body)
    
    # Classify status using NLP sentiment analysis
    status = get_email_classifier().classify_application_status(subject, body)
    
    # Parse the actual email date
    applied_date = parse_email_date(date)
    
    print(f"   ✅ NLP Classification complete!")
    print(f"   🏢 Final company: {company}")
    print(f"   💼 Final position: {position}")
    print(f"   📊 Final status: {status}")
    print(f"   📅 Email date: {applied_date}")
    
    return {
        'company': company,
        'position': position,
        'status': status,
        'applied_date': applied_date
    } 