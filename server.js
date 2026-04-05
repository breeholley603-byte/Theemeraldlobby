const express = require('express');
const Stripe = require('stripe');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());

const SUBSCRIPTION_API_KEY = process.env.SUBSCRIPTION_API_KEY;
const SUBSCRIPTION_API_SECRET = process.env.SUBSCRIPTION_API_SECRET;

if (!SUBSCRIPTION_API_SECRET) {
  console.warn('Missing Stripe secret key. Check .env file.');
}

const stripe = SUBSCRIPTION_API_SECRET ? Stripe(SUBSCRIPTION_API_SECRET) : null;

app.post('/create-subscription', async (req, res) => {
  const { customerId, planId } = req.body;

  if (!customerId || !planId) {
    return res.status(400).json({ error: 'customerId and planId are required' });
  }

  if (!stripe) {
    return res.status(500).json({ error: 'Stripe is not configured' });
  }

  try {
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: planId }],
      expand: ['latest_invoice.payment_intent'],
    });

    return res.json(subscription);
  } catch (error) {
    console.error('Subscription creation failed', error);
    const status = error.statusCode || 500;
    return res.status(status).json({ error: error.message || 'Subscription API error' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Subscription backend running on http://localhost:${PORT}`);
});
