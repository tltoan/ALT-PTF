const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

const printOptions = [
    { size: '8x6', price: 35 },
    { size: '12x9', price: 45 },
    { size: '16x12', price: 55 },
    { size: '24x18', price: 65 },
    { size: '32x24', price: 95 },
    { size: '48x36', price: 135 },
];

module.exports = async (req, res) => {
    if (req.method !== 'POST') {
        res.setHeader('Allow', 'POST');
        return res.status(405).end('Method Not Allowed');
    }

    try {
        const { items } = req.body;

        if (!items) {
           return res.status(400).json({ error: "No items provided" });
        }

        let totalAmount = 0;

        items.forEach(item => {
            const option = printOptions.find(p => p.size === item.size);
            if (option) {
                totalAmount += option.price * item.quantity;
            }
        });

        if (totalAmount === 0) {
            return res.status(400).json({ error: "Total amount is 0" });
        }

        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
        });

        res.status(200).json({
            clientSecret: paymentIntent.client_secret,
        });
    } catch (e) {
        res.status(500).json({
            error: {
                message: e.message,
            }
        });
    }
};
