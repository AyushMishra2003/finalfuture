import React from "react";
import { Star, CheckCircle } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/autoplay";

const GoogleReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      name: "Kousha A",
      image: "https://i.pravatar.cc/100?img=12",
      rating: 5,
      review:
        "After a couple dreadful months of tolerating my lower back pain, their diagnostics really helped me find the issue quickly!",
      date: "2 months ago",
    },
    {
      id: 2,
      name: "Jake",
      image: "https://i.pravatar.cc/100?img=3",
      rating: 5,
      review:
        "I have known Steven for a very long time. He is always friendly and professional with top-class service.",
      date: "4 months ago",
    },
    {
      id: 3,
      name: "Ranqermo",
      image: "https://i.pravatar.cc/100?img=8",
      rating: 5,
      review:
        "I’ve been lucky to know Steven my entire life, and his team at the diagnostics center is simply the best!",
      date: "1 month ago",
    },
    {
      id: 4,
      name: "Liam P",
      image: "https://i.pravatar.cc/100?img=15",
      rating: 5,
      review:
        "Excellent home sample collection and fast results. Totally recommended for anyone looking for reliability!",
      date: "3 weeks ago",
    },
    {
      id: 5,
      name: "Sarah Chen",
      image: "https://i.pravatar.cc/100?img=5",
      rating: 5,
      review:
        "The most comfortable blood draw experience I've had. The technician was so gentle and professional.",
      date: "2 weeks ago",
    },
    {
      id: 6,
      name: "Michael Ross",
      image: "https://i.pravatar.cc/100?img=11",
      rating: 5,
      review:
        "Reports were delivered faster than expected. The digital tracking of samples is a great feature!",
      date: "5 days ago",
    },
  ];

  const renderStars = (rating) =>
  Array.from({ length: 5 }, (_, i) => (
    <Star
      key={i}
      size={16}
      className={`star-icon ${
        i < rating ? "text-warning" : "text-muted"
      }`}
      style={{
        display: "inline-block",
        verticalAlign: "middle",
        marginRight: "4px",
      }}
      fill={i < rating ? "#ffc107" : "none"}
    />
  ));


  return (
    <section className="py-5 testimonials-section" style={{ background: "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 100%)" }}>
      <div className="container px-4">
        {/* Rating Summary & Heading */}
        <div className="text-center mb-5">
      <div className="d-inline-flex align-items-center mb-2 px-3 py-1 rounded-pill bg-white shadow-sm border gap-2">
  <img
      src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/512px-Google_2015_logo.svg.png"
    alt="Google"
    className="flex-shrink-0"
    style={{ width: "60px", height: "30px", display: "block" }}
  />

  <span className="small fw-bold text-secondary">
     Verified Reviews
  </span>
</div>

          <h2 className="fw-bold text-dark mt-2 mb-3" style={{ fontSize: "2.2rem", letterSpacing: "-0.5px" }}>
            Trusted by Thousands of Patients
          </h2>
          <div className="d-flex justify-content-center align-items-center gap-2">
            <span className="fw-bold text-dark fs-4">4.9</span>
            <div className="d-flex align-items-center flex-nowrap">{renderStars(5)}</div>
            <span className="text-muted small ms-1">(1,240+ Total Reviews)</span>
          </div>
        </div>

        {/* Swiper Carousel */}
        <div className="swiper-container-wrapper">
          <Swiper
            modules={[Autoplay, Pagination]}
            spaceBetween={30}
            slidesPerView={1}
            loop={true}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            pagination={{
              clickable: true,
              dynamicBullets: true,
            }}
            breakpoints={{
              640: {
                slidesPerView: 1,
              },
              768: {
                slidesPerView: 2,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
            className="testimonial-swiper"
          >
            {reviews.map((review) => (
              <SwiperSlide key={review.id} className="py-4">
                <div className="testimonial-card bg-white p-4 rounded-4 shadow-sm h-100 d-flex flex-column position-relative">
                  {/* Google Logo Shadow Background */}
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Color_Icon.svg/1200px-Google_Color_Icon.svg.png"
                    alt="Google Background"
                    className="position-absolute translate-middle"
                    style={{
                      top: "20px",
                      right: "-10px",
                      opacity: "0.05",
                      width: "60px",
                      pointerEvents: "none"
                    }}
                  />

                  <div className="d-flex align-items-center mb-3">
                    <div className="position-relative">
                      <img
                        src={review.image}
                        alt={review.name}
                        className="rounded-circle border border-2 border-primary border-opacity-10"
                        style={{ width: "56px", height: "56px", objectFit: "cover" }}
                      />
                      <div className="position-absolute bottom-0 end-0 bg-white rounded-circle p-1 shadow-sm d-flex align-items-center justify-content-center" style={{ width: "22px", height: "22px" }}>
                        <img
                          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_Color_Icon.svg/1200px-Google_Color_Icon.svg.png"
                          alt="G"
                          style={{ width: "12px", height: "12px" }}
                        />
                      </div>
                    </div>
                    <div className="ms-3">
                      <h6 className="fw-bold mb-0 text-dark d-flex align-items-center">
                        {review.name}
                        <CheckCircle className="ms-2 text-success" size={14} fill="#ecfdf5" />
                        <span className="ms-1 x-small fw-normal text-success">Verified</span>
                      </h6>
                      <span className="text-muted x-small">{review.date} on Google</span>
                    </div>
                  </div>

                  <div className="mb-2 d-flex align-items-center flex-nowrap">
  {renderStars(review.rating)}
</div>


                  <p className="text-secondary small mb-3 flex-grow-1" style={{ lineClamp: 3, WebkitLineClamp: 3, display: "-webkit-box", WebkitBoxOrient: "vertical", overflow: "hidden", lineHeight: "1.6" }}>
                    "{review.review}"
                  </p>

                  <div className="pt-3 border-top mt-auto">
                    <div className="d-flex align-items-center justify-content-between">
                      <span className="text-primary small fw-semibold">Read Full Review</span>
                      <div className="google-stars d-flex gap-1" style={{ opacity: 0.6 }}>
                        <div className="bg-danger rounded-circle" style={{ width: "6px", height: "6px" }}></div>
                        <div className="bg-warning rounded-circle" style={{ width: "6px", height: "6px" }}></div>
                        <div className="bg-success rounded-circle" style={{ width: "6px", height: "6px" }}></div>
                        <div className="bg-primary rounded-circle" style={{ width: "6px", height: "6px" }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>

      <style>{`
        .testimonials-section {
          overflow: hidden;
        }

        .testimonial-card {
          transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s ease;
          border: 1px solid rgba(0, 0, 0, 0.05);
        }

        .testimonial-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.08) !important;
          border-color: rgba(0, 162, 173, 0.2);
        }

        .x-small {
          font-size: 0.7rem;
        }

        .star-icon {
          transition: transform 0.3s ease;

        }
          .star-icon {
  flex-shrink: 0;
  line-height: 1;
}


        .testimonial-card:hover .star-icon {
          transform: scale(1.2);
          animation: starPulse 1s infinite alternate;
        }

        @keyframes starPulse {
          from { filter: drop-shadow(0 0 0px #ffc107); }
          to { filter: drop-shadow(0 0 4px #ffc107); }
        }

        .swiper-pagination-bullet-active {
          background: #00a2ad !important;
          width: 24px !important;
          border-radius: 4px !important;
        }

        .testimonial-swiper {
          padding-bottom: 50px !important;
        }

        .testimonial-card p {
          font-style: italic;
        }

        /* Responsive adjustments */
        @media (max-width: 768px) {
          .testimonial-card {
            padding: 1.5rem !important;
          }
          h2 {
            font-size: 1.8rem !important;
          }
        }
      `}</style>
    </section>
  );
};

export default GoogleReviewsSection;