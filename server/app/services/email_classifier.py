import re
from typing import Dict, Optional
# from transformers import pipeline  # Commented out to avoid loading heavy model
from app.models.job import ApplicationStatus
from datetime import datetime

class EmailClassifier:
    """Lightweight email classifier using regex patterns and keywords only"""
    
    def __init__(self):
        print("🤖 Initializing lightweight email classifier...")
        # Commented out heavy model loading
        # self.classifier = pipeline(
        #     "zero-shot-classification",
        #     model="facebook/bart-large-mnli",
        #     device=-1
        # )
        print("✅ Lightweight classifier ready!")

    def is_actual_application(self, subject: str, body: str, sender: str) -> bool:
        """Determine if email is an application response using lightweight methods"""
        
        text_combined = f"{subject} {body}".lower()
        
        # CHECK 1: Require specific application response indicators
        application_indicators = [
            "your application for", "position you applied", "role you applied", 
            "we received your application", "application status", 
            "selected to move forward", "move forward in the recruitment",
            "invite you to interview", "invite you to an interview", "invite you to the next step",
            "would like to schedule an interview", "would like to discuss your application",
            "interview for the position", "next steps in the hiring process", "next step of our recruitment",
            "schedule a time to discuss", "interview with our team", "schedule a technical interview",
            "excited to offer", "pleased to offer", "happy to offer", "offer you the position",
            "job offer", "offer of employment", "confirm your acceptance", "welcoming you to the team",
            "thank you for applying to", "we've reviewed your application"
        ]
        
        has_application_indicators = any(indicator in text_combined for indicator in application_indicators)
        if not has_application_indicators:
            print(f"   ❌ Missing specific application indicators")
            return False
        
        # CHECK 2: Require technical or role-specific indicators
        technical_indicators = [
            "software engineer", "developer", "data scientist", "machine learning",
            "artificial intelligence", "python", "java", "javascript", "react",
            "node", "backend", "frontend", "fullstack", "devops", "cloud", "aws",
            "azure", "database", "api", "web developer", "mobile developer",
            "internship", "technical role", "engineering role", "product manager",
            "ux designer", "data analyst", "research scientist"
        ]
        
        has_technical_indicators = any(indicator in text_combined for indicator in technical_indicators)
        if not has_technical_indicators:
            print(f"   ❌ Missing technical/role-specific indicators")
            return False
        
        # CHECK 3: Exclude obvious cold outreach or generic recruitment
        outreach_indicators = [
            "we found your resume", "came across your profile", 
            "great opportunity for you", "thought you might be interested",
            "perfect fit for you", "share an opportunity", "new openings",
            "job opportunities", "career opportunities", "hiring now",
            "job alert", "featured jobs", "unsubscribe"
        ]
        
        has_outreach_indicators = any(phrase in text_combined for phrase in outreach_indicators)
        if has_outreach_indicators:
            print(f"   ❌ Detected cold outreach or generic recruitment")
            return False
        
        # CHECK 4: Validate sender domain (but allow if company is in content)
        company_from_content = self.extract_company_from_content(subject, body)
        if company_from_content:
            print(f"   ✅ Company found in content: {company_from_content} - allowing email from any domain")
        else:
            company = self.extract_company_from_email(sender)
            if not company:
                print(f"   ❌ Invalid or generic sender domain and no company in content")
                return False
        
        print(f"   ✅ Classified as actual application response (lightweight method)")
        return True

    def classify_application_status(self, subject: str, body: str) -> ApplicationStatus:
        """Classify application status using keyword matching only"""
        
        text_combined = f"{subject} {body}".lower()
        
        # CHECK 1: Interview-specific keywords
        interview_keywords = [
            "schedule an interview", "interview invitation", "invite you to interview",
            "next step is an interview", "interview for the position", 
            "phone interview", "video interview", "technical interview",
            "selected to move forward", "discuss your application in an interview",
            "schedule a time to discuss", "interview with our team",
            "arrange a convenient time for an interview"
        ]
        
        if any(keyword in text_combined for keyword in interview_keywords):
            print(f"   📞 Status: INTERVIEWING (keyword match)")
            return ApplicationStatus.INTERVIEWING
        
        # CHECK 2: Rejection keywords
        rejection_keywords = [
            "unfortunately", "regret to inform", "not selected", "not moving forward", 
            "not the right fit", "other candidates", "will not be proceeding",
            "thank you for your interest, however", "different direction", "unsuccessful"
        ]
        
        if any(keyword in text_combined for keyword in rejection_keywords):
            print(f"   😞 Status: REJECTED (keyword match)")
            return ApplicationStatus.REJECTED
        
        # CHECK 3: Offer keywords
        offer_keywords = [
            "pleased to offer", "excited to offer", "happy to offer", "offer you the position", 
            "job offer", "offer of employment", "start date", "stipend", "salary", 
            "welcome to the team", "congratulations", "accepted for the position",
            "we believe you would be a great addition", "confirm your acceptance",
            "signing the attached form", "welcoming you to the team"
        ]
        
        if any(keyword in text_combined for keyword in offer_keywords):
            print(f"   🎉 Status: OFFERED (keyword match)")
            return ApplicationStatus.OFFERED
        
        # Default to APPLIED
        print(f"   📝 Status: APPLIED (default)")
        return ApplicationStatus.APPLIED

    def extract_company_from_email(self, sender: str) -> Optional[str]:
        """Extract company name from email sender with strict validation"""
        
        print(f"   🏢 Extracting company from: {sender}")
        
        sender_clean = sender.lower()
        sender_clean = re.sub(r'^(no-reply|noreply|hr|careers|jobs|talent|recruiting)[@-]', '', sender_clean)
        
        domain_match = re.search(r'@([a-zA-Z0-9.-]+)\.[a-zA-Z]{2,}', sender_clean)
        if not domain_match:
            print(f"   ❌ No domain found")
            return None
            
        domain = domain_match.group(1)
        
        skip_domains = [
            'gmail', 'yahoo', 'outlook', 'hotmail', 'icloud', 'aol', 'mail',
            'recruiting', 'staffing', 'jobvite', 'workday', 'greenhouse', 
            'lever', 'bamboohr', 'indeed', 'linkedin', 'glassdoor', 'monster',
            'ziprecruiter', 'careerbuilder', 'dice', 'talent.com'
        ]
        
        if any(skip in domain.lower() for skip in skip_domains):
            print(f"   ❌ Generic/recruiting platform domain: {domain}")
            return None
        
        domain_parts = domain.split('.')
        main_domain = domain_parts[0]
        
        company = main_domain
        company = re.sub(r'(corp|inc|llc|ltd|co)$', '', company, flags=re.IGNORECASE)
        
        if len(company) < 3:
            print(f"   ❌ Company name too short: {company}")
            return None
        
        company = company.title()
        print(f"   ✅ Extracted company: {company}")
        return company

    def extract_company_from_content(self, subject: str, body: str) -> Optional[str]:
        """Extract company name from email content (subject and body)"""
        
        print(f"   🏢 Attempting to extract company from email content...")
        text_combined = f"{subject} {body}".lower()
        
        # Common company name patterns in job emails
        company_patterns = [
            # More specific patterns for offers and interviews
            r'position.*?at\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            r'internship.*?at\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            r'role.*?at\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            r'job.*?at\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            # Signature patterns
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+recruiting\s+team',
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+team',
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+hr',
            # Generic patterns (keep as fallback)
            r'thank you for applying to.*?(?:internship|position|role)\s+at\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+(?:internship|position|role)',
            r'(?:from|with|for|by)\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})(?:\s+team|\s+recruiting|\s+hr|\.|,|\s)',
            r'([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+(?:recruiting|hiring|careers)',
            r'we\'re.*?from\s+([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})',
            r'best regards,?\s*([A-Z][a-zA-Z]+(?:\s+[A-Z][a-zA-Z]+){0,2})\s+recruiting',
        ]
        
        # Look for company names in original case-sensitive text
        original_text = f"{subject} {body}"
        
        for pattern in company_patterns:
            matches = re.finditer(pattern, original_text, re.IGNORECASE)
            for match in matches:
                company = match.group(1).strip()
                
                # Filter out common false positives
                false_positives = [
                    'thank', 'you', 'for', 'your', 'the', 'and', 'with', 'from', 'team',
                    'recruiting', 'we', 'our', 'this', 'that', 'next', 'step', 'process',
                    'application', 'position', 'role', 'internship', 'job', 'opportunity',
                    'interview', 'technical', 'phone', 'video', 'online', 'best', 'regards',
                    'sincerely', 'yours', 'kind', 'looking', 'forward', 'please', 'let',
                    'know', 'time', 'schedule', 'availability', 'convenient', 'offer', 'of',
                    'excited', 'to', 'pleased', 'happy', 'welcome', 'addition', 'great'
                ]
                
                if (len(company) >= 3 and 
                    company.lower() not in false_positives and
                    not company.lower().endswith('ing') and
                    not re.match(r'^(mr|ms|mrs|dr|prof)\.?$', company.lower())):
                    
                    print(f"   ✅ Found company in content: {company}")
                    return company.title()
        
        print(f"   ❌ No company found in email content")
        return None

    def extract_position_from_content(self, subject: str, body: str) -> str:
        """Extract position from email content with fallback to default"""
        
        print(f"   💼 Attempting to extract position from content...")
        text_combined = f"{subject} {body}".lower()
        
        position_indicators = [
            "software engineer", "data scientist", "machine learning engineer",
            "frontend developer", "backend developer", "fullstack developer",
            "devops engineer", "cloud engineer", "web developer", "mobile developer",
            "product manager", "ux designer", "data analyst", "research scientist",
            "technical intern", "engineering intern", "developer intern"
        ]
        
        for position in position_indicators:
            if position in text_combined:
                print(f"   ✅ Extracted position: {position.title()}")
                return position.title()
        
        print(f"   💼 Using default position: Internship")
        return "Internship"

# Global classifier instance
email_classifier = None

def get_email_classifier():
    global email_classifier
    if email_classifier is None:
        email_classifier = EmailClassifier()
    return email_classifier