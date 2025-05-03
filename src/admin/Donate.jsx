import StripeButton from '../components/donation/StripeButton';

export default function Donate() {
  return (
    <div className="donate-page">
      <h2>Support Our Ministry</h2>
      <StripeButton amount={50} />
    </div>
  );
}
