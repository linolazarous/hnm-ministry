// components/DonationForm.js
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [amount, setAmount] = useState(25);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Create payment intent via Netlify function
      const response = await fetch('/.netlify/functions/create-payment-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount })
      });
      
      const { clientSecret } = await response.json();

      // 2. Confirm payment
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) throw error;
      alert('Payment successful! Thank you for your donation.');
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input 
        type="number" 
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        min="5"
      />
      <CardElement />
      <button disabled={!stripe || loading}>
        {loading ? 'Processing...' : `Donate $${amount}`}
      </button>
    </form>
  );
};

export const DonationForm = () => (
  <Elements stripe={stripePromise}>
    <CheckoutForm />
  </Elements>
);