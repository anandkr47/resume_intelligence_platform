/**
 * Artillery processor for multipart upload. Use beforeRequest: "setMultipartForm" in scenarios.
 */
const FormData = require('form-data');

function setMultipartForm(requestParams, context, ee, next) {
  const form = new FormData();
  form.append('resume', Buffer.from('dummy pdf content for artillery load test'), {
    filename: 'resume.pdf',
    contentType: 'application/pdf',
  });
  requestParams.body = form;
  requestParams.headers = requestParams.headers || {};
  Object.assign(requestParams.headers, form.getHeaders());
  return next();
}

module.exports = { setMultipartForm };
