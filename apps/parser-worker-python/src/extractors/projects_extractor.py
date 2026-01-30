"""Extract projects from resume text"""
import re
from typing import List, Dict, Any, Optional

def extract_projects(text: str) -> List[Dict[str, Any]]:
    """Extract project entries from resume"""
    if not text:
        return []
    
    projects = []
    lines = text.split('\n')
    
    current_project: Dict[str, Any] = {}
    in_projects = False
    collecting_description = False
    
    for i, line in enumerate(lines):
        line_stripped = line.strip()
        if not line_stripped:
            if collecting_description:
                collecting_description = False
            continue
        
        line_lower = line_stripped.lower()
        
        # Detect projects section
        if any(keyword in line_lower for keyword in ['projects', 'project experience', 'personal projects', 'side projects']):
            in_projects = True
            continue
        
        # Stop at next major section
        if in_projects and any(keyword in line_lower for keyword in ['experience', 'education', 'skills', 'certifications', 'achievements', 'awards']):
            if current_project and _is_complete_project(current_project):
                projects.append(current_project)
            break
        
        if in_projects:
            # Skip bullet points that start with single letters (OCR artifacts)
            if re.match(r'^[a-z]\s+', line_stripped.lower()) and len(line_stripped) > 20:
                # This is likely a bullet point description
                if current_project and current_project.get('title'):
                    bullet_text = re.sub(r'^[a-z]\s+', '', line_stripped, flags=re.IGNORECASE).strip()
                    if bullet_text:
                        if current_project['description']:
                            current_project['description'] += ' ' + bullet_text
                        else:
                            current_project['description'] = bullet_text
                continue
            
            # Detect project title (usually bold, capitalized, or numbered)
            if _is_project_title(line_stripped, i, lines):
                if current_project and _is_complete_project(current_project):
                    projects.append(current_project)
                
                # Extract project title and technologies if they're on the same line
                # Format: "Project Name Tech1, Tech2, Tech3"
                title_and_techs = _split_title_and_technologies(line_stripped)
                current_project = {
                    'title': title_and_techs['title'],
                    'description': '',
                    'technologies': title_and_techs['technologies'],
                    'url': None,
                    'duration': None,
                }
                collecting_description = True
            # Detect URL
            elif _is_url(line_stripped):
                if current_project:
                    current_project['url'] = line_stripped
            # Detect technologies/skills in project
            elif current_project and _contains_technologies(line_stripped):
                techs = _extract_technologies(line_stripped)
                current_project['technologies'].extend(techs)
            # Detect duration
            elif current_project and _contains_date(line_stripped) and not current_project.get('duration'):
                current_project['duration'] = _extract_date_range(line_stripped)
            # Description lines
            elif current_project and collecting_description:
                # Skip if it's just a bullet point marker
                if not re.match(r'^[•\-\*\+]\s*$', line_stripped):
                    # Skip single-letter bullet points
                    if not re.match(r'^[a-z]\s+', line_stripped.lower()):
                        if current_project['description']:
                            current_project['description'] += ' ' + line_stripped
                        else:
                            current_project['description'] = line_stripped
    
    # Add last project if exists
    if current_project and _is_complete_project(current_project):
        projects.append(current_project)
    
    return projects

def _is_project_title(line: str, line_index: int, all_lines: List[str]) -> bool:
    """Check if line looks like a project title"""
    # Project titles are often:
    # - Short to medium lines (less than 100 chars)
    # - May start with numbers or bullets
    # - Often followed by description or technologies
    # - May be in all caps or title case
    # - May have technologies inline
    
    if len(line) > 120:
        return False
    
    # Skip if it's clearly a bullet point description
    if re.match(r'^[a-z]\s+', line.lower()) and len(line) > 20:
        return False
    
    # Check for common project title patterns
    title_patterns = [
        r'^[•\-\*\+]?\s*\d+[\.\)]?\s*[A-Z]',  # Numbered: "1. Project Name"
        r'^[A-Z][a-z]+(?:\s+[A-Z][a-z]+)*',  # Title case words
        r'^[A-Z\s]{3,}$',  # All caps (short)
    ]
    
    for pattern in title_patterns:
        if re.match(pattern, line):
            # Check next line - if it's a description, this is likely a title
            if line_index + 1 < len(all_lines):
                next_line = all_lines[line_index + 1].strip()
                if len(next_line) > 20 and not _is_url(next_line):
                    return True
            return True
    
    # Also check if line contains technologies but is short enough to be a title
    # Format: "Project Name Tech1, Tech2, Tech3"
    if _contains_technologies(line) and len(line) < 100:
        # Split by common tech separators and check if first part looks like title
        tech_separators = r'[,;|]'
        parts = re.split(tech_separators, line, maxsplit=1)
        if len(parts) >= 2:
            title_part = parts[0].strip()
            if 5 <= len(title_part) <= 60 and title_part[0].isupper():
                return True
    
    return False

def _split_title_and_technologies(line: str) -> Dict[str, Any]:
    """Split a line that might contain both project title and technologies"""
    # Common patterns: "Project Name Tech1, Tech2" or "Project Name | Tech1, Tech2"
    tech_separators = r'[,;|]'
    parts = re.split(tech_separators, line, maxsplit=1)
    
    if len(parts) >= 2:
        title_part = parts[0].strip()
        tech_part = parts[1].strip()
        # Extract technologies from tech_part
        techs = _extract_technologies(tech_part)
        return {'title': title_part, 'technologies': techs}
    
    # If no separator, check if line ends with tech keywords
    if _contains_technologies(line):
        # Try to find where title ends and tech starts
        # Look for common tech patterns at the end
        tech_pattern = r'([A-Z][a-z]*\.?[a-z]*\s*[,\s]*)+$'  # Tech names at end
        match = re.search(r'^(.+?)\s+([A-Z][a-z]+(?:\s*,\s*[A-Z][a-z]+)*)$', line)
        if match:
            title_part = match.group(1).strip()
            tech_part = match.group(2).strip()
            techs = _extract_technologies(tech_part)
            return {'title': title_part, 'technologies': techs}
    
    return {'title': line, 'technologies': []}

def _is_url(line: str) -> bool:
    """Check if line contains a URL"""
    url_pattern = r'https?://[^\s]+|www\.[^\s]+|github\.com/[^\s]+|gitlab\.com/[^\s]+'
    return bool(re.search(url_pattern, line.lower()))

def _contains_technologies(line: str) -> bool:
    """Check if line mentions technologies"""
    tech_keywords = ['built with', 'using', 'technologies', 'tech stack', 'stack:', 
                    'tools:', 'languages:', 'framework', 'library']
    line_lower = line.lower()
    return any(keyword in line_lower for keyword in tech_keywords)

def _extract_technologies(line: str) -> List[str]:
    """Extract technology names from line"""
    # Common separators
    techs = re.split(r'[,;|•\-\n]', line)
    technologies = []
    for tech in techs:
        tech = tech.strip()
        # Remove common prefixes
        tech = re.sub(r'^(built with|using|technologies?|tech stack|stack|tools?|languages?)[:\s]+', '', tech, flags=re.IGNORECASE)
        tech = tech.strip()
        if tech and len(tech) > 1 and len(tech) < 50:
            technologies.append(tech)
    return technologies

def _contains_date(line: str) -> bool:
    """Check if line contains a date"""
    date_patterns = [
        r'\d{4}',
        r'\d{1,2}[/-]\d{4}',
        r'(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}',
    ]
    return any(re.search(pattern, line.lower()) for pattern in date_patterns)

def _extract_date_range(line: str) -> Optional[str]:
    """Extract date range from line"""
    # Look for date patterns like "2020 - 2022" or "Jan 2020 - Dec 2022"
    date_range_pattern = r'(\d{4}|\w+\s+\d{4})\s*[-–—]\s*(\d{4}|\w+\s+\d{4}|present|current)'
    match = re.search(date_range_pattern, line, re.IGNORECASE)
    if match:
        return match.group(0)
    
    # Single date
    date_pattern = r'(\d{1,2}[/-])?\d{4}|(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\s+\d{4}'
    match = re.search(date_pattern, line.lower())
    if match:
        return match.group(0)
    
    return None

def _is_complete_project(project: Dict[str, Any]) -> bool:
    """Check if project entry has minimum required fields"""
    return bool(project.get('title'))
