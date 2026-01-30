#!/usr/bin/env node
/**
 * Seed jobs script
 * Seeds the database with mock job data via the API
 */

import axios from 'axios';

const MOCK_JOBS = [
  {
    "jobId": "JOB-001",
    "title": "Frontend Web Developer",
    "domain": "Web",
    "experienceRange": "2-4 years",
    "location": "Remote",
    "skills": [
      "HTML",
      "CSS",
      "JavaScript",
      "React",
      "TypeScript",
      "Responsive Design",
      "REST APIs"
    ],
    "keywords": ["frontend", "ui", "web", "react", "spa"]
  },
  {
    "jobId": "JOB-002",
    "title": "Backend Engineer (Node.js)",
    "domain": "Backend",
    "experienceRange": "3-6 years",
    "location": "Bangalore",
    "skills": [
      "Node.js",
      "Express",
      "REST APIs",
      "Microservices",
      "PostgreSQL",
      "Redis",
      "Docker"
    ],
    "keywords": ["backend", "node", "api", "microservices"]
  },
  {
    "jobId": "JOB-003",
    "title": "Full Stack Developer",
    "domain": "Full Stack",
    "experienceRange": "3-5 years",
    "location": "Hybrid",
    "skills": [
      "React",
      "Node.js",
      "MongoDB",
      "TypeScript",
      "REST APIs",
      "JWT",
      "Git"
    ],
    "keywords": ["fullstack", "mern", "frontend", "backend"]
  },
  {
    "jobId": "JOB-004",
    "title": "Android Mobile App Developer",
    "domain": "Mobile",
    "experienceRange": "2-4 years",
    "location": "Pune",
    "skills": [
      "Kotlin",
      "Java",
      "Android SDK",
      "MVVM",
      "REST APIs",
      "Firebase"
    ],
    "keywords": ["android", "mobile", "app", "kotlin"]
  },
  {
    "jobId": "JOB-005",
    "title": "iOS App Developer",
    "domain": "Mobile",
    "experienceRange": "3-5 years",
    "location": "Remote",
    "skills": [
      "Swift",
      "SwiftUI",
      "UIKit",
      "iOS SDK",
      "REST APIs",
      "Xcode"
    ],
    "keywords": ["ios", "mobile", "swift", "app"]
  },
  {
    "jobId": "JOB-006",
    "title": "AI / Machine Learning Engineer",
    "domain": "AI",
    "experienceRange": "3-6 years",
    "location": "Bangalore",
    "skills": [
      "Python",
      "Machine Learning",
      "Deep Learning",
      "PyTorch",
      "NLP",
      "Transformers",
      "Model Deployment"
    ],
    "keywords": ["ai", "ml", "nlp", "deep learning", "llm"]
  },
  {
    "jobId": "JOB-007",
    "title": "DevOps Engineer",
    "domain": "DevOps",
    "experienceRange": "4-7 years",
    "location": "Hyderabad",
    "skills": [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS",
      "Linux",
      "Terraform",
      "Monitoring"
    ],
    "keywords": ["devops", "cloud", "ci/cd", "infrastructure"]
  },
  {
    "jobId": "JOB-008",
    "title": "Data Engineer",
    "domain": "Data",
    "experienceRange": "3-6 years",
    "location": "Chennai",
    "skills": [
      "Python",
      "SQL",
      "Apache Spark",
      "ETL Pipelines",
      "Airflow",
      "Data Warehousing"
    ],
    "keywords": ["data", "etl", "pipelines", "spark"]
  },
  {
    "jobId": "JOB-009",
    "title": "QA Automation Engineer",
    "domain": "Testing",
    "experienceRange": "2-5 years",
    "location": "Noida",
    "skills": [
      "Selenium",
      "Playwright",
      "JavaScript",
      "Test Automation",
      "API Testing",
      "CI Integration"
    ],
    "keywords": ["qa", "testing", "automation", "selenium"]
  },
  {
    "jobId": "JOB-010",
    "title": "Cloud Application Support Engineer",
    "domain": "Cloud / Support",
    "experienceRange": "1-3 years",
    "location": "Remote",
    "skills": [
      "AWS",
      "Linux",
      "Incident Management",
      "Monitoring Tools",
      "Shell Scripting",
      "Customer Support"
    ],
    "keywords": ["cloud", "support", "aws", "operations"]
  }
];

async function seedJobs() {
  // Try multiple endpoints - gateway (port 3000) or direct API (port 3002)
  const endpoints = [
    'http://localhost:3000/api/jobs/seed',  // Through API gateway
    'http://localhost:3002/api/jobs/seed',  // Direct to analytics API
  ];

  for (const endpoint of endpoints) {
    try {
      console.log(`Attempting to seed jobs via ${endpoint}...`);
      
      const response = await axios.post(endpoint, {}, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      if (response.status === 200 || response.status === 201) {
        console.log('✅ Jobs seeded successfully!');
        console.log(`   Count: ${response.data.count || response.data.jobs?.length || 'unknown'}`);
        console.log(`   Endpoint used: ${endpoint}`);
        return;
      }
    } catch (error: any) {
      if (error.response) {
        console.log(`   ❌ ${endpoint}: ${error.response.status} - ${error.response.data?.error || error.message}`);
      } else if (error.request) {
        console.log(`   ⚠️  ${endpoint}: No response (service may not be running)`);
      } else {
        console.log(`   ❌ ${endpoint}: ${error.message}`);
      }
      continue;
    }
  }

  console.error('\n❌ Failed to seed jobs. Please ensure:');
  console.error('   1. Analytics API is running (port 3002)');
  console.error('   2. API Gateway is running (port 3000)');
  console.error('   3. Database is accessible');
  console.error('\nYou can also seed jobs manually via:');
  console.error('   curl -X POST http://localhost:3002/api/jobs/seed');
  process.exit(1);
}

seedJobs();
