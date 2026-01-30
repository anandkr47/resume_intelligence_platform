"""Resume-related SQL queries for Insights worker."""

GET_RESUME_COUNT = "SELECT COUNT(*) as count FROM resumes"

GET_PROCESSED_COUNT = "SELECT COUNT(*) as count FROM resumes WHERE status = %s"

GET_TOP_SKILLS = """
    SELECT skill, COUNT(*) as count
    FROM (
        SELECT UNNEST(skills) as skill
        FROM resumes
        WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
    ) skills_expanded
    GROUP BY skill
    ORDER BY count DESC
    LIMIT %s
"""
