import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleWhatsappSubscribe = (e) => {
    e.preventDefault();
    if (whatsappNumber.length === 10) {
      // Here you would typically send the subscription request
      alert("Thank you for subscribing to our WhatsApp updates!");
      setWhatsappNumber("");
    } else {
      alert("Please enter a valid 10-digit WhatsApp number");
    }
  };

  return (
    <>
      {/* Desktop Footer - Only show on medium screens (md) and above, hidden on mobile */}
      <div
        className="d-none d-md-block container-fluid p-0"
        id="footer"
      >
        <footer className="text-center text-lg-start text-white">
          <div className="container py-5">
            <div className="row my-4">
              {/* Logo and Description */}
              <div className="col-lg-4 col-md-12 col-sm-12 col-12 mb-4 mb-md-0">
                <div className="d-flex justify-content-center">
                  <Link to="/">
                    <img
                      className="ft-logo-1"
                      src={`${process.env.PUBLIC_URL}/images/logo/WhatsApp Image 2025-08-19 at 17.38.25_ee7be669.jpg`}
                      alt="FutureLabs"
                      loading="lazy"
                    />
                  </Link>
                </div>
                <p className="ft-p py-4">
                  Your trusted partner for convenient and reliable lab test
                  bookings. Delivering accuracy and care for your health, every
                  step of the way.
                </p>
              </div>

              {/* Quick Links */}
              <div className="col-lg-2 col-md-6 col-sm-12 col-12 mb-4 mb-md-0">
                <h5 className="text-uppercase mb-4 ft-h">quick links</h5>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/" className="text-white">
                      Home
                    </Link>
                  </li>
                  <li className="mb-2">
                    <a href="#about" className="text-white">
                      About
                    </a>
                  </li>
                  <li className="mb-2">
                    <a href="#footer" className="text-white">
                      Contact
                    </a>
                  </li>
                  <li className="mb-2">
                    <Link to="/privacy-policy" className="text-white">
                      Privacy Policy
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/terms-and-conditions" className="text-white">
                      Terms & Conditions
                    </Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/sitemap" className="text-white">
                      Sitemap
                    </Link>
                  </li>
                </ul>
              </div>

              {/* Social Media */}
              <div className="col-lg-3 col-md-6 col-sm-12 col-12 mb-4 mb-md-0">
                <h5 className="text-uppercase mb-4 ft-h">follow us on</h5>
                <ul className="socail-media p-0">
                  <li>
                    <a target="_blank" rel="noopener noreferrer" href="#">
                      <i className="fab fa-facebook-f"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" rel="noopener noreferrer" href="#">
                      <i className="fab fa-instagram"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" rel="noopener noreferrer" href="#">
                      <i className="fab fa-linkedin-in"></i>
                    </a>
                  </li>
                  <li>
                    <a target="_blank" rel="noopener noreferrer" href="#">
                      <i className="fab fa-twitter"></i>
                    </a>
                  </li>
                </ul>
              </div>

              {/* Contact Info */}
              <div className="col-lg-3 col-md-12 col-sm-12 col-12 mb-4 mb-md-0">
                <h5 className="text-uppercase mb-4 ft-h">Contact with us</h5>
                <ul className="list-unstyled">
                  <li>
                    <p>
                      <i className="fas fa-map-marker-alt pe-2"></i>No:38,
                      Ground Floor , Sumangali Sevashram Road,
                      Cholanayakanahalli, Hebbal Near City Pearl Super Market,
                      Bengaluru, Karnataka 560032
                    </p>
                  </li>
                  <li>
                    <a className="text-light" href="tel:08123459263">
                      <i className="fas fa-phone pe-2"></i>081234 59263
                    </a>
                  </li>
                  <li>
                    <a
                      className="text-light"
                      href="mailto:info@futurelabs.live"
                    >
                      <i className="fas fa-envelope pe-2 mb-0"></i>
                      info@futurelabs.live
                    </a>
                  </li>
                  <li className="pt-5">
                    <h4>Stay Updated!</h4>
                    <p>
                      Subscribe to our WhatsApp Community for expert health
                      tips, exclusive offers, and real-time updates on your lab
                      test bookings.
                    </p>
                    <form
                      className="form-whatsapp"
                      onSubmit={handleWhatsappSubscribe}
                    >
                      <div>
                        <input
                          placeholder="Enter whatsapp number"
                          type="tel"
                          value={whatsappNumber}
                          onChange={(e) => setWhatsappNumber(e.target.value)}
                          maxLength="10"
                          pattern="[0-9]{10}"
                        />
                        <button type="submit">Subscribe</button>
                      </div>
                    </form>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="container pb-5">
            <hr />
            <a className="text-white fw-bolder" href="https://futurelabs.live">
              futurelab.live
            </a>
            <br />
          </div>

          {/* Disclaimer */}
          <div
            className="container text-center p-3"
            style={{ backgroundColor: "rgba(0, 0, 0, 0.2)" }}
          >
            <p className="disclaimer">
              Disclaimer: Future Labs provides diagnostic test booking services
              only. The results are for informational purposes and should not
              replace professional medical advice. Consult a licensed healthcare
              provider for diagnosis and treatment. Future Labs is not liable
              for any decisions made based on the test results provided.
            </p>
          </div>
        </footer>
      </div>

      {/* Mobile Footer */}
      <footer className="mobile-footer d-md-none">{/* Only show on mobile, hide on md and above */}
        <Link to="/" className="active" aria-label="Home">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 12l8.95-8.95a1.125 1.125 0 011.6 0L21.75 12M4.5 9.75V20a1.125 1.125 0 001.125 1.125h4.125V17.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125A1.125 1.125 0 0020.25 20V9.75M8.25 21h7.5"
            />
          </svg>
          <span>Home</span>
        </Link>

        <Link to="/package" aria-label="Offers">
          <svg
            className="offr-moblie"
            fill="white"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 125"
          >
            <path d="M50,88.75c-2.755,0-4.656-2.1-6.334-3.953c-0.735-0.813-1.847-2.041-2.404-2.19c-0.629-0.151-2.197,0.334-3.345,0.701  c-2.338,0.747-4.988,1.589-7.301,0.251c-2.339-1.353-2.931-4.094-3.452-6.511c-0.25-1.16-0.593-2.747-1.029-3.184  c-0.436-0.435-2.024-0.779-3.184-1.028c-2.418-0.522-5.159-1.113-6.514-3.455c-1.337-2.312-0.492-4.961,0.255-7.297  c0.366-1.147,0.867-2.717,0.699-3.345c-0.149-0.559-1.377-1.67-2.19-2.407C13.35,54.656,11.25,52.754,11.25,50  s2.1-4.656,3.953-6.333c0.813-0.737,2.041-1.848,2.189-2.405c0.168-0.63-0.332-2.2-0.698-3.345c-0.746-2.339-1.592-4.988-0.253-7.3  c1.353-2.339,4.093-2.932,6.511-3.455c1.16-0.249,2.748-0.593,3.184-1.028c0.436-0.437,0.779-2.024,1.03-3.186  c0.521-2.417,1.113-5.159,3.456-6.511c2.307-1.338,4.957-0.488,7.297,0.254c1.147,0.369,2.714,0.862,3.344,0.701  c0.557-0.149,1.667-1.377,2.404-2.19C45.343,13.35,47.245,11.25,50,11.25s4.656,2.1,6.334,3.953c0.735,0.813,1.847,2.041,2.404,2.19  c0.634,0.164,2.198-0.332,3.345-0.701c2.339-0.747,4.987-1.589,7.301-0.251c2.339,1.353,2.931,4.094,3.452,6.511  c0.25,1.16,0.593,2.747,1.029,3.184c0.436,0.435,2.024,0.779,3.184,1.028c2.418,0.522,5.159,1.113,6.514,3.455  c1.337,2.312,0.492,4.961-0.255,7.297c-0.366,1.147-0.867,2.717-0.699,3.345c0.149,0.559,1.377,1.67,2.19,2.407  C86.65,45.344,88.75,47.246,88.75,50s-2.1,4.656-3.953,6.333c-0.813,0.737-2.041,1.848-2.189,2.405  c-0.168,0.63,0.332,2.2,0.698,3.345c0.746,2.339,1.592,4.988,0.253,7.3c-1.353,2.339-4.093,2.932-6.511,3.455  c-1.16,0.249-2.748,0.593-3.184,1.028c-0.436,0.437-0.779,2.024-1.03,3.186c-0.521,2.417-1.113,5.159-3.456,6.511  c-2.306,1.338-4.958,0.491-7.297-0.254c-1.146-0.366-2.711-0.854-3.344-0.701c-0.557,0.149-1.667,1.377-2.404,2.19  C54.657,86.65,52.755,88.75,50,88.75z M40.973,77.581c0.532,0,1.061,0.059,1.58,0.198c1.982,0.53,3.424,2.122,4.819,3.662  c0.731,0.808,2.091,2.31,2.628,2.31s1.897-1.501,2.628-2.31c1.394-1.541,2.837-3.132,4.818-3.662  c2.047-0.544,4.227,0.151,6.156,0.767c0.98,0.312,2.804,0.894,3.279,0.686c0.427-0.278,0.859-2.275,1.067-3.237  c0.444-2.058,0.905-4.187,2.382-5.664s3.605-1.936,5.664-2.38c0.961-0.208,2.961-0.64,3.239-1.072  c0.208-0.466-0.375-2.292-0.688-3.274c-0.615-1.926-1.313-4.111-0.765-6.157c0.529-1.98,2.122-3.423,3.663-4.819  c0.807-0.73,2.308-2.09,2.308-2.627s-1.501-1.897-2.308-2.627c-1.542-1.396-3.135-2.839-3.665-4.822  c-0.547-2.043,0.151-4.229,0.767-6.157c0.314-0.979,0.896-2.805,0.687-3.276c-0.272-0.427-2.275-0.859-3.237-1.067  c-2.058-0.444-4.187-0.903-5.664-2.38s-1.936-3.606-2.38-5.664c-0.209-0.962-0.641-2.964-1.072-3.24  c-0.466-0.2-2.292,0.378-3.274,0.688c-1.926,0.615-4.116,1.313-6.156,0.767c-1.982-0.53-3.424-2.122-4.819-3.662  c-0.731-0.808-2.091-2.31-2.628-2.31s-1.897,1.501-2.628,2.31c-1.394,1.541-2.837,3.132-4.818,3.662  c-2.046,0.549-4.229-0.151-6.156-0.767c-0.979-0.31-2.802-0.884-3.279-0.686c-0.427,0.278-0.859,2.275-1.067,3.237  c-0.444,2.058-0.905,4.187-2.382,5.664s-3.605,1.936-5.664,2.38c-0.961,0.208-2.961,0.64-3.239,1.072  c-0.208,0.466,0.375,2.292,0.688,3.274c0.615,1.926,1.313,4.111,0.765,6.157c-0.529,1.98-2.122,3.423-3.663,4.819  c-0.807,0.73-2.308,2.09-2.308,2.627s1.501,1.897,2.308,2.627c1.542,1.396,3.135,2.839,3.665,4.822  c0.547,2.043-0.151,4.229-0.767,6.157c-0.314,0.979-0.896,2.805-0.687,3.276c0.272,0.427,2.275,0.859,3.237,1.067  c2.058,0.444,4.187,0.903,5.664,2.38s1.936,3.606,2.38,5.664c0.209,0.962,0.641,2.964,1.072,3.24  c0.477,0.203,2.292-0.376,3.274-0.688C37.833,78.086,39.414,77.581,40.973,77.581z M38.51,65.027l26.516-26.519  c0.977-0.977,0.977-2.559,0-3.535s-2.559-0.977-3.535,0L34.974,61.492c-0.977,0.977-0.977,2.559,0,3.535  c0.488,0.488,1.128,0.732,1.768,0.732S38.021,65.515,38.51,65.027z M40,47.5c-4.136,0-7.5-3.364-7.5-7.5s3.364-7.5,7.5-7.5  s7.5,3.364,7.5,7.5S44.136,47.5,40,47.5z M40,37.5c-1.378,0-2.5,1.121-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.121,2.5-2.5  S41.378,37.5,40,37.5z M60,67.5c-4.136,0-7.5-3.364-7.5-7.5s3.364-7.5,7.5-7.5s7.5,3.364,7.5,7.5S64.136,67.5,60,67.5z M60,57.5  c-1.378,0-2.5,1.121-2.5,2.5s1.122,2.5,2.5,2.5s2.5-1.121,2.5-2.5S61.378,57.5,60,57.5z" />
          </svg>
          <span>Offers</span>
        </Link>

        <a href="tel:08123459263" aria-label="Call">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z"
            />
          </svg>
          <span>Call</span>
        </a>

        <a href="https://wa.me/+918123459263" aria-label="WhatsApp">
          <svg
            fill="white"
            className="wts-mblie"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 80"
          >
            <g>
              <path d="M57.4,25.4C55,16.2,47.6,8.8,38.3,6.5C29,4.2,18.9,7.2,12.5,14.4c-7.9,8.8-8.9,22-2.5,32c-0.5,3.6-0.9,7.2-1.4,10.8   c-0.2,1.3,1.4,2.2,2.5,1.9c3.5-1,7.1-1.9,10.6-2.9c9.5,3.9,20.5,2.1,28.1-4.9C56.9,44.8,59.8,34.6,57.4,25.4z M50.4,44.7   c-6,8.8-17.8,12.1-27.5,7.7c0,0,0,0-0.1,0c-0.4-0.2-0.9-0.3-1.5-0.2c-2.8,0.8-5.6,1.5-8.4,2.3c0.3-2.4,0.6-4.7,0.9-7.1   c0.1-0.8,0.3-1.7-0.1-2.5c-0.3-0.5-0.7-1-1-1.6c-0.7-1.2-1.3-2.5-1.8-3.8c-1.6-4.6-1.7-9.7-0.2-14.3c2.6-8.1,10-14.2,18.4-15.2   C37.8,8.8,46.5,13,51,20.3C55.6,27.8,55.3,37.4,50.4,44.7z" />
              <path d="M45.9,35.3l-4.5-3.5c-1.4-1.1-3.3-0.9-4.5,0.3l-1.3,1.3c-1-0.6-1.9-1.3-2.8-2.1c-0.8-0.8-1.5-1.8-2.1-2.8l1.3-1.3   c1.2-1.2,1.3-3.1,0.3-4.5l-3.5-4.6c-0.7-1-1.8-1.6-3-1.6c-1.2-0.1-2.4,0.4-3.2,1.2l-3.9,3.9c-2.2,2.2-2.7,5.6-1.3,8.4   c1.9,3.6,4.3,6.8,7.1,9.6c2.8,2.8,6.1,5.2,9.6,7.1c1.1,0.6,2.2,0.8,3.3,0.8c1.8,0,3.7-0.7,5-2.1l3.9-3.9c0.8-0.8,1.3-2,1.2-3.2   C47.5,37.1,46.9,36,45.9,35.3z M43.5,38.7l-3.9,3.9c-1,1-2.5,1.2-3.7,0.6c-3.2-1.7-6.1-3.8-8.7-6.4c-2.6-2.6-4.7-5.5-6.4-8.7   c-0.6-1.2-0.4-2.7,0.6-3.7l3.9-3.9c0,0,0,0,0.1,0c0,0,0,0,0,0c0.1,0,0.1,0,0.1,0.1l3.2,4.2L27.4,26c-1,1-1.3,2.6-0.6,3.9   c0.8,1.6,1.9,3,3.1,4.2c1.2,1.2,2.6,2.3,4.2,3.1c1.3,0.7,2.8,0.4,3.8-0.6l1.4-1.4l4.1,3.2c0,0,0.1,0,0.1,0.1   C43.5,38.6,43.5,38.7,43.5,38.7z" />
            </g>
          </svg>
          <span>WhatsApp</span>
        </a>

        <Link to="/profile" aria-label="Profile">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
            />
          </svg>
          <span>Profile</span>
        </Link>
      </footer>
    </>
  );
};

export default Footer;
