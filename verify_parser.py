
import sys
import os
import json
from pathlib import Path


# Add the src directory to path
sys.path.insert(0, str(Path('/Users/anandk/Projects/Resume_analyzer/resume-intelligence-platform/apps/parser-worker-python/src')))

from extractors.education_extractor import extract_education
from extractors.experience_extractor import extract_experience

sample_text = """ANAND KUMAR

Senior Software Engineer
ankumar.snsvm@gmail.com | +91 8809578490
GitHub | Linkedin

EDUCATION
Biju Patnaik University Of Technology Bhubaneshwar, India
Computer Science Engineer Bachelor of Technology (B.Tech) November 2020 - May 2024
CGPA: 8.65

EXPERIENCE
Mindfire Digital LLP | Senior Software Engineer Bhubaneswar | January 2024 - Current

e Led cross-functional teams to deliver high-impact software solutions
Mentored junior developers, fostering a culture of continuous learning and excellence
Collaborated with stakeholders to align technology solutions with business objectives

e

e

e

e Enhanced user experience, increasing customer satisfaction by 20%

e Implemented Agile methodologies, improving team productivity by 25%
e

Led and maintained open-source projects within the Mindfire FOSS organization

Tetratrion Technologies | Full Stack Developer Bhubaneswar | August 2023 - November 2023
e Designed and developed the company website
e Implemented a custom email RESTful API using Node.js, improving communication efficiency
e Collaborated with clients and cross-functional teams to build an e-commerce platform
e Implemented secure authentication, and responsive UI and reliable backend

SKILLS

Programming Languages: Java, Python, JavaScript, TypeScript
"""

print("\n--- Testing Experience Extraction ---")
exps = extract_experience(sample_text)
for i, exp in enumerate(exps):
    print(f"Entry {i+1}:")
    print(f"  Title: {exp.get('title')}")
    print(f"  Company: {exp.get('company')}")
    print(f"  Dates: {exp.get('startDate')} - {exp.get('endDate')}")

print("\n--- Testing Education Extraction ---")
edus = extract_education(sample_text)
for i, edu in enumerate(edus):
    print(f"Entry {i+1}:")
    print(f"  Institution: {edu.get('institution')}")
    print(f"  Degree: {edu.get('degree')}")
