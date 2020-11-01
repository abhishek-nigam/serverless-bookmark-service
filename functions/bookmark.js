exports.handler = async function (event, context) {
  let responseData = {};
  let error = false;
  let statusCode = 200;

  if (event.httpMethod === "POST") {
    const parsedRequestBody = JSON.parse(event.body);
    responseData = { requestBody: parsedRequestBody };
    error = false;
    statusCode = 201;
  } else {
    responseData = {
      message: "Incorrect HTTP method",
    };
    error = true;
    statusCode = 400;
  }

  return {
    statusCode: statusCode,
    body: JSON.stringify({ error: error, data: responseData }),
    headers: { "Content-Type": "application/json" },
  };
};
