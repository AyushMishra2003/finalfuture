import React, { useState } from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const handleWhatsappSubscribe = (e) => {
    e.preventDefault();
    if (whatsappNumber.length === 10) {
      alert("Thank you for subscribing to our WhatsApp updates!");
      setWhatsappNumber("");
    } else {
      alert("Please enter a valid 10-digit WhatsApp number");
    }
  };

  const socials = [
    { label: "Facebook", href: "#", icon: <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /> },
    { label: "Instagram", href: "#", icon: <><rect x="2" y="2" width="20" height="20" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none" /></> },
    { label: "LinkedIn", href: "#", icon: <><path d="M16 8a6 6 0 016 6v6h-4v-6a2 2 0 00-4 0v6h-4v-10h4v1.5A4 4 0 0116 8z" /><rect x="2" y="9" width="4" height="11" /><circle cx="4" cy="4" r="2" /></> },
    { label: "Twitter", href: "#", icon: <path d="M23 4.5a8.4 8.4 0 01-2.4.7A4.2 4.2 0 0022.4 3a8.3 8.3 0 01-2.6 1A4.15 4.15 0 0012.7 7.8 11.8 11.8 0 014.2 3.5a4.15 4.15 0 001.3 5.5A4.1 4.1 0 013.6 8.5v.05a4.15 4.15 0 003.3 4.07 4.2 4.2 0 01-1.87.07 4.15 4.15 0 003.87 2.88A8.34 8.34 0 012 17.3a11.76 11.76 0 006.37 1.87c7.64 0 11.82-6.33 11.82-11.82 0-.18 0-.36-.01-.54A8.4 8.4 0 0023 4.5z" /> },
  ];

  const quickLinks = [
    { label: "Home", to: "/" },
    { label: "Health Checkups", to: "/checkups" },
    { label: "Create Package", to: "/create-package" },
    { label: "Special Offers", to: "/offers" },
    { label: "Privacy Policy", to: "/privacy-policy" },
    { label: "Terms & Conditions", to: "/terms-and-conditions" },
    { label: "Sitemap", to: "/sitemap" },
  ];

  return (
    <>
      {/* Main Footer — responsive, shown on all devices */}
      <footer className="site-footer" id="footer">
        <div className="site-footer-inner">
          {/* Brand */}
          <div className="sf-col sf-brand">
            <Link to="/" className="sf-logo-link">
              <span className="sf-logo">
                Future<span style={{ color: "#ffd24a" }}>Labs</span>
                <small>24</small>
              </span>
            </Link>
            <p className="sf-desc">
              Your trusted partner for convenient and reliable lab test bookings —
              delivering accuracy and care for your health, every step of the way.
            </p>
            <div className="sf-socials">
              {socials.map((s) => (
                <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="sf-col">
            <h5 className="sf-head">Quick Links</h5>
            <ul className="sf-links">
              {quickLinks.map((l) => (
                <li key={l.label}><Link to={l.to}>{l.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="sf-col">
            <h5 className="sf-head">Contact Us</h5>
            <ul className="sf-contact">
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                <span>No:38, Ground Floor, Sumangali Sevashram Road, Cholanayakanahalli, Hebbal, Bengaluru, Karnataka 560032</span>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z" /></svg>
                <a href="tel:08123459263">081234 59263</a>
              </li>
              <li>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="M22 6l-10 7L2 6" /></svg>
                <a href="mailto:info@futurelabs.live">info@futurelabs.live</a>
              </li>
            </ul>
          </div>

          {/* WhatsApp Subscribe */}
          <div className="sf-col">
            <h5 className="sf-head">Stay Updated!</h5>
            <p className="sf-desc" style={{ marginBottom: "14px" }}>
              Subscribe to our WhatsApp community for health tips, exclusive offers, and booking updates.
            </p>
            <form className="sf-subscribe" onSubmit={handleWhatsappSubscribe}>
              <input
                placeholder="Enter WhatsApp number"
                type="tel"
                value={whatsappNumber}
                onChange={(e) => setWhatsappNumber(e.target.value)}
                maxLength="10"
                pattern="[0-9]{10}"
              />
              <button type="submit">Subscribe</button>
            </form>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="sf-bottom">
          <span>© {new Date().getFullYear()} FutureLabs24. All rights reserved.</span>
          <a href="https://futurelabs.live" target="_blank" rel="noopener noreferrer">futurelabs.live</a>
        </div>

        {/* Disclaimer */}
        <div className="sf-disclaimer">
          Disclaimer: Future Labs provides diagnostic test booking services only. Results are for
          informational purposes and should not replace professional medical advice. Consult a licensed
          healthcare provider for diagnosis and treatment.
        </div>
      </footer>

      {/* Mobile bottom nav — mobile only */}
      <footer className="mobile-footer d-md-none">
        <Link to="/" className="active" aria-label="Home">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.95-8.95a1.125 1.125 0 011.6 0L21.75 12M4.5 9.75V20a1.125 1.125 0 001.125 1.125h4.125V17.25c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125A1.125 1.125 0 0020.25 20V9.75M8.25 21h7.5" />
          </svg>
          <span>Home</span>
        </Link>

        <Link to="/package" aria-label="Offers">
          <svg className="offr-moblie" fill="white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 125">
            <path d="M50,88.75c-2.755,0-4.656-2.1-6.334-3.953c-0.735-0.813-1.847-2.041-2.404-2.19c-0.629-0.151-2.197,0.334-3.345,0.701  c-2.338,0.747-4.988,1.589-7.301,0.251c-2.339-1.353-2.931-4.094-3.452-6.511c-0.25-1.16-0.593-2.747-1.029-3.184  c-0.436-0.435-2.024-0.779-3.184-1.028c-2.418-0.522-5.159-1.113-6.514-3.455c-1.337-2.312-0.492-4.961,0.255-7.297  c0.366-1.147,0.867-2.717,0.699-3.345c-0.149-0.559-1.377-1.67-2.19-2.407C13.35,54.656,11.25,52.754,11.25,50  s2.1-4.656,3.953-6.333c0.813-0.737,2.041-1.848,2.189-2.405c0.168-0.63-0.332-2.2-0.698-3.345c-0.746-2.339-1.592-4.988-0.253-7.3  c1.353-2.339,4.093-2.932,6.511-3.455c1.16-0.249,2.748-0.593,3.184-1.028c0.436-0.437,0.779-2.024,1.03-3.186  c0.521-2.417,1.113-5.159,3.456-6.511c2.307-1.338,4.957-0.488,7.297,0.254c1.147,0.369,2.714,0.862,3.344,0.701  c0.557-0.149,1.667-1.377,2.404-2.19C45.343,13.35,47.245,11.25,50,11.25s4.656,2.1,6.334,3.953c0.735,0.813,1.847,2.041,2.404,2.19  c0.634,0.164,2.198-0.332,3.345-0.701c2.339-0.747,4.987-1.589,7.301-0.251c2.339,1.353,2.931,4.094,3.452,6.511  c0.25,1.16,0.593,2.747,1.029,3.184c0.436,0.435,2.024,0.779,3.184,1.028c2.418,0.522,5.159,1.113,6.514,3.455  c1.337,2.312,0.492,4.961-0.255,7.297c-0.366,1.147-0.867,2.717-0.699,3.345c0.149,0.559,1.377,1.67,2.19,2.407  C86.65,45.344,88.75,47.246,88.75,50s-2.1,4.656-3.953,6.333c-0.813,0.737-2.041,1.848-2.189,2.405  c-0.168,0.63,0.332,2.2,0.698,3.345c0.746,2.339,1.592,4.988,0.253,7.3c-1.353,2.339-4.093,2.932-6.511,3.455  c-1.16,0.249-2.748,0.593-3.184,1.028c-0.436,0.437-0.779,2.024-1.03,3.186c-0.521,2.417-1.113,5.159-3.456,6.511  c-2.306,1.338-4.958,0.491-7.297-0.254c-1.146-0.366-2.711-0.854-3.344-0.701c-0.557,0.149-1.667,1.377-2.404,2.19  C54.657,86.65,52.755,88.75,50,88.75z M38.51,65.027l26.516-26.519c0.977-0.977,0.977-2.559,0-3.535s-2.559-0.977-3.535,0L34.974,61.492c-0.977,0.977-0.977,2.559,0,3.535  c0.488,0.488,1.128,0.732,1.768,0.732S38.021,65.515,38.51,65.027z M40,47.5c-4.136,0-7.5-3.364-7.5-7.5s3.364-7.5,7.5-7.5  s7.5,3.364,7.5,7.5S44.136,47.5,40,47.5z M60,67.5c-4.136,0-7.5-3.364-7.5-7.5s3.364-7.5,7.5-7.5s7.5,3.364,7.5,7.5S64.136,67.5,60,67.5z" />
          </svg>
          <span>Offers</span>
        </Link>

        <a href="tel:08123459263" aria-label="Call">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
          </svg>
          <span>Call</span>
        </a>

        <a href="https://wa.me/+918123459263" aria-label="WhatsApp">
          <svg fill="white" className="wts-mblie" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 80">
            <g>
              <path d="M57.4,25.4C55,16.2,47.6,8.8,38.3,6.5C29,4.2,18.9,7.2,12.5,14.4c-7.9,8.8-8.9,22-2.5,32c-0.5,3.6-0.9,7.2-1.4,10.8   c-0.2,1.3,1.4,2.2,2.5,1.9c3.5-1,7.1-1.9,10.6-2.9c9.5,3.9,20.5,2.1,28.1-4.9C56.9,44.8,59.8,34.6,57.4,25.4z M50.4,44.7   c-6,8.8-17.8,12.1-27.5,7.7c0,0,0,0-0.1,0c-0.4-0.2-0.9-0.3-1.5-0.2c-2.8,0.8-5.6,1.5-8.4,2.3c0.3-2.4,0.6-4.7,0.9-7.1   c0.1-0.8,0.3-1.7-0.1-2.5c-0.3-0.5-0.7-1-1-1.6c-0.7-1.2-1.3-2.5-1.8-3.8c-1.6-4.6-1.7-9.7-0.2-14.3c2.6-8.1,10-14.2,18.4-15.2   C37.8,8.8,46.5,13,51,20.3C55.6,27.8,55.3,37.4,50.4,44.7z" />
              <path d="M45.9,35.3l-4.5-3.5c-1.4-1.1-3.3-0.9-4.5,0.3l-1.3,1.3c-1-0.6-1.9-1.3-2.8-2.1c-0.8-0.8-1.5-1.8-2.1-2.8l1.3-1.3   c1.2-1.2,1.3-3.1,0.3-4.5l-3.5-4.6c-0.7-1-1.8-1.6-3-1.6c-1.2-0.1-2.4,0.4-3.2,1.2l-3.9,3.9c-2.2,2.2-2.7,5.6-1.3,8.4   c1.9,3.6,4.3,6.8,7.1,9.6c2.8,2.8,6.1,5.2,9.6,7.1c1.1,0.6,2.2,0.8,3.3,0.8c1.8,0,3.7-0.7,5-2.1l3.9-3.9c0.8-0.8,1.3-2,1.2-3.2   C47.5,37.1,46.9,36,45.9,35.3z" />
            </g>
          </svg>
          <span>WhatsApp</span>
        </a>
      </footer>

      <style>{`
        .site-footer {
          background: linear-gradient(135deg, #0c8a86 0%, #076b66 100%);
          color: #e6fffb;
        }
        .site-footer-inner {
          max-width: 1200px;
          margin: 0 auto;
          padding: 48px 20px 32px;
          display: grid;
          grid-template-columns: 1.4fr 1fr 1.3fr 1.2fr;
          gap: 36px;
        }
        .sf-logo { font-size: 1.7rem; font-weight: 800; color: #fff; letter-spacing: -0.5px; }
        .sf-logo small { font-size: 0.9rem; vertical-align: super; opacity: 0.85; margin-left: 2px; }
        .sf-logo-link { text-decoration: none; }
        .sf-desc { font-size: 0.92rem; line-height: 1.7; color: #c5f3ee; margin: 16px 0 18px; }
        .sf-socials { display: flex; gap: 12px; }
        .sf-socials a {
          width: 38px; height: 38px; border-radius: 50%;
          background: rgba(255,255,255,0.12); color: #fff;
          display: flex; align-items: center; justify-content: center;
          transition: all 0.25s ease;
        }
        .sf-socials a:hover { background: #ffd24a; color: #076b66; transform: translateY(-3px); }
        .sf-head {
          font-size: 1.05rem; font-weight: 700; color: #fff; margin-bottom: 18px;
          text-transform: uppercase; letter-spacing: 0.5px; position: relative; padding-bottom: 10px;
        }
        .sf-head::after {
          content: ""; position: absolute; left: 0; bottom: 0;
          width: 36px; height: 3px; border-radius: 3px; background: #ffd24a;
        }
        .sf-links { list-style: none; padding: 0; margin: 0; }
        .sf-links li { margin-bottom: 11px; }
        .sf-links a {
          color: #c5f3ee; text-decoration: none; font-size: 0.92rem; transition: all 0.2s ease;
          display: inline-block;
        }
        .sf-links a:hover { color: #fff; padding-left: 5px; }
        .sf-contact { list-style: none; padding: 0; margin: 0; }
        .sf-contact li { display: flex; gap: 10px; margin-bottom: 14px; font-size: 0.9rem; line-height: 1.5; color: #c5f3ee; }
        .sf-contact li svg { flex-shrink: 0; margin-top: 2px; color: #ffd24a; }
        .sf-contact a { color: #c5f3ee; text-decoration: none; }
        .sf-contact a:hover { color: #fff; }
        .sf-subscribe { display: flex; background: #fff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 14px rgba(0,0,0,0.15); }
        .sf-subscribe input { flex: 1; border: none; outline: none; padding: 12px 14px; font-size: 0.9rem; color: #0f172a; min-width: 0; }
        .sf-subscribe button {
          border: none; background: linear-gradient(135deg, #FFA500, #FF7A00); color: #fff;
          font-weight: 700; padding: 0 18px; cursor: pointer; white-space: nowrap; font-size: 0.9rem;
        }
        .sf-bottom {
          border-top: 1px solid rgba(255,255,255,0.15);
          max-width: 1200px; margin: 0 auto; padding: 18px 20px;
          display: flex; justify-content: space-between; align-items: center; gap: 12px; flex-wrap: wrap;
          font-size: 0.85rem; color: #c5f3ee;
        }
        .sf-bottom a { color: #ffd24a; font-weight: 700; text-decoration: none; }
        .sf-disclaimer {
          background: rgba(0,0,0,0.18); padding: 14px 20px; text-align: center;
          font-size: 0.78rem; line-height: 1.6; color: #b6e9e3;
          max-width: 100%;
        }

        /* Tablet */
        @media (max-width: 900px) {
          .site-footer-inner { grid-template-columns: 1fr 1fr; gap: 30px; }
        }
        /* Mobile */
        @media (max-width: 600px) {
          .site-footer-inner { grid-template-columns: 1fr; gap: 28px; padding: 36px 18px 24px; text-align: left; }
          .sf-bottom { flex-direction: column; text-align: center; }
        }
        /* Clear the fixed mobile bottom-nav (70px) so footer isn't hidden behind it */
        @media (max-width: 767px) {
          .site-footer { padding-bottom: 78px; }
        }
      `}</style>
    </>
  );
};

export default Footer;
