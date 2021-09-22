const Service = require('../model/Service')

module.exports.getPricing = async (serviceId) => {
    const service = await Service.findById(serviceId).populate('owner')
    return { pricing: service.pricing, ownerStripeId: service.owner.stripe_id }
}
