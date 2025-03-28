import { loadStripe } from '@stripe/stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLIC_KEY);

export default function StripeButton({ amount }) {
  const handleClick = async () => {
    const stripe = await stripePromise;
    const { error } = await stripe.redirectToCheckout({
      lineItems: [{ price: 'price_HNM', quantity: 1 }],
      mode: 'payment',
      successUrl: `${window.location.origin}/thank-you`,
      cancelUrl: `${window.location.origin}/donate`
    });
    if (error) console.error(error);
  };

  return (
    <button onClick={handleClick} className="donate-btn">
      Donate ${amount}
    </button>
  );
}