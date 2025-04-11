// Create a Netlify function for user profile (netlify/functions/user-profile.js)
const faunadb = require('faunadb');
const q = faunadb.query;

exports.handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  const client = new faunadb.Client({
    secret: process.env.FAUNADB_SECRET
  });

  try {
    const { id } = event.queryStringParameters;
    const result = await client.query(
      q.Get(q.Ref(q.Collection('users'), id)
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