function createResponse({
  error = false,
  statusCode = 200,
  data = {},
  headers = {},
}) {
  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: error, data: data }),
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
  };
}

module.exports = {
  createResponse,
};
