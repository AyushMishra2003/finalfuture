import React from 'react';
import { Link } from 'react-router-dom';

const Sitemap = () => {
  const siteLinks = [
    { name: 'Home', path: '/', description: 'Main homepage with all health packages' },
    { name: 'Health Checkups', path: '/checkups', description: 'Comprehensive health checkup packages' },
    { name: 'Exclusive Packages', path: '/package', description: 'Special exclusive health packages' },
    { name: 'Single Tests', path: '/single-test', description: 'Individual diagnostic tests' },
    { name: 'Women Care', path: '/woman-care', description: 'Health packages specifically for women' },
    { name: 'Men Care', path: '/men-care', description: 'Health packages specifically for men' },
    { name: 'Special Care', path: '/special-care', description: 'Specialized health care packages' },
    { name: 'Vital Organ Tests', path: '/vital-organ', description: 'Tests for vital organ health' },
    { name: 'Lifestyle Checkups', path: '/lifestyle-health-checkup', description: 'Health checkups based on lifestyle' },
    { name: 'Shopping Cart', path: '/cart', description: 'View and manage your cart items' },
    { name: 'Privacy Policy', path: '/privacy-policy', description: 'Our privacy policy and data protection' },
    { name: 'Terms & Conditions', path: '/terms-and-conditions', description: 'Terms and conditions of service' },
  ];

  const categories = [
    'Blood Tests',
    'Urine Tests',
    'Cardiac Tests',
    'Diabetes Tests',
    'Thyroid Tests',
    'Liver Function Tests',
    'Kidney Function Tests',
    'Lipid Profile',
    'Complete Blood Count',
    'Vitamin Tests',
    'Hormone Tests',
    'Cancer Screening',
    'Infectious Disease Tests',
    'Allergy Tests',
    'Pregnancy Tests',
  ];

  return (
    <div className="sitemap-page">
      <div className="container py-5">
        <h1 className="mb-4">Sitemap</h1>
        <p className="lead mb-5">
          Navigate through all pages and services available on FutureLabs healthcare platform.
        </p>

        {/* Main Pages */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="mb-4">Main Pages</h2>
            <div className="row">
              {siteLinks.map((link, index) => (
                <div key={index} className="col-lg-4 col-md-6 col-sm-12 mb-3">
                  <div className="card h-100">
                    <div className="card-body">
                      <h5 className="card-title">
                        <Link to={link.path} className="text-decoration-none">
                          {link.name}
                        </Link>
                      </h5>
                      <p className="card-text">{link.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Test Categories */}
        <div className="row mb-5">
          <div className="col-12">
            <h2 className="mb-4">Test Categories</h2>
            <div className="row">
              {categories.map((category, index) => (
                <div key={index} className="col-lg-3 col-md-4 col-sm-6 col-12 mb-3">
                  <div className="card">
                    <div className="card-body text-center">
                      <h6 className="card-title">{category}</h6>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="row">
          <div className="col-12">
            <h2 className="mb-4">Contact Information</h2>
            <div className="row">
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Get in Touch</h5>
                    <p className="card-text">
                      <i className="fas fa-map-marker-alt me-2"></i>
                      No:38, Ground Floor, Sumangali Sevashram Road, Cholanayakanahalli, Hebbal
                      Near City Pearl Super Market, Bengaluru, Karnataka 560032
                    </p>
                    <p className="card-text">
                      <i className="fas fa-phone me-2"></i>
                      <a href="tel:08123459263" className="text-decoration-none">081234 59263</a>
                    </p>
                    <p className="card-text">
                      <i className="fas fa-envelope me-2"></i>
                      <a href="mailto:info@futurelabs.live" className="text-decoration-none">
                        info@futurelabs.live
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">Quick Actions</h5>
                    <div className="d-grid gap-2">
                      <a href="tel:08123459263" className="btn btn-primary">
                        <i className="fas fa-phone me-2"></i>Call Now
                      </a>
                      <a href="https://wa.me/+918123459263" className="btn btn-success">
                        <i className="fab fa-whatsapp me-2"></i>WhatsApp
                      </a>
                      <Link to="/" className="btn btn-outline-primary">
                        <i className="fas fa-home me-2"></i>Back to Home
                      </Link>
                    </div>
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

export default Sitemap;
