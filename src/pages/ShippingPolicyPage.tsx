import { motion } from 'framer-motion';

export function ShippingPolicyPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-title">Shipping Policy</h1>
          <p className="section-subtitle">Everything you need to know about delivery, and returns</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-10 space-y-8 text-sm text-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Delivery Areas & Timeframes</h2>
            <p>
              We currently deliver across Pakistan. Orders are typically delivered within
              3-5 business days, depending on your location. You'll be able to track the
              status of your order from your account at any time.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Shipping Charges</h2>
            <p>
              Orders above Rs. 1,500 qualify for free delivery. For orders below this
              amount, a flat shipping fee of Rs. 200 is added at checkout.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Order Processing</h2>
            <p>
              Orders are processed and dispatched within 1-2 business days of being
              placed. You will be notified of any delays via the contact details provided
              at checkout.
            </p>
          </section>

          <section id="returns">
            <h2 className="font-heading text-lg text-dark mb-2">Returns & Exchanges</h2>
            <p>
              If you receive a damaged, defective, or incorrect product, please contact us
              within 3 days of delivery via the Contact page or WhatsApp with your order
              number and photos of the item. We'll arrange a replacement or refund once
              the issue is verified. Due to the nature of skincare products, opened or used
              items cannot be returned for hygiene reasons unless faulty.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Questions?</h2>
            <p>
              If you have any questions about your shipment, reach out through our{' '}
              <a href="/contact" className="text-pink-DEFAULT hover:text-pink-dark font-medium">
                Contact page
              </a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
