const buildResponse = (res, status, payload) => res.status(status).json(payload);

const success = (res, data = {}, status = 200) =>
  buildResponse(res, status, { success: true, data });

const created = (res, data = {}) => success(res, data, 201);

const fail = (res, message, status = 400, details) =>
  buildResponse(res, status, { success: false, message, details });

module.exports = {
  success,
  created,
  fail,
};

