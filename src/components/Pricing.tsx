import React from 'react';
import { CheckCircle } from 'lucide-react';
import PaystackButton from './PaystackButton';

interface PricingProps {
  user: { email: string; name: string };
  onPaymentSuccess: () => void;
}

const Pricing: React.FC<PricingProps> = ({ user, onPaymentSuccess }) => {
  const plans = [
    {
      name: 'Weekly',
      price: 'N25,000',
      amount: 2500000, // in kobo
      features: ['Full access to all features', 'Create unlimited artworks', 'Standard support'],
      buttonText: 'Choose Weekly',
    },
    {
      name: 'Monthly',
      price: 'N55,000',
      amount: 5500000, // in kobo
      features: ['Full access to all features', 'Create unlimited artworks', 'Priority support'],
      buttonText: 'Choose Monthly',
      popular: true,
    },
    {
      name: 'Annual',
      price: 'N620,000',
      amount: 62000000, // in kobo
      originalPrice: 'N660,000',
      features: ['Full access to all features', 'Create unlimited artworks', 'Dedicated support', 'Early access to new features'],
      buttonText: 'Choose Annual',
    },
  ];

  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
            Choose Your Plan
          </h2>
          <p className="mt-4 text-xl text-gray-600">
            Unlock your creativity with a plan that fits your needs.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`bg-white rounded-lg shadow-lg p-8 flex flex-col ${plan.popular ? 'border-2 border-primary-600' : ''}`}
            >
              <div className="flex-grow">
                {plan.popular && (
                  <div className="absolute top-0 -translate-y-1/2 bg-primary-600 text-white px-3 py-1 text-sm font-semibold rounded-full shadow-md">
                    Most Popular
                  </div>
                )}
                <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                {plan.originalPrice && (
                  <p className="text-gray-500 line-through">{plan.originalPrice}</p>
                )}
                <p className="mt-4 text-4xl font-extrabold text-gray-900">{plan.price}</p>
                <p className="mt-4 text-gray-600">per {plan.name.toLowerCase().slice(0, -2)}</p>
                <ul className="mt-6 space-y-4">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center">
                      <CheckCircle className="flex-shrink-0 w-6 h-6 text-green-500" />
                      <span className="ml-3 text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-8">
                <PaystackButton
                  plan={{ name: plan.name, amount: plan.amount }}
                  user={user}
                  buttonText={plan.buttonText}
                  className="w-full bg-primary-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-primary-700 transition-colors"
                  onSuccess={onPaymentSuccess}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Pricing; 