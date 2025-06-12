import re
from typing import Dict, Optional, List, Tuple
from transformers import pipeline
from app.models.job import ApplicationStatus
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
import functools

class EmailClassifier:
    """High-performance NLP-based email classifier with batch processing and caching"""
    
    def __init__(self):
        print("🚀 Loading optimized classification models...")
        
        # Use lighter, faster model for speed
        self.classifier = pipeline(
            "zero-shot-classification",
            model="facebook/bart-large-mnli",  # Keep proven model but optimize usage
            device=-1,  # CPU for now, could use GPU if available
            framework="pt"
        )
        
        # Cache for repeated classifications
        self._classification_cache = {}
        
        # Thread pool for parallel processing
        self._executor = ThreadPoolExecutor(max_workers=4)
        
        print("✅ Optimized models loaded!")
        
        self.email_categories = [
            "job application response",
            "interview invitation", 
            "application rejection",
            "job offer",
            "application confirmation",
            "recruitment spam"
        ]
        
        # Simplified status categories for faster processing
        self.status_keywords = {
            'interviewing': [
                "interview", "schedule", "discuss your application", 
                "next step", "move forward", "selected"
            ],
            'rejected': [
                "unfortunately", "regret", "not selected", "not moving forward",
                "other candidates", "different direction"
            ],
            'offered': [
                "offer", "congratulations", "welcome", "start date", "salary"
            ]
        }

    @functools.lru_cache(maxsize=1000)
    def _cached_classify(self, text_hash: str, text: str, categories: tuple) -> tuple:
        """Cached classification to avoid repeated NLP calls"""
        result = self.classifier(text[:300], list(categories))  # Limit text length
        return result['labels'][0], result['scores'][0]

    def batch_classify_emails(self, email_data_list: List[Dict]) -> List[Optional[Dict]]:
        """Batch process multiple emails for speed"""
        print(f"🚀 Batch processing {len(email_data_list)} emails...")
        
        # Pre-filter emails with fast keyword checks
        filtered_emails = []
        for email_data in email_data_list:
            if self._fast_prefilter(email_data):
                filtered_emails.append(email_data)
        
        print(f"📧 {len(filtered_emails)} emails passed pre-filtering")
        
        # Process remaining emails in parallel
        with ThreadPoolExecutor(max_workers=4) as executor:
            futures = [
                executor.submit(self._classify_single_email, email_data) 
                for email_data in filtered_emails
            ]
            
            results = []
            for future in futures:
                try:
                    result = future.result(timeout=10)  # 10 second timeout per email
                    results.append(result)
                except Exception as e:
                    print(f"⚠️ Email processing failed: {e}")
                    results.append(None)
        
        return results

    def _fast_prefilter(self, email_data: Dict) -> bool:
        """Fast keyword-based pre-filtering to eliminate obvious non-applications"""
        subject = email_data.get('subject', '').lower()
        body = email_data.get('body', '')[:500].lower()  # Only check first 500 chars
        text = f"{subject} {body}"
        
        # Must have application indicators
        required_keywords = [
            "application", "applied", "interview", "position", "role", 
            "internship", "job", "candidate", "hiring", "recruitment"
        ]
        
        if not any(keyword in text for keyword in required_keywords):
            return False
        
        # Must not be obvious spam/promotional
        spam_keywords = [
            "unsubscribe", "newsletter", "promotion", "deal", "sale",
            "marketing", "advertisement", "click here", "limited time"
        ]
        
        if any(keyword in text for keyword in spam_keywords):
            return False
        
        return True

    def _classify_single_email(self, email_data: Dict) -> Optional[Dict]:
        """Optimized single email classification"""
        subject = email_data['subject']
        body = email_data['body']
        sender = email_data['sender']
        date = email_data['date']
        
        # Fast company extraction
        company = self._fast_extract_company(subject, body, sender)
        if not company:
            return None
        
        # Fast status classification using keywords first
        status = self._fast_classify_status(subject, body)
        
        # Fast position extraction
        position = self._fast_extract_position(subject, body)
        
        return {
            'company': company,
            'position': position,
            'status': status,
            'applied_date': self._parse_date(date)
        }

    def _fast_extract_company(self, subject: str, body: str, sender: str) -> Optional[str]:
        """Fast company extraction with minimal regex"""
        text = f"{subject} {body}".lower()
        
        # Quick patterns for common company mentions
        patterns = [
            r'(?:at|from)\s+([A-Z][a-zA-Z]+)',
            r'([A-Z][a-zA-Z]+)\s+team',
            r'([A-Z][a-zA-Z]+)\s+recruiting'
        ]
        
        original_text = f"{subject} {body}"
        for pattern in patterns:
            match = re.search(pattern, original_text)
            if match:
                company = match.group(1).strip()
                if len(company) >= 3 and company.lower() not in ['team', 'recruiting', 'from']:
                    return company.title()
        
        # Fallback to domain extraction
        domain_match = re.search(r'@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}', sender)
        if domain_match:
            domain = domain_match.group(1).split('.')[0]
            if domain not in ['gmail', 'yahoo', 'outlook', 'hotmail']:
                return domain.title()
        
        return None

    def _fast_classify_status(self, subject: str, body: str) -> ApplicationStatus:
        """Fast status classification using keyword matching"""
        text = f"{subject} {body}".lower()
        
        # Check keywords in priority order
        for status, keywords in self.status_keywords.items():
            if any(keyword in text for keyword in keywords):
                if status == 'interviewing':
                    return ApplicationStatus.INTERVIEWING
                elif status == 'rejected':
                    return ApplicationStatus.REJECTED
                elif status == 'offered':
                    return ApplicationStatus.OFFERED
        
        return ApplicationStatus.APPLIED

    def _fast_extract_position(self, subject: str, body: str) -> str:
        """Fast position extraction"""
        text = f"{subject} {body}".lower()
        
        positions = [
            "software engineer", "data scientist", "frontend developer",
            "backend developer", "fullstack developer", "product manager",
            "engineering intern", "software intern"
        ]
        
        for position in positions:
            if position in text:
                return position.title()
        
        return "Software Engineering Internship"

    def _parse_date(self, date_string: str) -> str:
        """Fast date parsing"""
        try:
            from email.utils import parsedate_to_datetime
            if date_string:
                parsed_date = parsedate_to_datetime(date_string)
                return parsed_date.isoformat()
        except:
            pass
        return datetime.now().isoformat()

    # Keep the original methods for backward compatibility but mark as legacy
    def is_actual_application(self, subject: str, body: str, sender: str) -> bool:
        """Legacy method - use batch_classify_emails for better performance"""
        return self._fast_prefilter({'subject': subject, 'body': body, 'sender': sender})

    def classify_application_status(self, subject: str, body: str) -> ApplicationStatus:
        """Legacy method - use batch_classify_emails for better performance"""
        return self._fast_classify_status(subject, body)

    def extract_company_from_content(self, subject: str, body: str) -> Optional[str]:
        """Legacy method - use batch_classify_emails for better performance"""
        return self._fast_extract_company(subject, body, "")

    def extract_company_from_email(self, sender: str) -> Optional[str]:
        """Legacy method - use batch_classify_emails for better performance"""
        return self._fast_extract_company("", "", sender)

    def extract_position_from_content(self, subject: str, body: str) -> str:
        """Legacy method - use batch_classify_emails for better performance"""
        return self._fast_extract_position(subject, body)

# Global classifier instance
email_classifier = None

def get_email_classifier():
    global email_classifier
    if email_classifier is None:
        email_classifier = EmailClassifier()
    return email_classifier