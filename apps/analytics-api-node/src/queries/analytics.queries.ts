/** Analytics-related SQL queries */

export const GET_TOP_SKILLS = `
  SELECT skill, COUNT(*) as count
  FROM (
    SELECT UNNEST(skills) as skill
    FROM resumes
    WHERE skills IS NOT NULL AND array_length(skills, 1) > 0
  ) skills_expanded
  GROUP BY skill
  ORDER BY count DESC
  LIMIT $1
`;

export const GET_EXPERIENCE_STATS = `
  WITH resume_experience AS (
    SELECT 
      r.id,
      SUM(
        CASE 
          WHEN exp->>'duration' ILIKE '%less than%' THEN 0.5
          WHEN trim(exp->>'duration') ~ '^\\d+(\\.\\d+)?\\s*years?' THEN 
            CAST((regexp_match(trim(exp->>'duration'), '^(\\d+(\\.\\d+)?)'))[1] AS NUMERIC) + 
            CASE 
              WHEN trim(exp->>'duration') ~ '(\\d+)\\s*months?' THEN
                CAST((regexp_match(trim(exp->>'duration'), '(\\d+)\\s*months?'))[1] AS NUMERIC) / 12.0
              ELSE 0
            END
          WHEN trim(exp->>'duration') ~ '^\\d+\\s*months?' THEN
            CAST((regexp_match(trim(exp->>'duration'), '^(\\d+)'))[1] AS NUMERIC) / 12.0
          ELSE 0 
        END
      ) as total_years
    FROM resumes r,
         jsonb_array_elements(experience) exp
    WHERE experience IS NOT NULL AND jsonb_typeof(experience) = 'array'
    GROUP BY r.id
  )
  SELECT 
    AVG(total_years) as avg_years,
    MIN(total_years) as min_years,
    MAX(total_years) as max_years
  FROM resume_experience
`;

export const GET_EDUCATION_STATS = `
  SELECT 
    edu_item->>'institution' as institution,
    COUNT(*) as count
  FROM resumes,
  jsonb_array_elements(education) as edu_item
  WHERE education IS NOT NULL 
    AND jsonb_typeof(education) = 'array'
    AND edu_item->>'institution' IS NOT NULL
  GROUP BY edu_item->>'institution'
  ORDER BY count DESC
  LIMIT $1
`;
