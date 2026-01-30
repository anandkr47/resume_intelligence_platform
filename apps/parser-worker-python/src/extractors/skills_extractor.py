"""Extract skills from resume text"""
from typing import List, Set
import re

# Common technical skills database
TECHNICAL_SKILLS = [
    # Programming Languages
    'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'go', 'rust', 'ruby', 'php',
    'swift', 'kotlin', 'scala', 'r', 'matlab', 'perl', 'shell', 'bash',
    
    # Web Technologies
    'react', 'angular', 'vue', 'node', 'node.js', 'express', 'next.js', 'nuxt.js',
    'html', 'css', 'sass', 'scss', 'less', 'bootstrap', 'tailwind', 'jquery',
    
    # Backend & Databases
    'sql', 'postgresql', 'mysql', 'mongodb', 'redis', 'elasticsearch', 'cassandra',
    'django', 'flask', 'fastapi', 'spring', 'laravel', 'rails', 'asp.net',
    
    # Cloud & DevOps
    'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ansible', 'jenkins',
    'git', 'github', 'gitlab', 'ci/cd', 'github actions', 'gitlab ci',
    
    # Data & ML
    'machine learning', 'deep learning', 'ai', 'tensorflow', 'pytorch', 'scikit-learn',
    'pandas', 'numpy', 'data science', 'data analysis', 'big data', 'hadoop', 'spark',
    
    # Mobile
    'react native', 'flutter', 'ios', 'android', 'xamarin',
    
    # Other
    'microservices', 'rest api', 'graphql', 'grpc', 'websocket', 'linux', 'unix',
    'agile', 'scrum', 'kanban', 'tdd', 'bdd', 'devops', 'sre',
]

def extract_skills(text: str) -> List[str]:
    """Extract skills from resume text"""
    if not text:
        return []
    
    found_skills: Set[str] = set()
    lower_text = text.lower()
    
    # Check for skills section
    skills_section = _extract_skills_section(text)
    if skills_section:
        text_to_search = skills_section
    else:
        text_to_search = lower_text
    
    # Match against known skills
    for skill in TECHNICAL_SKILLS:
        # Use word boundaries for better matching
        pattern = r'\b' + re.escape(skill.lower()) + r'\b'
        if re.search(pattern, text_to_search):
            found_skills.add(skill.title())
    
    # Also look for skills listed with separators
    skills_list_pattern = r'(?:skills?|technologies?|tools?)[:]\s*([^\n]+)'
    matches = re.findall(skills_list_pattern, lower_text, re.IGNORECASE)
    for match in matches:
        # Split by common separators
        items = re.split(r'[,;|•\-\n]', match)
        for item in items:
            item = item.strip()
            if item and len(item) > 2:
                found_skills.add(item.title())
    
    return sorted(list(found_skills))

def _extract_skills_section(text: str) -> str:
    """Extract the skills section from resume"""
    lines = text.split('\n')
    in_skills_section = False
    skills_lines = []
    
    for line in lines:
        line_lower = line.lower()
        if 'skills' in line_lower or 'technologies' in line_lower or 'tools' in line_lower:
            in_skills_section = True
            continue
        
        if in_skills_section:
            # Stop at next major section
            if any(keyword in line_lower for keyword in ['experience', 'education', 'projects', 'certifications']):
                break
            skills_lines.append(line)
    
    return '\n'.join(skills_lines).lower()
