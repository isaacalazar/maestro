#!/usr/bin/env python3
"""
Test script to verify that the improved email classifier can handle rejection emails properly
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.email_classifier import get_email_classifier

def test_amazon_rejection():
    """Test the Amazon rejection email that was failing"""
    
    print("=== Testing Amazon Rejection Email Classification ===\n")
    
    # The Amazon rejection email from the user's example
    subject = "Re: Your Application"
    body = """Dear Isaac Alazar,

Thank you for taking the time to apply for the Software Engineering Internship at Amazon and for sharing your background with us.

After careful consideration, we regret to inform you that we will not be moving forward with your application at this time. This decision does not reflect negatively on your qualifications; rather, it is the result of an extremely competitive selection process.

We appreciate your interest in Amazon and encourage you to apply for future opportunities that match your skills and experience. We wish you all the best in your academic and professional pursuits.

Sincerely,
Amazon Recruiting Team"""
    
    sender = "noreply@amazon.com"
    
    classifier = get_email_classifier()
    
    # Test 1: Is it recognized as an actual application?
    print("🔍 Testing: is_actual_application()")
    is_actual = classifier.is_actual_application(subject, body, sender)
    print(f"Result: {'✅ PASS' if is_actual else '❌ FAIL'}")
    print()
    
    if is_actual:
        # Test 2: Status classification
        print("🔍 Testing: classify_application_status()")
        status = classifier.classify_application_status(subject, body)
        print(f"Detected status: {status}")
        print(f"Result: {'✅ PASS (REJECTED)' if status.value == 'rejected' else '❌ FAIL'}")
        print()
        
        # Test 3: Company extraction
        print("🔍 Testing: extract_company_from_content()")
        company = classifier.extract_company_from_content(subject, body)
        print(f"Detected company: {company}")
        print(f"Result: {'✅ PASS (Amazon)' if company and 'amazon' in company.lower() else '❌ FAIL'}")
        print()
        
        # Test 4: Position extraction
        print("🔍 Testing: extract_position_from_content()")
        position = classifier.extract_position_from_content(subject, body)
        print(f"Detected position: {position}")
        print(f"Result: {'✅ PASS' if position and 'software' in position.lower() else '❌ FAIL'}")
        print()
        
        print("=== OVERALL RESULT ===")
        if (company and 'amazon' in company.lower() and 
            status.value == 'rejected' and 
            position and 'software' in position.lower()):
            print("🎉 SUCCESS: Amazon rejection email would now be properly processed!")
        else:
            print("❌ FAILURE: Amazon rejection email still has issues")
    else:
        print("❌ CRITICAL FAILURE: Email not recognized as job application response")

def test_stripe_offer():
    """Test a sample offer email to make sure we didn't break anything"""
    
    print("\n=== Testing Stripe Offer Email Classification ===\n")
    
    subject = "Stripe Software Engineering Internship - Offer"
    body = """Dear Isaac,

We are excited to offer you the Software Engineering Internship position at Stripe for Summer 2024!

Your technical skills and passion for building scalable payment infrastructure impressed our entire team. We believe you would be a great addition to our engineering organization.

Please let us know your decision by Friday, December 15th. We look forward to welcoming you to the team!

Best regards,
Stripe Recruiting Team"""
    
    sender = "recruiting@stripe.com"
    
    classifier = get_email_classifier()
    
    print("🔍 Testing offer email classification...")
    is_actual = classifier.is_actual_application(subject, body, sender)
    
    if is_actual:
        status = classifier.classify_application_status(subject, body)
        company = classifier.extract_company_from_content(subject, body)
        position = classifier.extract_position_from_content(subject, body)
        
        print(f"Status: {status}")
        print(f"Company: {company}")
        print(f"Position: {position}")
        
        if (status.value == 'offered' and 
            company and 'stripe' in company.lower() and
            position and 'software' in position.lower()):
            print("✅ PASS: Offer email correctly classified")
        else:
            print("❌ FAIL: Offer email classification broken")
    else:
        print("❌ FAIL: Offer email not recognized")

if __name__ == "__main__":
    test_amazon_rejection()
    test_stripe_offer() 