import React from 'react';
import { usePaystackPayment } from 'react-paystack';

interface PaystackButtonProps {
  plan: { name: string; amount: number };
  user: { email: string; name: string };
  className: string;
  buttonText: string;
  onSuccess: () => void;
}

const PaystackButton: React.FC<PaystackButtonProps> = ({ plan, user, className, buttonText, onSuccess: onPaymentSuccess }) => {
  const paystackKey = import.meta.env.VITE_PAYSTACK_PUBLIC_KEY;

  if (!paystackKey) {
    console.error('Paystack public key is not defined. Please check your .env file.');
  }
  
  const config = {
    reference: new Date().getTime().toString(),
    email: user.email,
    amount: plan.amount, // Amount in kobo
    publicKey: paystackKey,
    metadata: {
      name: user.name,
      plan: plan.name,
      custom_fields: [],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onSuccess = (reference: any) => {
    console.log('Payment successful:', reference);
    alert(`Payment for the ${plan.name} plan was successful!`);
    onPaymentSuccess();
  };

  const onClose = () => {
    console.log('Payment dialog closed.');
  };

  const handlePayment = () => {
    if (!paystackKey) {
      alert('Payment service is currently unavailable. Administrator has been notified.');
      return;
    }
    initializePayment({onSuccess, onClose});
  };

  return (
    <button
      onClick={handlePayment}
      className={className}
    >
      {buttonText}
    </button>
  );
};

export default PaystackButton; 