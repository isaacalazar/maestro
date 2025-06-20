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
            "thank you for applying to", "we've reviewed your application",
            # Additional patterns for rejection emails
            "thank you for taking the time to apply", "apply for the", "applied for the",
            "time to apply for", "for applying for", "for your application",
            "regarding your application", "concerning your application", "about your application",
            "will not be moving forward", "regret to inform", "unfortunately", "not selected",
            "after careful consideration", "competitive selection process",
            "thank you for your interest in", "appreciate your interest in"
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
            "ux designer", "data analyst", "research scientist",
            # Additional technical role patterns
            "software engineering", "engineering intern", "technical intern",
            "intern", "graduate position", "entry level", "new grad"
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
        
        # CHECK 2: Rejection keywords (enhanced for better detection)
        rejection_keywords = [
            "unfortunately", "regret to inform", "not selected", "not moving forward", 
            "not the right fit", "other candidates", "will not be proceeding",
            "thank you for your interest, however", "different direction", "unsuccessful",
            # Additional rejection patterns
            "will not be moving forward", "regret to inform you that we will not",
            "after careful consideration, we regret", "competitive selection process",
            "not advance to the next stage", "not proceed with your application",
            "decided not to move forward", "pursue other candidates",
            "this decision does not reflect negatively", "extremely competitive",
            "we will not be moving forward with your application"
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
        """Extract ONLY the core company name - no extra words"""
        
        print(f"   🏢 Attempting to extract company from email content...")
        
        # Combine subject and body for searching
        full_text = f"{subject} {body}"
        
        # STEP 1: Look for very specific, reliable patterns first
        # Pattern 1: "at Company" - most reliable, now with word boundaries
        at_company_patterns = [
            r'\bat\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',  # "at Amazon", "at Google", etc. with word boundary
            r'internship\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'position\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'role\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'working\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])'
        ]
        
        for pattern in at_company_patterns:
            matches = re.findall(pattern, full_text)
            for company in matches:
                company = company.strip()
                if self._is_valid_company_name(company):
                    print(f"   ✅ Found company via 'at Company' pattern: {company}")
                    return company
        
        # Pattern 2: Company signatures - "Sincerely, Amazon Team"
        signature_patterns = [
            r'sincerely,?\s*(?:the\s+)?([A-Z][a-zA-Z]{2,15})(?:\s+team|\s+recruiting|\s*,)',
            r'best\s+regards,?\s*(?:the\s+)?([A-Z][a-zA-Z]{2,15})(?:\s+team|\s+recruiting|\s*,)',
            r'([A-Z][a-zA-Z]{2,15})\s+recruiting\s+team',
            r'([A-Z][a-zA-Z]{2,15})\s+talent\s+team',
            r'([A-Z][a-zA-Z]{2,15})\s+hr\s+team',
            r'on\s+behalf\s+of\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])'
        ]
        
        for pattern in signature_patterns:
            matches = re.findall(pattern, full_text, re.IGNORECASE)
            for company in matches:
                company = company.strip()
                if self._is_valid_company_name(company):
                    print(f"   ✅ Found company via signature: {company}")
                    return company
        
        # Pattern 3: Subject line patterns - more restrictive
        subject_patterns = [
            r'^([A-Z][a-zA-Z]{2,15})\s+(?:software|engineering|internship|position|role)(?:\s|$)',
            r'([A-Z][a-zA-Z]{2,15})\s+(?:software\s+engineering|internship)\s*[-–]',
            r'from\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'([A-Z][a-zA-Z]{2,15})\s*[-–]\s*(?:software|engineering|internship|position)',
            # Add pattern for "Company Software Engineering" format
            r'^([A-Z][a-zA-Z]{2,15})\s+Software\s+Engineering',
            r'^([A-Z][a-zA-Z]{2,15})\s+Data\s+Science',
            r'^([A-Z][a-zA-Z]{2,15})\s+Machine\s+Learning'
        ]
        
        for pattern in subject_patterns:
            matches = re.findall(pattern, subject)
            for company in matches:
                company = company.strip()
                if self._is_valid_company_name(company):
                    print(f"   ✅ Found company in subject: {company}")
                    return company
        
        # Pattern 4: Email body context patterns
        body_patterns = [
            r'thank\s+you\s+for\s+applying\s+to\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'your\s+application\s+to\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'opportunity\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'career\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])',
            r'join\s+(?:the\s+)?([A-Z][a-zA-Z]{2,15})\s+team(?:\s|$|[^\w])',
            r'([A-Z][a-zA-Z]{2,15})\s+is\s+excited\s+to',
            r'we\s+at\s+([A-Z][a-zA-Z]{2,15})(?:\s|$|[^\w])'
        ]
        
        for pattern in body_patterns:
            matches = re.findall(pattern, full_text, re.IGNORECASE)
            for company in matches:
                company = company.strip()
                if self._is_valid_company_name(company):
                    print(f"   ✅ Found company in body context: {company}")
                    return company
        
        print(f"   ❌ No company found in email content")
        return None

    def _is_valid_company_name(self, company: str) -> bool:
        """Check if extracted text is a valid company name"""
        if not company:
            return False
            
        company = company.strip()
        
        # Must be reasonable length (3-20 chars)
        if len(company) < 3 or len(company) > 20:
            return False
        
        # Expanded blacklist of common false positives
        blacklist = {
            # Common words
            'thank', 'you', 'for', 'your', 'the', 'and', 'with', 'from', 'team',
            'recruiting', 'we', 'our', 'this', 'that', 'next', 'step', 'process',
            'application', 'position', 'role', 'internship', 'job', 'opportunity',
            'interview', 'technical', 'phone', 'video', 'online', 'best', 'regards',
            'sincerely', 'yours', 'kind', 'looking', 'forward', 'please', 'software',
            'engineering', 'engineer', 'developer', 'data', 'science', 'machine',
            # Action words that often get captured
            'apply', 'applying', 'applied', 'contact', 'email', 'send', 'sent',
            'receive', 'received', 'review', 'reviewed', 'consider', 'decision',
            'thank you', 'thanks', 'hello', 'dear', 'hi',
            # Time/status words
            'update', 'status', 'current', 'future', 'recent', 'new', 'old',
            'first', 'second', 'third', 'final', 'last', 'next', 'previous',
            # Generic business words
            'company', 'business', 'organization', 'group', 'department', 'division',
            'office', 'headquarters', 'location', 'building', 'campus',
            # Common false positive patterns
            'subject', 'regarding', 'concerning', 'about', 'related', 'respect'
        }
        
        if company.lower() in blacklist:
            return False
        
        # Must start with capital letter and contain only letters (no numbers/symbols)
        if not re.match(r'^[A-Z][a-zA-Z]*$', company):
            return False
        
        # Additional checks for patterns that indicate it's not a company name
        # Don't allow words that are clearly not company names
        non_company_patterns = [
            r'^(Dear|Hello|Hi|Thanks|Thank|Best|Kind|Sincerely|Regards|Please)$',
            r'^(Software|Engineering|Technical|Interview|Application|Position)$',
            r'^(Manager|Director|Representative|Coordinator|Specialist)$'
        ]
        
        for pattern in non_company_patterns:
            if re.match(pattern, company, re.IGNORECASE):
                return False
        
        return True

    def extract_position_from_content(self, subject: str, body: str) -> str:
        """Extract clean position title - no sentences or extra words"""
        
        print(f"   💼 Attempting to extract position from content...")
        text_combined = f"{subject} {body}".lower()
        
        # Look for position patterns in the original case-sensitive text
        original_text = f"{subject} {body}"
        
        # STEP 1: Look for exact, well-defined position titles first
        exact_position_patterns = [
            # Most specific patterns first
            r'\b(software\s+engineering?\s+intern(?:ship)?)\b',
            r'\b(data\s+science?\s+intern(?:ship)?)\b',
            r'\b(machine\s+learning\s+intern(?:ship)?)\b',
            r'\b(web\s+development\s+intern(?:ship)?)\b',
            r'\b(frontend\s+(?:engineer|developer)\s+intern(?:ship)?)\b',
            r'\b(backend\s+(?:engineer|developer)\s+intern(?:ship)?)\b',
            r'\b(fullstack\s+(?:engineer|developer)\s+intern(?:ship)?)\b',
            r'\b(mobile\s+(?:engineer|developer)\s+intern(?:ship)?)\b',
            r'\b(devops\s+intern(?:ship)?)\b',
            r'\b(cloud\s+engineer\s+intern(?:ship)?)\b',
            r'\b(product\s+manager\s+intern(?:ship)?)\b',
            r'\b(ux\s+designer\s+intern(?:ship)?)\b',
            r'\b(data\s+analyst\s+intern(?:ship)?)\b',
            r'\b(research\s+intern(?:ship)?)\b',
            
            # General role patterns
            r'\b(software\s+engineer)\b',
            r'\b(data\s+scientist)\b',
            r'\b(machine\s+learning\s+engineer)\b',
            r'\b(frontend\s+(?:engineer|developer))\b',
            r'\b(backend\s+(?:engineer|developer))\b',
            r'\b(fullstack\s+(?:engineer|developer))\b',
            r'\b(web\s+developer)\b',
            r'\b(mobile\s+developer)\b',
            r'\b(devops\s+engineer)\b',
            r'\b(cloud\s+engineer)\b',
            r'\b(product\s+manager)\b',
            r'\b(ux\s+designer)\b',
            r'\b(data\s+analyst)\b',
            r'\b(research\s+scientist)\b'
        ]
        
        for pattern in exact_position_patterns:
            matches = re.finditer(pattern, original_text, re.IGNORECASE)
            for match in matches:
                position = match.group(1).strip()
                
                # Clean up and validate
                position = self._clean_position_title(position)
                if position and self._is_valid_position_title(position):
                    print(f"   ✅ Found exact position match: {position}")
                    return position
        
        # STEP 2: Look for position context patterns (more complex extraction)
        context_patterns = [
            # "for the X position" - extract just X
            r'for\s+the\s+([a-zA-Z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))\s+(?:position|role)',
            
            # "X position at" - extract just X  
            r'([a-zA-Z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))\s+(?:position|role)\s+at',
            
            # Subject line position extraction
            r'^[^-]*?[-–]\s*([A-Za-z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))',
            r'([A-Za-z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))\s*[-–]',
            
            # "apply for X" patterns
            r'apply(?:ing)?\s+for\s+(?:the\s+|a\s+)?([a-zA-Z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))',
            
            # "thank you for applying to/for X"
            r'thank\s+you\s+for\s+applying\s+(?:to|for)\s+(?:the\s+|a\s+)?([a-zA-Z\s]+(?:intern(?:ship)?|engineer|developer|scientist|manager|designer|analyst))'
        ]
        
        for pattern in context_patterns:
            matches = re.finditer(pattern, original_text, re.IGNORECASE)
            for match in matches:
                position = match.group(1).strip()
                
                # Clean up and validate
                position = self._clean_position_title(position)
                if position and self._is_valid_position_title(position):
                    print(f"   ✅ Found contextual position match: {position}")
                    return position
        
        # STEP 3: Fallback to keyword matching
        if "internship" in text_combined:
            # Try to find what kind of internship
            internship_types = [
                "software engineering", "software development", "data science",
                "machine learning", "web development", "frontend", "backend",
                "fullstack", "mobile", "devops", "cloud", "product", "ux", "research"
            ]
            
            for intern_type in internship_types:
                if intern_type in text_combined:
                    position = f"{intern_type.title()} Internship"
                    print(f"   ✅ Found internship type: {position}")
                    return position
            
            print(f"   💼 Using generic position: Internship")
            return "Internship"
        
        # Final fallback
        print(f"   💼 Using default position: Software Engineer")
        return "Software Engineer"
    
    def _clean_position_title(self, position: str) -> str:
        """Clean up extracted position title"""
        if not position:
            return ""
        
        # Remove common prefixes that get captured
        position = re.sub(r'^(thank\s+you\s+for\s+applying\s+to\s+the\s+|the\s+|your\s+|our\s+|this\s+|that\s+|a\s+)', '', position, flags=re.IGNORECASE)
        
        # Remove common suffixes
        position = re.sub(r'\s+(position|role|job|opportunity)$', '', position, flags=re.IGNORECASE)
        
        # Normalize whitespace
        position = re.sub(r'\s+', ' ', position).strip()
        
        # Title case
        position = position.title()
        
        return position
    
    def _is_valid_position_title(self, position: str) -> bool:
        """Validate that extracted text is a reasonable position title"""
        if not position:
            return False
        
        # Must be reasonable length
        if len(position) < 3 or len(position) > 50:
            return False
        
        # Must contain at least one of these role keywords
        role_keywords = [
            'intern', 'engineer', 'developer', 'scientist', 'manager', 
            'designer', 'analyst', 'specialist', 'coordinator', 'lead'
        ]
        
        if not any(keyword in position.lower() for keyword in role_keywords):
            return False
        
        # Blacklist obvious false positives
        position_blacklist = [
            'thank you', 'thanks', 'please', 'hello', 'dear', 'regards',
            'sincerely', 'best', 'looking forward', 'we are', 'you are',
            'this is', 'that is', 'it is', 'there is', 'here is'
        ]
        
        if any(bad_phrase in position.lower() for bad_phrase in position_blacklist):
            return False
        
        return True

# Global classifier instance
email_classifier = None

def get_email_classifier():
    global email_classifier
    if email_classifier is None:
        email_classifier = EmailClassifier()
    return email_classifier