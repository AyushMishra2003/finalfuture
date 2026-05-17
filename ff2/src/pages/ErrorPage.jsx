import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ErrorPage = () => {
  const navigate = useNavigate();

  const goBack = () => {
    navigate(-1);
  };

  return (
    <div className="error-page">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-6 col-md-8 col-sm-10">
            <div className="text-center">
              <div className="error-icon mb-4">
                <i className="fas fa-exclamation-triangle" style={{ fontSize: '5rem', color: '#dc3545' }}></i>
              </div>
              
              <h1 className="display-4 mb-3">Oops!</h1>
              <h2 className="mb-4">Something went wrong</h2>
              
              <p className="lead mb-4">
                We're sorry, but the page you're looking for doesn't exist or an error occurred.
              </p>

              <div className="error-details mb-4">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">What can you do?</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Check the URL for any typos
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Go back to the previous page
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Visit our homepage
                      </li>
                      <li className="mb-2">
                        <i className="fas fa-check-circle text-success me-2"></i>
                        Contact our support team
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="error-actions">
                <div className="d-grid gap-2 d-md-flex justify-content-md-center">
                  <Link to="/" className="btn btn-primary btn-lg me-md-2">
                    <i className="fas fa-home me-2"></i>
                    Go to Homepage
                  </Link>
                  <button onClick={goBack} className="btn btn-outline-primary btn-lg">
                    <i className="fas fa-arrow-left me-2"></i>
                    Go Back
                  </button>
                </div>
              </div>

              <div className="mt-5">
                <h5>Need Help?</h5>
                <p>If you continue to experience issues, please contact our support team:</p>
                <div className="d-flex justify-content-center gap-3">
                  <a href="tel:08123459263" className="btn btn-success">
                    <i className="fas fa-phone me-2"></i>
                    Call Support
                  </a>
                  <a href="mailto:info@futurelabs.live" className="btn btn-outline-primary">
                    <i className="fas fa-envelope me-2"></i>
                    Email Us
                  </a>
                  <a href="https://wa.me/+918123459263" className="btn btn-success">
                    <i className="fab fa-whatsapp me-2"></i>
                    WhatsApp
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Help Section */}
        <div className="row mt-5">
          <div className="col-12">
            <h3 className="text-center mb-4">Popular Pages</h3>
            <div className="row">
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fas fa-vial mb-2" style={{ fontSize: '2rem', color: '#007c6f' }}></i>
                    <h6 className="card-title">Health Checkups</h6>
                    <Link to="/checkups" className="btn btn-sm btn-outline-primary">
                      View Packages
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fas fa-female mb-2" style={{ fontSize: '2rem', color: '#007c6f' }}></i>
                    <h6 className="card-title">Women Care</h6>
                    <Link to="/woman-care" className="btn btn-sm btn-outline-primary">
                      Explore Tests
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fas fa-male mb-2" style={{ fontSize: '2rem', color: '#007c6f' }}></i>
                    <h6 className="card-title">Men Care</h6>
                    <Link to="/men-care" className="btn btn-sm btn-outline-primary">
                      View Tests
                    </Link>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 col-sm-12 mb-3">
                <div className="card">
                  <div className="card-body text-center">
                    <i className="fas fa-heart mb-2" style={{ fontSize: '2rem', color: '#007c6f' }}></i>
                    <h6 className="card-title">Vital Organs</h6>
                    <Link to="/vital-organ" className="btn btn-sm btn-outline-primary">
                      Check Health
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
