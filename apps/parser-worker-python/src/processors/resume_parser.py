from typing import Dict, List, Any
from services.logger import get_logger
from extractors import (
    extract_name,
    extract_email,
    extract_phone,
    extract_skills,
    extract_experience,
    extract_education,
    extract_projects,
    extract_achievements,
)
from normalizers import normalize_text, normalize_email, normalize_phone

logger = get_logger(__name__)

class ResumeParser:
    """Parse resume text into structured data using extractors and normalizers"""
    
    def __init__(self):
        pass
    
    def parse(self, text: str) -> Dict[str, Any]:
        """Parse resume text into structured format with comprehensive extraction"""
        # Normalize text first
        normalized_text = normalize_text(text)
        
        # Extract contact info
        email = extract_email(normalized_text)
        phone = extract_phone(normalized_text)
        
        # Normalize contact info
        if email:
            email = normalize_email(email)
        if phone:
            phone = normalize_phone(phone)
        
        # Extract all sections
        name = extract_name(normalized_text)
        skills = extract_skills(normalized_text)
        experience = extract_experience(normalized_text)
        education = extract_education(normalized_text)
        projects = extract_projects(normalized_text)
        achievements = extract_achievements(normalized_text)
        
        logger.info("Parsed resume data", {
            "has_name": bool(name),
            "has_email": bool(email),
            "has_phone": bool(phone),
            "skills_count": len(skills),
            "experience_count": len(experience),
            "education_count": len(education),
            "projects_count": len(projects),
            "achievements_count": len(achievements),
        })
        
        return {
            "name": name or "",
            "email": email or "",
            "phone": phone or "",
            "skills": skills,
            "experience": experience,
            "education": education,
            "projects": projects,
            "achievements": achievements,
            "rawText": normalized_text,
        }
