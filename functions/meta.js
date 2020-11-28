const { createResponse } = require("../utils");
const metaScraper = require("metascraper")([
  require("metascraper-title")(),
  require("metascraper-image")(),
]);
const got = require("got");
const { string: yupString } = require("yup");

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod === "GET") {
      return await getMetadata(event, context);
    } else {
      return createResponse({
        error: true,
        data: {
          message: "Incorrect HTTP method",
        },
        statusCode: 400,
      });
    }
  } catch (error) {
    console.error("Server error: ", error);

    return createResponse({
      error: true,
      data: {
        message: "Some error happened",
      },
      statusCode: 500,
    });
  }
};

async function getMetadata(event, context) {
  const scrapeURL = event.queryStringParameters.url;

  // validate request
  const isRequestValid = await yupString()
    .trim()
    .required()
    .url()
    .isValid(scrapeURL);
  if (!isRequestValid) {
    return createResponse({
      error: true,
      data: {
        message: "Invalid scarpe URL",
      },
      statusCode: 400,
    });
  }

  // request URL
  let responseHTML = "";
  let requestURL = "";

  try {
    const { body, url } = await got(scrapeURL);
    responseHTML = body;
    requestURL = url;
  } catch (error) {
    return createResponse({
      error: true,
      data: {
        message: "Requested URL doesn't exist or returned an error",
      },
      statusCode: 400,
    });
  }

  // scrape information
  const metaData = await metaScraper({ html: responseHTML, url: requestURL });

  return createResponse({
    error: false,
    data: {
      title: metaData.title || "",
      image: metaData.image || "",
    },
    statusCode: 200,
  });
}
