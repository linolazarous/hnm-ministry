const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  const client = new faunadb.Client({
    secret: process.env.FAUNA_SECRET
  });

  try {
    const { email } = JSON.parse(event.body);
    const result = await client.query(
      q.Get(q.Match(q.Index('users_by_email'), email))
    );
    
    return {
      statusCode: 200,
      body: JSON.stringify(result.data)
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};