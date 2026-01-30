import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '30s', target: 20 },
    { duration: '1m', target: 20 },
    { duration: '30s', target: 50 },
    { duration: '2m', target: 50 },
    { duration: '30s', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(95)<1000'],
    http_req_failed: ['rate<0.05'],
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Test analytics endpoints
  const endpoints = [
    '/api/analytics/dashboard',
    '/api/analytics/skills/top?limit=10',
    '/api/analytics/experience/stats',
    '/api/analytics/education/stats',
  ];

  endpoints.forEach((endpoint) => {
    const res = http.get(`${BASE_URL}${endpoint}`);
    check(res, {
      'status is 200': (r) => r.status === 200,
    });
    sleep(0.5);
  });
}
