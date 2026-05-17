import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  return (
    <div className="privacy-policy-page">
      <div className="container py-5">
        <h1 className="mb-4">Privacy Policy</h1>
        <p className="text-muted mb-4">Last updated: {new Date().getFullYear()}</p>

        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h2>1. Information We Collect</h2>
                <p>
                  We collect information you provide directly to us, such as when you create an account, 
                  book a test, or contact us for support. This may include:
                </p>
                <ul>
                  <li>Personal identification information (name, email, phone number)</li>
                  <li>Health information relevant to the tests you book</li>
                  <li>Payment information for processing transactions</li>
                  <li>Location data for home sample collection services</li>
                </ul>

                <h2 className="mt-4">2. How We Use Your Information</h2>
                <p>We use the information we collect to:</p>
                <ul>
                  <li>Provide and maintain our diagnostic services</li>
                  <li>Process your test bookings and payments</li>
                  <li>Send you test results and related communications</li>
                  <li>Improve our services and customer experience</li>
                  <li>Comply with legal obligations</li>
                </ul>

                <h2 className="mt-4">3. Information Sharing</h2>
                <p>
                  We do not sell, trade, or otherwise transfer your personal information to third parties 
                  without your consent, except as described in this policy:
                </p>
                <ul>
                  <li>With healthcare providers for test processing</li>
                  <li>With payment processors for transaction handling</li>
                  <li>When required by law or to protect our rights</li>
                </ul>

                <h2 className="mt-4">4. Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information against 
                  unauthorized access, alteration, disclosure, or destruction. However, no method of 
                  transmission over the internet is 100% secure.
                </p>

                <h2 className="mt-4">5. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                  <li>Access your personal information</li>
                  <li>Correct inaccurate information</li>
                  <li>Request deletion of your information</li>
                  <li>Opt-out of marketing communications</li>
                </ul>

                <h2 className="mt-4">6. Cookies and Tracking</h2>
                <p>
                  We use cookies and similar tracking technologies to enhance your experience on our website. 
                  You can control cookie settings through your browser preferences.
                </p>

                <h2 className="mt-4">7. Changes to This Policy</h2>
                <p>
                  We may update this privacy policy from time to time. We will notify you of any changes 
                  by posting the new policy on this page and updating the "last updated" date.
                </p>

                <h2 className="mt-4">8. Contact Us</h2>
                <p>
                  If you have any questions about this privacy policy, please contact us:
                </p>
                <ul>
                  <li>Email: <a href="mailto:info@futurelabs.live">info@futurelabs.live</a></li>
                  <li>Phone: <a href="tel:08123459263">081234 59263</a></li>
                  <li>Address: No:38, Ground Floor, Sumangali Sevashram Road, Cholanayakanahalli, Hebbal, Bengaluru, Karnataka 560032</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Quick Links</h5>
                <div className="d-grid gap-2">
                  <Link to="/terms-and-conditions" className="btn btn-outline-primary">
                    Terms & Conditions
                  </Link>
                  <Link to="/sitemap" className="btn btn-outline-primary">
                    Sitemap
                  </Link>
                  <Link to="/" className="btn btn-primary">
                    Back to Home
                  </Link>
                </div>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Need Help?</h5>
                <p className="card-text">
                  Have questions about our privacy practices? Contact our support team.
                </p>
                <a href="tel:08123459263" className="btn btn-success">
                  <i className="fas fa-phone me-2"></i>Call Support
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
