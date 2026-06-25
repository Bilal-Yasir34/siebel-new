import { motion } from 'framer-motion';

export function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-title">Privacy Policy</h1>
          <p className="section-subtitle">How we collect, use, and protect your information</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-10 space-y-8 text-sm text-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Information We Collect</h2>
            <p>
              When you create an account, place an order, or contact us, we collect
              information such as your name, email address, phone number, and shipping
              address. This is used solely to process your orders and provide customer
              support.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">How We Use Your Information</h2>
            <p>
              We use your information to fulfill orders, communicate order updates, respond
              to inquiries, and improve our products and services. We do not sell or rent
              your personal information to third parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Data Security</h2>
            <p>
              Your account is protected by a password, and your data is stored securely.
              We take reasonable precautions to protect your information from unauthorized
              access, alteration, or disclosure.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Cookies</h2>
            <p>
              We use basic browser storage to keep you signed in and to remember items in
              your cart. This data stays on your device and is not shared with third
              parties.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Your Rights</h2>
            <p>
              You can view or update your personal information at any time from your
              account's profile page. To request deletion of your account and associated
              data, please contact us.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Contact Us</h2>
            <p>
              If you have any questions about this privacy policy, please reach out via
              our{' '}
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
