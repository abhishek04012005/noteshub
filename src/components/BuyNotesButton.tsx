'use client';

import { useState } from 'react';
import { loadScript } from '../utils/razorpay-loader';
import axios from 'axios';
import styles from './BuyNotesButton.module.css';

interface BuyNotesButtonProps {
  notesId: string;
  price: number;
  title: string;
}

export default function BuyNotesButton({
  notesId,
  price,
  title,
}: BuyNotesButtonProps) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handlePayment = async () => {
    if (!email || !name) {
      alert('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      // Step 1: Create order from backend
      const orderResponse = await axios.post('/api/payment/order', {
        notes_id: notesId,
        amount: price,
        customer_email: email,
        customer_name: name,
      });

      const { orderId, amount, currency } = orderResponse.data;

      // Step 2: Load Razorpay script
      const res = await loadScript(
        'https://checkout.razorpay.com/v1/checkout.js'
      );

      if (!res) {
        alert('Failed to load Razorpay');
        setLoading(false);
        return;
      }

      // Step 3: Open Razorpay payment modal
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: amount,
        currency: currency,
        order_id: orderId,
        name: 'Notes Marketplace',
        description: title,
        handler: async function (response: any) {
          try {
            // Step 4: Verify payment
            const verifyResponse = await axios.post('/api/payment/verify', {
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_signature: response.razorpay_signature,
              notes_id: notesId,
            });

            alert(
              'Payment successful! Download link sent to your email.'
            );
            setShowForm(false);
            setEmail('');
            setName('');

            // Redirect to download page
            window.location.href = `/student/download?order_id=${orderId}&email=${email}`;
          } catch (error) {
            console.error('Payment verification failed:', error);
            alert('Payment verification failed');
          }
        },
        prefill: {
          email: email,
          name: name,
        },
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Failed to initiate payment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className={styles.buyButton}
        >
          💳 Buy Now - ₹{price}
        </button>
      ) : (
        <div className={styles.paymentForm}>
          <h3 className={styles.formTitle}>
            Complete Your Purchase
          </h3>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Full Name
            </label>
            <input
              className={styles.input}
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Email Address
            </label>
            <input
              className={styles.input}
              type="email"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.divider}>
            <div className={styles.totalSection}>
              <span>Total:</span>
              <span className={styles.totalAmount}>₹{price}</span>
            </div>

            <div className={styles.buttonGroup}>
              <button
                onClick={handlePayment}
                disabled={loading || !email || !name}
                className={styles.submitButton}
              >
                {loading ? '⏳ Processing...' : '✓ Complete Payment'}
              </button>

              <button
                onClick={() => {
                  setShowForm(false);
                  setEmail('');
                  setName('');
                }}
                className={styles.cancelButton}
              >
                Cancel
              </button>
            </div>

            <p className={styles.footer}>
              Secure payment powered by Razorpay
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
