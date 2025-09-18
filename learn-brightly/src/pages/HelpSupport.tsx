import React from 'react';

const HelpSupport: React.FC = () => {
  // Check if user is a parent to apply normal font styling
  const user = localStorage.getItem('user');
  const userData = user ? JSON.parse(user) : null;
  const isParent = userData?.role === 'parent';

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8" style={isParent ? { fontFamily: 'Arial, sans-serif' } : {}}>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Help & Support</h1>
        
        {/* FAQ Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How do I get started with the app?</h3>
              <p className="text-gray-600">Begin by taking our dyslexia assessment test to get personalized recommendations. Then explore our reading exercises and games designed to help with dyslexia.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">What features are available for dyslexia support?</h3>
              <p className="text-gray-600">Our app includes text-to-speech functionality, adjustable font sizes and colors, dyslexia-friendly fonts, and interactive games focused on improving reading and spelling skills.</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-lg font-medium text-gray-900 mb-2">How can I track my progress?</h3>
              <p className="text-gray-600">Visit your profile page to view your learning statistics, completed exercises, and achievements. Regular assessments help track your improvement over time.</p>
            </div>
          </div>
        </section>

        {/* Contact Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <p className="text-gray-600 mb-4">Need additional help? Our support team is here for you.</p>
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-medium text-gray-900">Email Support</h3>
                <p className="text-gray-600">support@learnbrightly.com</p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">Response Time</h3>
                <p className="text-gray-600">We typically respond within 24-48 hours during business days.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Resources Section */}
        <section>
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Additional Resources</h2>
          <div className="bg-white p-6 rounded-lg shadow">
            <ul className="space-y-4">
              <li>
                <a href="https://www.dyslexia.com" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  International Dyslexia Association
                </a>
              </li>
              <li>
                <a href="https://www.understood.org" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  Understood.org - Learning & Attention Issues
                </a>
              </li>
              <li>
                <a href="https://www.bdadyslexia.org.uk" className="text-blue-600 hover:text-blue-800" target="_blank" rel="noopener noreferrer">
                  British Dyslexia Association
                </a>
              </li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  );
};

export default HelpSupport; 