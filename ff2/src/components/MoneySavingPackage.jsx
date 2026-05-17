import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import apiService from '../utils/api';

const MoneySavingPackages = () => {
  const [categories, setCategories] = useState([]);
  const [savingCurrent, setSavingCurrent] = useState(0);
  const navigate = useNavigate();

  // Fetch categories from API using existing apiService
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await apiService.getSelectedLessPrice();
        if (data?.data) {
          setCategories(data.data);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  const getImageUrl = (imagePath) => {
    if (!imagePath) return `${process.env.PUBLIC_URL}/images/placeholder.png`;
    if (imagePath.startsWith('http')) return imagePath;
    // Remove 'images/' prefix if it exists since PUBLIC_URL already includes it
    const cleanPath = imagePath.replace(/^images\//, '');
    return `${process.env.PUBLIC_URL}/images/${cleanPath}`;
  };

  const chunkedCategories = [];
  for (let i = 0; i < categories.length; i += 4) {
    chunkedCategories.push(categories.slice(i, i + 4));
  }

  const nextSavingSlide = () => {
    if (savingCurrent < chunkedCategories.length - 1) {
      setSavingCurrent((prev) => prev + 1);
    }
  };

  const prevSavingSlide = () => {
    if (savingCurrent > 0) {
      setSavingCurrent((prev) => prev - 1);
    }
  };

  return (
    <section className="py-5">
      <div className="container">
        {/* Section Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
          <div className="align-items-md-center">
            <h2 className="fw-bold mb-1" style={{ color: "rgb(0, 162, 173)", fontSize: "1.5rem" }}>
              Money-Saving Packages
            </h2>
            <p className="mb-0 fw-semibold" style={{ color: "rgb(255, 128, 0)" }}>
              Upto 75% Discount
            </p>
          </div>

          <Link
            to="/completehealth"
            className="btn fw-semibold text-white mt-3 mt-md-0 px-4 py-2"
            style={{
              background: "linear-gradient(180deg, #FFA500 0%, #FF7A00 100%)",
              border: "none",
              fontSize: "1rem",
              borderRadius: "8px",
              boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
            }}
          >
            VIEW ALL
          </Link>
        </div>

        {/* Carousel */}
        <div className="position-relative">
          <div className="overflow-hidden">
            <div
              className="d-flex transition-container"
              style={{
                transform: `translateX(-${savingCurrent * 100}%)`,
                transition: 'transform 0.5s ease-in-out'
              }}
            >
              {chunkedCategories.map((group, index) => (
                <div
                  key={index}
                  className="d-flex flex-wrap justify-content-center w-100"
                  style={{ minWidth: '100%' }}
                >
                  {group.map((item, idx) => (
                    <div
                      key={idx}
                      className="col-6 col-sm-6 col-md-3 col-lg-3 p-2"
                    >
                      <Link
                        to={`/completehealth?tab=${encodeURIComponent(item.name)}`}
                        className="text-decoration-none"
                      >
                        <div
                          className="card border-0 rounded-4 overflow-hidden shadow-sm h-100 position-relative money-saving-card"
                          style={{
                            borderRadius: "14px",
                            transition: "transform 0.3s ease, box-shadow 0.3s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-6px)";
                            e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.15)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.05)";
                          }}
                        >
                          <div className="position-relative overflow-hidden rounded-top-4">
                            <img
                              className="img-fluid w-100 money-saving-image"
                              src={getImageUrl(item.imagePath)}
                              alt={item.name}
                              style={{
                                height: "160px",
                                objectFit: "cover",
                                transition: "transform 0.3s ease",
                                borderTopLeftRadius: "14px",
                                borderTopRightRadius: "14px",
                              }}
                              onMouseEnter={(e) =>
                                (e.currentTarget.style.transform = "scale(1.05)")
                              }
                              onMouseLeave={(e) =>
                                (e.currentTarget.style.transform = "scale(1)")
                              }
                            />
                          </div>
                          <div
                            className="text-center py-2 rounded-bottom-4"
                            style={{
                              backgroundColor: "rgb(119, 217, 207)",
                              color: "#004d4d",
                              fontWeight: "600",
                              fontSize: "0.95rem",
                            }}
                          >
                            {item.name}
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Carousel Navigation Dots */}
          <div className="d-flex justify-content-center align-items-center mt-4 w-100" style={{ minHeight: "60px" }}>
            <div className="d-flex align-items-center mx-3">
              {chunkedCategories.map((_, index) => (
                <span
                  key={index}
                  className={`rounded-circle mx-1 ${index === savingCurrent ? 'bg-primary' : 'bg-secondary'}`}
                  style={{
                    width: "10px",
                    height: "10px",
                    opacity: index === savingCurrent ? 1 : 0.5,
                    cursor: "pointer",
                  }}
                  onClick={() => setSavingCurrent(index)}
                ></span>
              ))}
            </div>
          </div>
        </div>

        {/* Responsive Styles */}
        <style>{`
          .transition-container {
            display: flex;
          }
          
          .money-saving-card {
            height: 100%;
          }
          
          .money-saving-image {
            height: 160px !important;
            object-fit: cover;
          }

          /* Desktop - 4 cards per row */
          @media (min-width: 992px) {
            .col-lg-3 {
              flex: 0 0 25%;
              max-width: 25%;
            }
          }

          /* Tablet - 2 cards per row */
          @media (min-width: 768px) and (max-width: 991px) {
            .col-md-3 {
              flex: 0 0 50%;
              max-width: 50%;
            }
            
            .money-saving-image {
              height: 140px !important;
            }
          }

          /* Mobile - 2 cards per row */
          @media (max-width: 767px) {
            .col-6 {
              flex: 0 0 50%;
              max-width: 50%;
            }
            
            .money-saving-image {
              height: 130px !important;
            }
            
            .card {
              margin-bottom: 10px;
            }
          }
          
          /* Small Mobile */
          @media (max-width: 576px) {
            .money-saving-image {
              height: 120px !important;
            }
            
            .col-6 {
              padding: 5px;
            }
          }
          
          /* Extra small devices */
          @media (max-width: 400px) {
            .money-saving-image {
              height: 110px !important;
            }
          }
        `}</style>
      </div>
    </section>
  );
};

export default MoneySavingPackages;
