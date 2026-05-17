import React from 'react';
import { Link } from 'react-router-dom';

const TermsAndConditions = () => {
  return (
    <div className="terms-conditions-page">
      <div className="container py-5">
        <h1 className="mb-4">Terms and Conditions</h1>
        <p className="text-muted mb-4">Last updated: {new Date().getFullYear()}</p>

        <div className="row">
          <div className="col-lg-8">
            <div className="card">
              <div className="card-body">
                <h2>1. Acceptance of Terms</h2>
                <p>
                  By accessing and using FutureLabs services, you accept and agree to be bound by the 
                  terms and provision of this agreement. If you do not agree to abide by the above, 
                  please do not use this service.
                </p>

                <h2 className="mt-4">2. Service Description</h2>
                <p>
                  FutureLabs provides diagnostic test booking services. We facilitate the booking of 
                  laboratory tests and health checkups through our platform. We are not a medical 
                  practice and do not provide medical advice, diagnosis, or treatment.
                </p>

                <h2 className="mt-4">3. User Responsibilities</h2>
                <p>As a user of our services, you agree to:</p>
                <ul>
                  <li>Provide accurate and complete information</li>
                  <li>Maintain the confidentiality of your account credentials</li>
                  <li>Use the service only for lawful purposes</li>
                  <li>Follow all pre-test instructions provided</li>
                  <li>Pay for services as agreed</li>
                </ul>

                <h2 className="mt-4">4. Booking and Payment</h2>
                <ul>
                  <li>All bookings are subject to availability</li>
                  <li>Payment must be made at the time of booking or as otherwise agreed</li>
                  <li>Prices are subject to change without notice</li>
                  <li>Cancellation policies apply as specified during booking</li>
                </ul>

                <h2 className="mt-4">5. Test Results</h2>
                <p>
                  Test results are provided for informational purposes only and should not replace 
                  professional medical advice. Always consult with a qualified healthcare provider 
                  for medical diagnosis and treatment decisions.
                </p>

                <h2 className="mt-4">6. Privacy and Confidentiality</h2>
                <p>
                  We are committed to protecting your privacy and maintaining the confidentiality of 
                  your health information in accordance with applicable laws and our Privacy Policy.
                </p>

                <h2 className="mt-4">7. Limitation of Liability</h2>
                <p>
                  FutureLabs shall not be liable for any indirect, incidental, special, consequential, 
                  or punitive damages, including without limitation, loss of profits, data, use, 
                  goodwill, or other intangible losses.
                </p>

                <h2 className="mt-4">8. Disclaimer</h2>
                <p>
                  The information provided through our services is for general informational purposes 
                  only. We make no representations or warranties of any kind, express or implied, 
                  about the completeness, accuracy, reliability, or suitability of the information.
                </p>

                <h2 className="mt-4">9. Modifications</h2>
                <p>
                  We reserve the right to modify these terms at any time. Changes will be effective 
                  immediately upon posting on our website. Your continued use of the service after 
                  changes constitutes acceptance of the new terms.
                </p>

                <h2 className="mt-4">10. Governing Law</h2>
                <p>
                  These terms shall be governed by and construed in accordance with the laws of India, 
                  and any disputes shall be subject to the jurisdiction of the courts in Bengaluru, Karnataka.
                </p>

                <h2 className="mt-4">11. Contact Information</h2>
                <p>
                  For questions about these terms and conditions, please contact us:
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
                  <Link to="/privacy-policy" className="btn btn-outline-primary">
                    Privacy Policy
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
                <h5 className="card-title">Legal Notice</h5>
                <p className="card-text">
                  By using our services, you acknowledge that you have read, understood, 
                  and agree to be bound by these terms and conditions.
                </p>
              </div>
            </div>

            <div className="card mt-3">
              <div className="card-body">
                <h5 className="card-title">Questions?</h5>
                <p className="card-text">
                  Need clarification on our terms? Contact our legal team.
                </p>
                <a href="mailto:info@futurelabs.live" className="btn btn-outline-primary">
                  <i className="fas fa-envelope me-2"></i>Email Us
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
