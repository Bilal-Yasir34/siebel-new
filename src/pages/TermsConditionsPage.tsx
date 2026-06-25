import { motion } from 'framer-motion';

export function TermsConditionsPage() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-title">Terms & Conditions</h1>
          <p className="section-subtitle">Please read these terms carefully before using our site</p>
        </motion.div>

        <div className="bg-white rounded-2xl shadow-soft p-6 sm:p-10 space-y-8 text-sm text-gray leading-relaxed">
          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Use of Our Website</h2>
            <p>
              By accessing and using this website, you agree to use it only for lawful
              purposes and in a way that doesn't infringe the rights of, or restrict the
              use of, this site by anyone else.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Orders & Pricing</h2>
            <p>
              All prices listed are in Pakistani Rupees (Rs.) and are subject to change
              without notice. We reserve the right to refuse or cancel any order for
              reasons including product availability, errors in pricing, or suspected
              fraudulent activity.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Payment</h2>
            <p>
              We currently accept Cash on Delivery (COD) only. Payment is due in full at
              the time of delivery.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Product Information</h2>
            <p>
              We make every effort to display product details, images, and descriptions
              accurately. Actual product appearance may vary slightly. Please consult a
              dermatologist before use if you have known skin sensitivities or allergies.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Account Responsibility</h2>
            <p>
              You are responsible for maintaining the confidentiality of your account
              credentials and for all activity that occurs under your account.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of the site after
              changes are posted constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="font-heading text-lg text-dark mb-2">Contact Us</h2>
            <p>
              Questions about these terms can be directed to us via our{' '}
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
