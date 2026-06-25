import { motion } from 'framer-motion';
import { Heart, Shield, Leaf, Award, Sparkles } from 'lucide-react';
import aboutHeroImage from '@/assets/about/about-hero.jpg';
import ourStoryImage from '@/assets/about/our-story.jpg';

const values = [
  {
    icon: Heart,
    title: 'Quality First',
    description: 'We use only the highest quality ingredients sourced from trusted suppliers worldwide.',
  },
  {
    icon: Shield,
    title: 'Safe & Gentle',
    description: 'All products are dermatologist-tested, hypoallergenic, and suitable for sensitive skin.',
  },
  {
    icon: Leaf,
    title: 'Sustainability',
    description: 'Committed to eco-friendly packaging and cruelty-free formulations.',
  },
  {
    icon: Award,
    title: 'Innovation',
    description: 'Continuously researching and developing new formulas for better results.',
  },
];

const stats = [
  { value: '50K+', label: 'Happy Customers' },
  { value: '100+', label: 'Products' },
  { value: '15+', label: 'Countries' },
  { value: '4.8', label: 'Average Rating' },
];

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={aboutHeroImage}
          alt="About Siebel"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-dark/70 to-dark/40" />
        <div className="relative h-full container-custom flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-2xl"
          >
            <h1 className="font-heading text-display-2 mb-4">
              Our Story
            </h1>
            <p className="text-body-lg text-white/90">
              Discover the passion and science behind Siebel skincare.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-purple-DEFAULT">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center text-white"
              >
                <p className="font-heading text-display-2">{stat.value}</p>
                <p className="text-white/80">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="section-padding">
        <div className="container-custom">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-heading text-heading-1 text-dark mb-6">
                Born from a Passion for Healthy Skin
              </h2>
              <div className="space-y-4 text-gray">
                <p>
                  Siebel was founded in 2020 with a simple mission: to create
                  premium skincare products that deliver real results without
                  compromising on safety or sustainability.
                </p>
                <p>
                  Our founder, Emily Roberts, struggled for years with sensitive
                  skin and couldn't find products that were both effective and
                  gentle. This personal journey led her to partner with leading
                  dermatologists and cosmetic scientists to develop formulations
                  that work for all skin types.
                </p>
                <p>
                  Today, Siebel has grown into a beloved brand trusted by over
                  50,000 customers worldwide. We continue to innovate while
                  staying true to our core values of quality, safety, and
                  sustainability.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src={ourStoryImage}
                alt="Our journey"
                className="rounded-2xl shadow-elevated"
              />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-pink-DEFAULT rounded-2xl -z-10" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="section-padding bg-pink-50">
        <div className="container-custom">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="section-title">Our Values</h2>
            <p className="section-subtitle">
              The principles that guide everything we do
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl p-8 text-center shadow-card"
              >
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-pink-100 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-pink-DEFAULT" />
                </div>
                <h3 className="font-heading text-heading-4 text-dark mb-2">
                  {value.title}
                </h3>
                <p className="text-gray text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="section-padding bg-gradient-to-b from-pink-100 to-white">
        <div className="container-custom text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <Sparkles className="w-12 h-12 mx-auto mb-6 text-pink-DEFAULT" />
            <h2 className="font-heading text-heading-1 text-dark mb-6">
              Our Mission
            </h2>
            <p className="text-body-lg text-gray">
              "To empower everyone to feel confident in their skin by providing
              premium, science-backed skincare that is safe, effective, and
              sustainable. We believe that healthy, glowing skin should be
              accessible to all."
            </p>
            <p className="mt-6 text-pink-DEFAULT font-medium">- Emily Roberts, Founder</p>
          </motion.div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="container-custom text-center">
          <h2 className="font-heading text-heading-2 text-dark mb-4">
            Ready to Transform Your Skin?
          </h2>
          <p className="text-gray mb-8 max-w-xl mx-auto">
            Join thousands of happy customers who have discovered the Siebel
            difference.
          </p>
          <a href="/products" className="btn-primary btn-lg">
            Shop Our Products
          </a>
        </div>
      </section>
    </div>
  );
}
