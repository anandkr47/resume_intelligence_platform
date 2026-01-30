
import sys
import os
from pathlib import Path

# Add the src directory to path
sys.path.insert(0, str(Path('/Users/anandk/Projects/Resume_analyzer/resume-intelligence-platform/apps/parser-worker-python/src')))

from extractors.education_extractor import extract_education
from extractors.experience_extractor import extract_experience

# Case 1: Deep Mehta (Comma separated)
text_deep = """
WORK EXPERIENCE
Software Engineer, Microsoft, Redmond, WA June 2024 - Present
e Experiences + Devices organization

Software Development Engineer Intern, Amazon, Seattle, WA May 2023 - Aug 2023
e Full stack software development
"""

# Case 2: Monisha (Comma separated / formatting)
text_monisha = """
Professional Experience

Software Engineer, Level IV, Google LLC, New York
o Working on Keep, a notetaking editor in Google Workspace.

Software Engineer, Level IV, Google India Pvt Ltd, Bangalore
copyright Developing intelligent features for the Google Workspace Editors
"""

# Case 3: Sample 1 (Education Institution issue)
text_sample1 = """
EDUCATION

UNIVERSITY OF ARIZONA, Tucson, Arizona
M.S., Computer Science, 2012
B.S.B.A., Management Information Systems, 2011
"""

print("\n=== Test Case 1: Deep Mehta (Comma Separated) ===")
exps = extract_experience(text_deep)
for i, exp in enumerate(exps):
    print(f"Entry {i+1}:")
    print(f"  Title: {exp.get('title')}")
    print(f"  Company: {exp.get('company')}")
    print(f"  Dates: {exp.get('startDate')} - {exp.get('endDate')}")
    print(f"  Duration: {exp.get('duration')}")

print("\n=== Test Case 2: Monisha (Comma Separated) ===")
exps = extract_experience(text_monisha)
for i, exp in enumerate(exps):
    print(f"Entry {i+1}:")
    print(f"  Title: {exp.get('title')}")
    print(f"  Company: {exp.get('company')}")

print("\n=== Test Case 3: Sample 1 (Education) ===")
edus = extract_education(text_sample1)
for i, edu in enumerate(edus):
    print(f"Entry {i+1}:")
    print(f"  Institution: {edu.get('institution')}")
    print(f"  Degree: {edu.get('degree')}")
