// components/SimpleDonation.js
export const SimpleDonation = () => {
  const handleClick = async (amount) => {
    const response = await fetch('/.netlify/functions/create-checkout-session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount })
    });
    
    const { sessionId } = await response.json();
    const stripe = await loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);
    await stripe.redirectToCheckout({ sessionId });
  };

  return (
    <div>
      <button onClick={() => handleClick(25)}>Donate $25</button>
      <button onClick={() => handleClick(50)}>Donate $50</button>
      <button onClick={() => handleClick(100)}>Donate $100</button>
    </div>
  );
};