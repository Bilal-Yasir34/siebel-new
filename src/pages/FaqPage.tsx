import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    question: 'How long does delivery take?',
    answer: 'Orders are typically delivered within 3-5 business days across Pakistan. You will receive updates on your order status, and you can track it anytime from the My Orders section of your account.',
  },
  {
    question: 'Is shipping free?',
    answer: 'Yes — orders above Rs. 1,500 qualify for free delivery. Orders below that amount have a flat shipping fee of Rs. 200.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We currently accept Cash on Delivery (COD) for all orders. You pay in cash when your order arrives at your doorstep.',
  },
  {
    question: 'Can I cancel or change my order after placing it?',
    answer: 'If your order has not yet been shipped, contact us as soon as possible via the Contact page or WhatsApp and we will do our best to accommodate changes or cancellation.',
  },
  {
    question: 'How do I track my order?',
    answer: 'Log in to your account and go to My Orders to see the current status of your order — Pending, In Progress, Completed, or Cancelled.',
  },
  {
    question: 'Are your products suitable for sensitive skin?',
    answer: 'Most of our formulas are gentle and dermatologically tested, but we always recommend doing a small patch test before first use, especially if you have particularly sensitive or reactive skin.',
  },
  {
    question: 'Do you offer returns or exchanges?',
    answer: 'Please see our Shipping Policy page for full details on returns and exchanges.',
  },
  {
    question: 'How can I contact customer support?',
    answer: 'You can reach us through the Contact page, by email, or via WhatsApp — links are available in the footer of every page.',
  },
];

export function FaqPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="container-custom py-12 max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="section-title">Frequently Asked Questions</h1>
          <p className="section-subtitle">Answers to common questions about ordering and delivery</p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question} className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-medium text-dark">{faq.question}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-gray flex-shrink-0 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-gray leading-relaxed">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
