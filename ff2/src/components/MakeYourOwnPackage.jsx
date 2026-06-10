import React from "react";
import { Link } from "react-router-dom";

const MakeYourOwnPackage = () => {
  return (
    <section className="py-3 py-md-5 bg-light">
      <div className="container">
        {/* Personalized Testing Banner Card */}
        <div className="moyp-card position-relative overflow-hidden">
          {/* SAVE badge — top right */}
          <div className="moyp-save-badge">
            <span className="moyp-save-label">SAVE</span>
            <span className="moyp-save-percent">75%</span>
            <span className="moyp-save-label">OFF</span>
          </div>

          {/* Content */}
          <div className="moyp-content">
            <span className="moyp-pill">PERSONALIZED TESTING</span>

            <div className="moyp-title">
              Build Your Own<br />Health Package
            </div>

            <div className="moyp-subtitle">
              Pick tests you need &amp; save up to{" "}
              <span className="moyp-highlight">75% OFF</span>
            </div>

            <Link to="/create-package" className="moyp-btn">
              <span className="moyp-btn-plus">+</span> Create My Package
            </Link>
          </div>

          {/* Doctor illustration — bottom right */}
          <img
            src={`${process.env.PUBLIC_URL}/images/doctr-left.png`}
            alt="Build your own health package"
            className="moyp-doctor"
          />
        </div>
      </div>

      <style>{`
        .moyp-card {
          background: linear-gradient(135deg, #14A6AC 0%, #0A8A90 100%);
          border-radius: 24px;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
          min-height: 230px;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .moyp-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 40px rgba(0, 138, 144, 0.25);
        }

        /* SAVE badge */
        .moyp-save-badge {
          position: absolute;
          top: 18px;
          right: 18px;
          z-index: 3;
          background: #ffffff;
          border-radius: 14px;
          padding: 8px 14px;
          text-align: center;
          line-height: 1.05;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.15);
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .moyp-save-label {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.5px;
          color: #6c757d;
        }
        .moyp-save-percent {
          font-size: 1.5rem;
          font-weight: 800;
          color: #FF8A00;
          line-height: 1;
          margin: 1px 0;
        }

        /* Content */
        .moyp-content {
          position: relative;
          z-index: 2;
          padding: 24px;
          max-width: 70%;
        }
        .moyp-pill {
          display: inline-block;
          background: rgba(255, 255, 255, 0.22);
          color: #ffffff;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.6px;
          padding: 7px 16px;
          border-radius: 30px;
          margin-bottom: 14px;
          backdrop-filter: blur(4px);
        }
        .moyp-title {
          color: #ffffff !important;
          -webkit-text-fill-color: #ffffff;
          font-weight: 800;
          font-size: clamp(1.5rem, 5vw, 2.4rem);
          line-height: 1.15;
          margin-bottom: 10px;
          text-shadow: 0 2px 8px rgba(0, 0, 0, 0.18);
        }
        .moyp-subtitle {
          color: #ffffff !important;
          opacity: 0.95;
          font-size: clamp(0.9rem, 2.4vw, 1.15rem);
          font-weight: 500;
          margin-bottom: 18px;
        }
        .moyp-highlight {
          color: #FFD60A;
          font-weight: 800;
        }

        /* CTA button */
        .moyp-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: #ffffff;
          color: #0A8A90;
          font-weight: 700;
          font-size: clamp(0.9rem, 2.4vw, 1.05rem);
          padding: 12px 26px;
          border-radius: 50px;
          text-decoration: none;
          box-shadow: 0 6px 18px rgba(0, 0, 0, 0.15);
          transition: all 0.3s ease;
        }
        .moyp-btn:hover {
          color: #066d72;
          transform: scale(1.04);
          box-shadow: 0 10px 26px rgba(0, 0, 0, 0.22);
        }
        .moyp-btn-plus {
          font-size: 1.2em;
          font-weight: 800;
          line-height: 1;
        }

        /* Doctor */
        .moyp-doctor {
          position: absolute;
          right: 0;
          bottom: 0;
          height: 92%;
          max-height: 240px;
          width: auto;
          object-fit: contain;
          object-position: bottom right;
          filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.18));
          z-index: 1;
          pointer-events: none;
        }

        @media (max-width: 575px) {
          .moyp-content {
            max-width: 60%;
            padding: 20px 16px;
          }
          .moyp-doctor {
            height: 78%;
            max-height: 200px;
          }
        }

        @media (min-width: 768px) {
          .moyp-card {
            min-height: 320px;
          }
          .moyp-content {
            padding: 44px 48px;
            max-width: 60%;
          }
          .moyp-save-badge {
            top: 28px;
            right: 28px;
            padding: 12px 20px;
          }
          .moyp-save-percent {
            font-size: 2rem;
          }
          .moyp-save-label {
            font-size: 0.72rem;
          }
          .moyp-doctor {
            height: 95%;
            max-height: 310px;
          }
        }
      `}</style>
    </section>
  );
};

export default MakeYourOwnPackage;
