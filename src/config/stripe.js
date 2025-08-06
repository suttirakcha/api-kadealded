import Stripe  from 'stripe'

export default new Stripe(process.env.SRTIPE_SECRET)