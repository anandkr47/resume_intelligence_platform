import http from 'k6/http';
import { check, sleep } from 'k6';
import { FormData } from 'https://jslib.k6.io/form-data/0.0.2/index.js';

export const options = {
  stages: [
    { duration: '30s', target: 10 },  // Ramp up to 10 users
    { duration: '1m', target: 10 },     // Stay at 10 users
    { duration: '30s', target: 50 },    // Ramp up to 50 users
    { duration: '2m', target: 50 },     // Stay at 50 users
    { duration: '30s', target: 100 },   // Ramp up to 100 users
    { duration: '2m', target: 100 },    // Stay at 100 users
    { duration: '30s', target: 0 },     // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<2000'], // 95% of requests should be below 2s
    http_req_failed: ['rate<0.1'],       // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export default function () {
  // Simulate file upload
  const formData = new FormData();
  formData.append('resume', http.file('test-resume.pdf', 'dummy pdf content', 'application/pdf'));

  const params = {
    headers: {
      'Content-Type': 'multipart/form-data; boundary=' + formData.boundary,
    },
  };

  const res = http.post(`${BASE_URL}/api/upload/single`, formData.body(), params);

  check(res, {
    'upload status is 201': (r) => r.status === 201,
    'response has resumeId': (r) => JSON.parse(r.body).resumeId !== undefined,
  });

  sleep(1);
}
