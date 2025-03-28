const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  const { amount, token } = JSON.parse(event.body);
  
  try {
    const charge = await stripe.charges.create({
      amount: amount * 100,
      currency: 'usd',
      source: token,
      description: 'HNM Donation'
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, receipt: charge.receipt_url })
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: error.message })
    };
  }
};