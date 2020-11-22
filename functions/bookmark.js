require("dotenv").config();
const {
  string: yupString,
  object: yupObject,
  array: yupArray,
} = require("yup");
const Pool = require("pg").Pool;

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: 5432,
});

exports.handler = async function (event, context) {
  try {
    if (event.httpMethod === "POST") {
      return await createBookmark(event, context);
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

async function createBookmark(event, context) {
  const requestBody = JSON.parse(event.body);

  // validate request
  const requestSchema = yupObject().shape({
    address: yupString().trim().required().url().label("Address"),
    title: yupString().trim().required(),
    tags: yupArray().of(yupString().trim().required()),
  });

  const isRequestValid = await requestSchema.isValid(requestBody);
  if (!isRequestValid) {
    return createResponse({
      error: true,
      data: {
        message: "Request body is invalid",
      },
      statusCode: 400,
    });
  }

  const { address, title, tags } = requestBody;

  // insert bookmark
  const { rows: insertBookmarkResultRows } = await pool.query(
    `
          INSERT INTO bookmark (link, title)
          VALUES ($1,$2)
          RETURNING _id
      `,
    [address, title]
  );
  const bookmarkID = insertBookmarkResultRows[0]["_id"];

  // insert tags in loop
  for (const tag of tags) {
    await pool.query(
      `
          INSERT INTO tag (_id)
          VALUES ($1)
          ON CONFLICT (_id) DO NOTHING
        `,
      [tag]
    );
  }

  // insert bookmark tag mapping records in loop
  for (const tag of tags) {
    await pool.query(
      `
          INSERT INTO bookmark_tag_mapping (bookmark_id, tag_id)
          VALUES ($1,$2)
          ON CONFLICT (bookmark_id, tag_id) DO NOTHING
        `,
      [bookmarkID, tag]
    );
  }

  return createResponse({
    error: false,
    data: {},
    statusCode: 201,
  });
}

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
