const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { obtainUser } = require('../service/userService')
const { getPricing } = require('../service/transactionService')

module.exports.onboard = async (req, res, next) => {
    try {
        const { id } = req.user
        const user = await obtainUser(id)
        if (user.permission !== 'Owner') {
            return res.status(400).json({
                error: 'Finder cannot make onboarding.'
            })
        }
        const accountLinks = await stripe.accountLinks.create({
            account: user.stripe_id,
            refresh_url: 'http://localhost:3000/user',
            return_url: 'http://localhost:3000/user',
            type: 'account_onboarding'
        })
        res.json({
            url: accountLinks.url
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getOnboardStatus = async (req, res, next) => {
    try {
        if (req.user.id !== req.params.id) throw new Error('Unauthorised')
        const { id } = req.user;
        const owner = await obtainUser(id)
        const account = await stripe.accounts.retrieve(owner.stripe_id);
        res.json({
            email: account.email,
            isOnboarded: account.charges_enabled && account.details_submitted ? true : false
        })
    } catch (err) {
        next(err)
    }
}

module.exports.getPaymentIntent = async (req, res, next) => {
    try {
        const { id } = req.user;
        const user = await obtainUser(id)
        if (user.permission !== 'Finder') {
            return res.status(400).json({
                error: 'Owner not allowed to make appointments.'
            })
        }
        const { serviceId, appointments } = req.body;
        const { pricing, ownerStripeId } = await getPricing(serviceId)
        const paymentIntent = await stripe.paymentIntents.create({
            payment_method_types: ['card'],
            amount: appointments.length * pricing * 100,
            currency: 'hkd',
            application_fee_amount: Math.round(appointments.length * pricing * 0.05)
        }, {
            stripeAccount: ownerStripeId
        });
        return res.status(200).json({
            client_secret: paymentIntent.client_secret,
            connected_stripe_account_id: ownerStripeId,
            pricing: pricing
        })
    } catch (err) {
        next(err)
    }
}