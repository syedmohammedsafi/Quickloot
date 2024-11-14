import React from 'react';
import Header from "../Header/Header";
import Footer from "../footer/Footer";

const FAQSection: React.FC = () => {
  return (
    <>
      <Header />
      <section className="bg-white p-10">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-semibold mb-2">How do I participate in the lottery?</h3>
              <p>You can participate by purchasing tickets through our secure platform.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Is it safe to use your service?</h3>
              <p>Yes, we use advanced security measures to protect your information and transactions.</p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">What are the odds of winning?</h3>
              <p>The odds vary depending on the lottery and the number of tickets sold.</p>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default FAQSection;
