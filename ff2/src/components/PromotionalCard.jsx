import React from "react";
import { Card, Button, Badge } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";

function PromotionalCard({ imageUrl }) {
  const handleImageError = (e) => {
    // Fallback to a default banner if the specified image fails to load
    e.target.src = "/images/banners/banner2.png";
    e.target.onerror = null; // Prevent infinite loop
  };

  return (
    <Card
      className="text-center shadow-lg promotional-card"
      style={{
        width: "24rem",
        borderRadius: "1rem",
        overflow: "hidden",
        position: "relative",
        border: "none",
        background: "linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)",
      }}
    >
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Card.Img
          src={imageUrl || "/images/banners/banner1.png"}
          alt="Healthcare Promotional Offer - Full Body Checkup"
          onError={handleImageError}
          style={{
            height: "320px",
            objectFit: "cover",
            transition: "transform 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.transform = "scale(1.05)")}
          onMouseLeave={(e) => (e.target.style.transform = "scale(1)")}
        />
        {/* Gradient overlay for better text readability */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.3) 100%)",
            pointerEvents: "none",
          }}
        ></div>
      </div>

      <div className="card-img-overlay p-0">
        {/* Positioning the "103 Test" badge */}
        <Badge
          bg="primary"
          className="position-absolute promotional-badge"
          style={{
            top: "1rem",
            left: "1rem",
            padding: "0.6rem 1rem",
            fontSize: "0.95rem",
            fontWeight: "600",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 15px rgba(0,123,255,0.3)",
          }}
        >
          🧪 103 Tests
        </Badge>

        {/* FREE Badge */}
        <Badge
          bg="success"
          className="position-absolute promotional-badge"
          style={{
            top: "1rem",
            right: "1rem",
            padding: "0.6rem 1rem",
            fontSize: "0.9rem",
            fontWeight: "700",
            borderRadius: "25px",
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            border: "2px solid rgba(255,255,255,0.3)",
            boxShadow: "0 4px 15px rgba(40,167,69,0.3)",
            animation: "pulse 2s infinite",
          }}
        >
          🎉 FREE
        </Badge>
      </div>

      <Card.Body className="pt-4 pb-4">
        <Card.Title
          as="h4"
          className="mb-3"
          style={{
            fontWeight: "700",
            color: "#2c3e50",
            lineHeight: "1.3",
          }}
        >
          Full Body Checkup +<br />
          <span
            style={{
              fontSize: "0.85em",
              color: "#27ae60",
              fontWeight: "600",
            }}
          >
            1 Special Profile Test FREE
          </span>
        </Card.Title>

        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-center gap-2">
            <h2
              className="text-danger mb-0"
              style={{
                fontWeight: "800",
                fontSize: "2.2rem",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              ₹999
            </h2>
            <div className="text-center">
              <small
                className="text-muted d-block"
                style={{ fontSize: "1rem" }}
              >
                <del style={{ color: "#6c757d" }}>₹2299</del>
              </small>
              <small
                className="text-success fw-bold"
                style={{ fontSize: "0.85rem" }}
              >
                Save 57%
              </small>
            </div>
          </div>
          <p
            className="text-primary mb-0 mt-2"
            style={{
              fontSize: "0.9rem",
              fontWeight: "600",
            }}
          >
            🏥 Limited Time Exclusive Offer
          </p>
        </div>

        <Button
          variant="success"
          size="lg"
          className="w-100"
          style={{
            background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
            border: "none",
            borderRadius: "50px",
            padding: "12px 0",
            fontSize: "1.1rem",
            fontWeight: "600",
            boxShadow: "0 6px 20px rgba(40,167,69,0.3)",
            transition: "all 0.3s ease",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 25px rgba(40,167,69,0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "0 6px 20px rgba(40,167,69,0.3)";
          }}
        >
          🛒 BOOK NOW
        </Button>

        <p className="text-muted mt-3 mb-0" style={{ fontSize: "0.8rem" }}>
          📍 Home Sample Collection Available
        </p>
      </Card.Body>
    </Card>
  );
}

export default PromotionalCard;
