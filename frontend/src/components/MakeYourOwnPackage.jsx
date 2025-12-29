import React, { useState } from "react";
import { Link } from "react-router-dom";

const MakeYourOwnPackage = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isButtonHovered, setIsButtonHovered] = useState(false);

  return (
    <section className="py-3 py-md-5 bg-light">
      <div className="container">
        {/* Premium Horizontal Banner Card */}
        <div
          className="position-relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, #00A2AD 0%, #00d4e0 100%)",
            borderRadius: "24px",
            boxShadow: isHovered
              ? "0 20px 40px rgba(0, 162, 173, 0.15)"
              : "0 10px 30px rgba(0, 0, 0, 0.08)",
            transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
            transform: isHovered ? "translateY(-4px)" : "translateY(0)",
          }}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="row g-0 align-items-center">
            {/* LEFT SECTION - Content Area */}
            {/* Mobile: col-7, Desktop: col-6 */}
            <div className="col-7 col-lg-6 col-md-6 p-3 p-md-5 d-flex flex-column justify-content-center">
              {/* Main Heading */}
              <h2
                className="fw-bold mb-2 mb-md-3"
                style={{
                  fontSize: "clamp(1.1rem, 4vw, 2.5rem)", // Smaller on mobile
                  color: "#ffffff",
                  lineHeight: "1.2",
                }}
              >
                Make{" "}
                <span
                   style={{
    color: "#ffffff",
    textShadow: "0 2px 10px rgba(0,0,0,0.1)",
  }}
                >
                Your Own
              </span>{" "}
              Package
            </h2>

            {/* Subheading */}
            <p
              className="mb-2 mb-md-3"
              style={{
                fontSize: "clamp(0.8rem, 2vw, 1.1rem)",
                color: "rgba(255, 255, 255, 0.95)",
                fontWeight: "600",
              }}
            >
              Choose only the tests you need
            </p>

            {/* Feature Line - HIDDEN ON MOBILE */}
            <p
              className="mb-3 d-none d-md-block"
              style={{
                fontSize: "0.9rem",
                color: "rgba(255, 255, 255, 0.9)",
                lineHeight: "1.6",
              }}
            >
              <span style={{ fontWeight: "600", color: "#ffffff" }}>
                Liver Function
              </span>{" "}
              |{" "}
              <span style={{ fontWeight: "600", color: "#ffffff" }}>
                Kidney Function
              </span>{" "}
              |{" "}
              <span style={{ fontWeight: "600", color: "#ffffff" }}>
                Thyroid
              </span>{" "}
              |{" "}
              <span style={{ fontWeight: "600", color: "#ffffff" }}>
                Diabetes
              </span>{" "}
              |{" "}
              <span style={{ fontWeight: "600", color: "#ffffff" }}>
                Heart Health
              </span>{" "}
              & more
            </p>

            {/* Supporting Text - HIDDEN ON MOBILE */}
            <p
              className="mb-4 d-none d-md-block"
              style={{
                fontSize: "1rem",
                color: "rgba(255, 255, 255, 0.85)",
                lineHeight: "1.7",
                maxWidth: "500px",
              }}
            >
              Build a personalized health checkup package with complete flexibility and savings.
            </p>

            {/* CTA Button */}
            <div>
              <Link
                to="/create-package"
                className="btn fw-semibold text-white d-inline-flex align-items-center"
                style={{
                  background: isButtonHovered
                    ? "linear-gradient(135deg, #28a745 0%, #20c997 100%)"
                    : "linear-gradient(135deg, #2ecc71 0%, #27ae60 100%)",
                  border: "none",
                  borderRadius: "50px",
                  // Mobile padding/size vs Desktop
                  padding: "0.5rem 1rem",
                  fontSize: "0.85rem",
                  boxShadow: isButtonHovered
                    ? "0 8px 25px rgba(46, 204, 113, 0.4)"
                    : "0 4px 15px rgba(46, 204, 113, 0.3)",
                  transform: isButtonHovered ? "scale(1.05)" : "scale(1)",
                  transition: "all 0.3s ease",
                  textDecoration: "none",
                }}
                onMouseEnter={() => setIsButtonHovered(true)}
                onMouseLeave={() => setIsButtonHovered(false)}
              >
                <i className="bi bi-plus-circle me-1 me-md-2" style={{ fontSize: "1rem" }}></i>
                Build Package
              </Link>
            </div>
          </div>

          {/* RIGHT SECTION - Visual Area */}
          {/* Mobile: col-5, Desktop: col-6 */}
          <div
            className="col-5 col-lg-6 col-md-6 position-relative"
            style={{
              // background removed to show parent gradient
              background: "transparent",
              minHeight: "auto", // Reduced for mobile
              height: "100%",     // Fill height
              overflow: "hidden",
              display: "flex",     // Flex to align content
              alignItems: "center",
              justifyContent: "center"
            }}
          >
            {/* Medical Illustration */}
            <div
              className="d-flex align-items-center justify-content-center w-100 h-100 position-relative"
              style={{
                // Desktop only top padding? No, let's keep centered.
                // Removing distinct top style for mobile/desktop split logic in CSS if needed
              }}
            >
              <img
                src={`${process.env.PUBLIC_URL}/images/doctr-left.png`}
                alt="Custom Health Package"
                className="img-fluid"
                style={{
                  maxHeight: "350px", // Limit max height
                  height: "auto",
                  width: "100%", // Fit width
                  objectFit: "contain",
                  filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.15))",
                  animation: "float 3s ease-in-out infinite",
                  // Custom mobile sizing via style block below or simple class
                }}
              />
            </div>

            {/* Floating Offer Card - Premium Badge */}
            <div
              className="position-absolute offer-badge"
              style={{
                top: "10px",
                right: "10px",
                background: "linear-gradient(135deg, #ffffff 0%, #f9f9f9 100%)",
                borderRadius: "12px",
                padding: "0.5rem 0.6rem", // Compact padding
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                border: "2px solid #2ecc71",
                animation: "offerPulse 2.5s ease-in-out infinite",
                minWidth: "auto", // Auto width for mobile
                textAlign: "center",
                zIndex: 10
              }}
            >
              {/* UP TO */}
              <div style={{ fontSize: "0.6rem", color: "#666", fontWeight: "600", letterSpacing: "0.5px", lineHeight: "1" }}>
                UP TO
              </div>

              {/* 75% OFF */}
              <div
                style={{
                  fontSize: "1.1rem", // Smaller for mobile base
                  fontWeight: "800",
                  background: "linear-gradient(135deg, #FFA500, #FF7A00)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  lineHeight: "1.1",
                  margin: "0.1rem 0",
                }}
              >
                75% OFF
              </div>
            </div>

            {/* Floating Medical Icons - Hide on small mobile to reduce clutter or keep small? 
                  User said "Friendly medical image + Small floating offer badge". 
                  Let's hide extra icons on mobile for cleaner look as requested "Clean spacing".
              */}
            <div
              className="position-absolute d-none d-md-flex"
              style={{
                bottom: "30px",
                left: "30px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "50%",
                width: "60px",
                height: "60px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                animation: "pulse 2s ease-in-out infinite",
              }}
            >
              <i className="bi bi-heart-pulse" style={{ fontSize: "1.8rem", color: "#e74c3c" }}></i>
            </div>

            <div
              className="position-absolute d-none d-md-flex"
              style={{
                bottom: "100px",
                left: "20px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "50%",
                width: "50px",
                height: "50px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                animation: "pulse 2s ease-in-out infinite 0.5s",
              }}
            >
              <i className="bi bi-clipboard2-check" style={{ fontSize: "1.5rem", color: "#00A2AD" }}></i>
            </div>

            <div
              className="position-absolute d-none d-md-flex"
              style={{
                top: "50%",
                left: "20px",
                background: "rgba(255, 255, 255, 0.95)",
                borderRadius: "50%",
                width: "45px",
                height: "45px",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                animation: "pulse 2s ease-in-out infinite 1s",
              }}
            >
              <i className="bi bi-droplet-fill" style={{ fontSize: "1.3rem", color: "#e74c3c" }}></i>
            </div>
          </div>
        </div>
      </div>
    </div>

      {/* Animations & Responsive Styles */ }
  <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
           50% {
            transform: scale(1.1);
            opacity: 0.8;
          }
        }

        @keyframes offerPulse {
          0%, 100% {
            transform: scale(1) translateY(0);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }
          50% {
            transform: scale(1.05) translateY(-2px);
            box-shadow: 0 8px 16px rgba(46, 204, 113, 0.3);
          }
        }

        /* Desktop specific adjustments */
        @media (min-width: 768px) {
           .col-lg-6[style*="min-height"] {
             min-height: 400px !important;
           }
           .btn {
             padding: 0.85rem 2.5rem !important;
             fontSize: 1.05rem !important;
           }
           .offer-badge {
             top: 40px !important;
             right: 20px !important;
             padding: 1rem 1.25rem !important;
             min-width: 140px !important;
           }
           .offer-badge div:nth-child(2) {
             font-size: 2.2rem !important;
           }
           .offer-badge div:first-child {
             font-size: 0.75rem !important;
           }
           
           /* Re-enable extra info on offer badge for desktop only? 
              Actually user asked for "Compact badge" on mobile.
              So we can hide the subtitle "on customized packages" on mobile.
           */
        }
        
        /* Mobile adjustments */
        @media (max-width: 767px) {
           /* Ensure image fits nicely */
           .col-5 img {
             max-height: 220px !important;
             width: auto !important;
             max-width: 150%; /* Allow slight overflow if needed or just contain */
             position: relative;
             left: -30px;
             
           }
             .col-5 {
               background:transparent;
               height:100vh;
               width:100%;
             }
               .col-7 {
                
                 position:relative;
                 left:20%;
                
               }
           .position-absolute{
            position:relative;
            left:50%;
            top:10%;
        
            width:150px;
           }
           /* Center the content vertically is handled by flex-column justify-content-center */
           
           /* Adjust container padding */
           .container {
             padding-left: 15px;
             padding-right: 15px;
            
           }
        }
      `}</style>
    </section >
  );
};

export default MakeYourOwnPackage;
