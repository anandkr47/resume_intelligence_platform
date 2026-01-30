"""Resume-related SQL queries for Parser worker."""

UPDATE_RESUME_PARSED_DATA = """
    UPDATE resumes
    SET
        name = %s,
        email = %s,
        phone = %s,
        skills = %s,
        experience = %s::jsonb,
        education = %s::jsonb,
        parsed_data = %s::jsonb,
        updated_at = NOW()
    WHERE id = %s
"""

UPDATE_RESUME_STATUS = """
    UPDATE resumes
    SET status = %s, updated_at = NOW()
    WHERE id = %s
"""
