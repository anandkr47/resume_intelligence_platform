"""Normalize and clean resume text"""
import re

def normalize_text(text: str) -> str:
    """Normalize text while preserving structure for parsing"""
    if not text:
        return ""
    
    # Preserve line breaks - they're important for structure
    # Only normalize excessive whitespace within lines
    lines = text.split('\n')
    normalized_lines = []
    
    for line in lines:
        # Remove excessive spaces within line (keep single spaces)
        line = re.sub(r' +', ' ', line)
        # Remove tabs, replace with space
        line = line.replace('\t', ' ')
        # Trim each line but keep empty lines (they indicate structure)
        line = line.strip()
        normalized_lines.append(line)
    
    # Join back with newlines (preserve structure)
    text = '\n'.join(normalized_lines)
    
    # Remove excessive blank lines (more than 2 consecutive)
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Trim overall whitespace
    text = text.strip()
    
    return text

def clean_whitespace(text: str) -> str:
    """Remove excessive whitespace while preserving structure"""
    if not text:
        return ""
    
    # Replace multiple spaces with single space
    text = re.sub(r' +', ' ', text)
    
    # Replace multiple newlines with double newline
    text = re.sub(r'\n{3,}', '\n\n', text)
    
    # Remove leading/trailing whitespace from each line
    lines = [line.strip() for line in text.split('\n')]
    text = '\n'.join(lines)
    
    return text.strip()

def remove_special_characters(text: str, preserve: str = '@.-+()/') -> str:
    """Remove special characters while preserving specified ones"""
    if not text:
        return ""
    
    # Create pattern that preserves specified characters
    pattern = f'[^\\w\\s{re.escape(preserve)}]'
    text = re.sub(pattern, ' ', text)
    
    return text

def normalize_phone(phone: str) -> str:
    """Normalize phone number format"""
    if not phone:
        return ""
    
    # Remove all non-digit characters except +
    normalized = re.sub(r'[^\d+]', '', phone)
    
    # Format if it's a US number (10 digits)
    if len(normalized) == 10:
        return f"({normalized[:3]}) {normalized[3:6]}-{normalized[6:]}"
    elif len(normalized) == 11 and normalized[0] == '1':
        return f"+1 ({normalized[1:4]}) {normalized[4:7]}-{normalized[7:]}"
    
    return normalized

def normalize_email(email: str) -> str:
    """Normalize email address"""
    if not email:
        return ""
    
    return email.lower().strip()
