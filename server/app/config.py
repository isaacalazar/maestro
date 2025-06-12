"""Configuration settings for email processing and performance optimization"""

import os
from typing import Dict, Any

class EmailProcessingConfig:
    """Configuration for email processing performance and reliability"""
    
    # Gmail API settings
    GMAIL_MAX_RESULTS = int(os.getenv("GMAIL_MAX_RESULTS", "100"))
    GMAIL_SEARCH_QUERY = os.getenv(
        "GMAIL_SEARCH_QUERY", 
        "subject:(application OR interview OR internship OR position OR job OR offer OR hired OR rejected)"
    )
    
    # Performance settings
    THREAD_POOL_MAX_WORKERS = int(os.getenv("THREAD_POOL_MAX_WORKERS", "5"))
    EMAIL_FETCH_TIMEOUT = int(os.getenv("EMAIL_FETCH_TIMEOUT", "15"))
    EMAIL_BODY_MAX_LENGTH = int(os.getenv("EMAIL_BODY_MAX_LENGTH", "1000"))
    
    # Retry settings
    MAX_RETRIES = int(os.getenv("MAX_RETRIES", "3"))
    RETRY_DELAY_BASE = float(os.getenv("RETRY_DELAY_BASE", "1.0"))
    EXPONENTIAL_BACKOFF = os.getenv("EXPONENTIAL_BACKOFF", "true").lower() == "true"
    
    # NLP settings
    BATCH_CLASSIFICATION = os.getenv("BATCH_CLASSIFICATION", "true").lower() == "true"
    PREFILTER_ENABLED = os.getenv("PREFILTER_ENABLED", "true").lower() == "true"
    CLASSIFICATION_CACHE_SIZE = int(os.getenv("CLASSIFICATION_CACHE_SIZE", "1000"))
    
    # Model settings
    NLP_MODEL = os.getenv("NLP_MODEL", "facebook/bart-large-mnli")
    USE_GPU = os.getenv("USE_GPU", "false").lower() == "true"
    DEVICE = 0 if USE_GPU else -1
    
    # Database settings
    BULK_OPERATIONS = os.getenv("BULK_OPERATIONS", "true").lower() == "true"
    
    @classmethod
    def get_config_dict(cls) -> Dict[str, Any]:
        """Get all configuration as a dictionary"""
        return {
            "gmail_max_results": cls.GMAIL_MAX_RESULTS,
            "gmail_search_query": cls.GMAIL_SEARCH_QUERY,
            "thread_pool_max_workers": cls.THREAD_POOL_MAX_WORKERS,
            "email_fetch_timeout": cls.EMAIL_FETCH_TIMEOUT,
            "email_body_max_length": cls.EMAIL_BODY_MAX_LENGTH,
            "max_retries": cls.MAX_RETRIES,
            "retry_delay_base": cls.RETRY_DELAY_BASE,
            "exponential_backoff": cls.EXPONENTIAL_BACKOFF,
            "batch_classification": cls.BATCH_CLASSIFICATION,
            "prefilter_enabled": cls.PREFILTER_ENABLED,
            "classification_cache_size": cls.CLASSIFICATION_CACHE_SIZE,
            "nlp_model": cls.NLP_MODEL,
            "use_gpu": cls.USE_GPU,
            "device": cls.DEVICE,
            "bulk_operations": cls.BULK_OPERATIONS
        }
    
    @classmethod
    def print_config(cls):
        """Print current configuration"""
        print("\n⚙️ EMAIL PROCESSING CONFIGURATION")
        print("=" * 50)
        config = cls.get_config_dict()
        for key, value in config.items():
            print(f"{key}: {value}")
        print("=" * 50)

# Export the config instance
config = EmailProcessingConfig() 