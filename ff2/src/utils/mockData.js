// Mock data for development when API is not available
export const mockData = {
  banners: [
    {
      _id: "1",
      title: "Complete Health Checkup",
      imageUrl: "images/banners/banner1.png",
      test: "health-checkup",
      category: "Health Packages"
    },
    {
      _id: "2",
      title: "Blood Test Package",
      imageUrl: "images/banners/banner2.png",
      test: "blood-test",
      category: "Blood Tests"
    },
    {
      _id: "3",
      title: "Women's Health Checkup",
      imageUrl: "images/banners/banner3.png",
      test: "women-health",
      category: "Women Care"
    },
    {
      _id: "4",
      title: "Premium Diagnostics",
      imageUrl: "images/banners/carousel-3/bann-1.png",
      test: "premium-diagnostics",
      category: "Premium Care"
    },
    {
      _id: "5",
      title: "Advanced Health Screening",
      imageUrl: "images/banners/carousel-3/bann-2.png",
      test: "advanced-screening",
      category: "Advanced Care"
    },
    {
      _id: "6",
      title: "Comprehensive Wellness",
      imageUrl: "images/banners/carousel-3/bann-3.png",
      test: "comprehensive-wellness",
      category: "Wellness"
    }
  ],

  categories: [
    {
      _id: "1",
      name: "Complete Health Checkup",
      imagePath: "images/Tests/full-body.png",
      description: "Comprehensive health screening"
    },
    {
      _id: "2",
      name: "Blood Test Package",
      imagePath: "images/test-img/test-1.png",
      description: "Complete blood analysis"
    },
    {
      _id: "3",
      name: "Diabetes Package",
      imagePath: "images/Tests/diabaties.png",
      description: "Diabetes screening tests"
    },
    {
      _id: "4",
      name: "Heart Health Package",
      imagePath: "images/Tests/heart-cardio.png",
      description: "Cardiovascular health tests"
    },
    {
      _id: "5",
      name: "Thyroid Function Tests",
      imagePath: "images/Tests/thyroid.png",
      description: "Complete thyroid screening"
    },
    {
      _id: "6",
      name: "Vitamin Deficiency Package",
      imagePath: "images/Tests/vitamin.png",
      description: "Vitamin levels analysis"
    }
  ],

  vitalOrgans: [
    {
      _id: "1",
      name: "Heart Health",
      imagePath: "images/icon-svg/organ/heart.png"
    },
    {
      _id: "2",
      name: "Kidney Function",
      imagePath: "images/icon-svg/organ/kidney.png"
    },
    {
      _id: "3",
      name: "Liver Function",
      imagePath: "images/icon-svg/organ/liver.png"
    },
    {
      _id: "4",
      name: "Blood Health",
      imagePath: "images/icon-svg/organ/blood.png"
    },
    {
      _id: "5",
      name: "Bone Health",
      imagePath: "images/icon-svg/organ/bone.png"
    },
    {
      _id: "6",
      name: "Thyroid Health",
      imagePath: "images/icon-svg/organ/thyroid.png"
    }
  ],

  womenCare: [
    {
      _id: "1",
      name: "Women's Health Checkup",
      imagePath: "images/Tests/woman.png"
    },
    {
      _id: "2",
      name: "Women's Complete Package",
      imagePath: "images/Tests/lady.png"
    },
    {
      _id: "3",
      name: "Young Women's Health",
      imagePath: "images/Tests/girl.png"
    }
  ],

  menCare: [
    {
      _id: "1",
      name: "Men's Health Checkup",
      imagePath: "images/Tests/man.png"
    },
    {
      _id: "2",
      name: "Men's Complete Package",
      imagePath: "images/Tests/gentleman.png"
    },
    {
      _id: "3",
      name: "Young Men's Health",
      imagePath: "images/Tests/guy.png"
    }
  ],

  lifestyle: [
    {
      _id: "1",
      name: "Executive Health Package",
      imagePath: "images/test-img/test-2.png"
    },
    {
      _id: "2",
      name: "Fitness Package",
      imagePath: "images/test-img/test-3.png"
    },
    {
      _id: "3",
      name: "Senior Citizen Package",
      imagePath: "images/test-img/test-4.png"
    },
    {
      _id: "4",
      name: "Child Health Package",
      imagePath: "images/Tests/child.png"
    },
    {
      _id: "5",
      name: "Teen Health Package",
      imagePath: "images/Tests/boy.png"
    },
    {
      _id: "6",
      name: "Family Health Package",
      imagePath: "images/test-img/test-5.png"
    }
  ],

  specialCare: [
    {
      _id: "1",
      name: "Premium Health Package",
      imagePath: "images/Tests/full-body.png",
      price: 2999,
      originalPrice: 4999,
      totalTests: 75,
      category: "Special Care Packages",
      description: "Comprehensive health screening with advanced diagnostics"
    },
    {
      _id: "2",
      name: "VIP Health Checkup",
      imagePath: "images/test-img/test-5.png",
      price: 4999,
      originalPrice: 7999,
      totalTests: 120,
      category: "Special Care Packages",
      description: "Complete health assessment with specialist consultation"
    },
    {
      _id: "3",
      name: "Executive Health Package",
      imagePath: "images/test-img/test-6.png",
      price: 3999,
      originalPrice: 6499,
      totalTests: 95,
      category: "Special Care Packages",
      description: "Designed for busy professionals"
    }
  ],

  singleTest: [
    {
      _id: "1",
      name: "Complete Blood Count (CBC)",
      imagePath: "images/Tests/card-1.png",
      price: 299,
      originalPrice: 499,
      category: "Single Test",
      description: "Complete blood analysis including RBC, WBC, platelets"
    },
    {
      _id: "2",
      name: "Lipid Profile",
      imagePath: "images/Tests/heart-cardio.png",
      price: 399,
      originalPrice: 599,
      category: "Single Test",
      description: "Cholesterol and triglyceride levels"
    },
    {
      _id: "3",
      name: "Thyroid Function Test",
      imagePath: "images/Tests/thyroid.png",
      price: 499,
      originalPrice: 799,
      category: "Single Test",
      description: "TSH, T3, T4 hormone levels"
    },
    {
      _id: "4",
      name: "Blood Sugar Test",
      imagePath: "images/Tests/diabaties.png",
      price: 199,
      originalPrice: 299,
      category: "Single Test",
      description: "Fasting and random glucose levels"
    },

    {
      _id: "5",
      name: "Liver Function Test",
      imagePath: "images/Tests/fiver.png",
      price: 549,
      originalPrice: 799,
      category: "Single Test",
      description: "Complete liver enzyme analysis"
    }
  ],

  ads: [
    {
      _id: "1",
      title: "Special Health Offer",
      imageUrl: "images/banners/sec2-banner.png"
    },
    {
      _id: "2",
      title: "Women's Health Campaign",
      imageUrl: "images/banners/sec7woman.png"
    },
    {
      _id: "3",
      title: "Men's Health Campaign",
      imageUrl: "images/banners/sec8man.png"
    }
  ],

  specialOffers: [
    {
      id: 1,
      title: "Full Body Checkup + 1 Special Profile Test FREE",
      tests: "103 Tests",
      price: "₹999",
      oldPrice: "₹2299",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Complete Blood Count", "Liver Function Test", "Kidney Function Test", "Lipid Profile", "Sugar Test", "1 Special Profile Test"],
        preparation: "10-12 hours fasting required",
        sampleType: "Blood & Urine",
        reportTime: "24-48 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free Home Sample Collection",
        detailedInclusions: {
          "Complete Blood Count (CBC)": ["Haemoglobin", "PCV", "RBC Count", "Total WBC Count", "Differential Count", "Platelet Count"],
          "Liver Function Test": ["Bilirubin Total", "Bilirubin Direct", "Bilirubin Indirect", "SGOT", "SGPT", "Alkaline Phosphatase", "Total Protein", "Albumin", "Globulin", "A/G Ratio"],
          "Kidney Function Test": ["Urea", "Creatinine", "Uric Acid", "Calcium", "Phosphorus", "Sodium", "Potassium", "Chloride"],
          "Lipid Profile": ["Total Cholesterol", "Triglycerides", "HDL Cholesterol", "LDL Cholesterol", "VLDL Cholesterol", "Cholesterol/HDL Ratio"],
          "Sugar Screening": ["Fasting Blood Sugar", "HbA1c"],
          "Urine Analysis": ["Colour", "Appearance", "pH", "Specific Gravity", "Protein", "Glucose", "Ketone Bodies", "Bile Salts", "Bile Pigments", "Blood", "Nitrite"]
        }
      }
    },
    {
      id: 2,
      title: "Comprehensive Health Package",
      tests: "95 Tests",
      price: "₹899",
      oldPrice: "₹1999",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["Thyroid Profile", "Vitamin B12", "Vitamin D", "Iron Studies", "All CBC parameters"],
        preparation: "Fasting required",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "ISO Certified",
        homeCollection: "Available",
        detailedInclusions: {
          "Thyroid Profile": ["T3 Total", "T4 Total", "TSH"],
          "Vitamin Profile": ["Vitamin D Total", "Vitamin B12"],
          "Iron Studies": ["Serum Iron", "TIBC", "Transferrin Saturation"],
          "Complete Blood Count": ["Haemoglobin", "RBC", "WBC", "Platelets", "MCV", "MCH", "MCHC"],
          "Blood Sugar": ["Fasting Blood Sugar", "Post Prandial Blood Sugar", "HbA1c"]
        }
      }
    },
    {
      id: 3,
      title: "Heart Care Package",
      tests: "110 Tests",
      price: "₹1099",
      oldPrice: "₹2499",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Lipid Profile", "ECG", "Cardiac Markers", "Sugar", "CBC"],
        preparation: "Fasting mandatory",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free Home Collection",
        detailedInclusions: {
          "Lipid Profile": ["Total Cholesterol", "Triglycerides", "HDL", "LDL", "VLDL"],
          "Cardiac Markers": ["CK-MB", "Troponin I", "NT-proBNP", "Homocysteine", "hs-CRP"],
          "Diabetes": ["Fasting Blood Sugar", "HbA1c"],
          "Complete Blood Count": ["Haemoglobin", "WBC Count", "Platelet Count"]
        }
      }
    },
    {
      id: 4,
      title: "Diabetes Screening Package",
      tests: "78 Tests",
      price: "₹799",
      oldPrice: "₹1799",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["HbA1c", "Average Blood Glucose", "Lipid Profile", "Micro-albumin"],
        preparation: "Fasting required",
        sampleType: "Blood & Urine",
        reportTime: "12-24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Available"
      }
    },
    {
      id: 5,
      title: "Senior Citizen Health Package",
      tests: "120 Tests",
      price: "₹1299",
      oldPrice: "₹2999",
      image: "/images/Tests/full-body.png",
      discount: "56% OFF",
      details: {
        inclusions: ["Liver & Kidney Function", "Vitamin D & B12", "Lipid Profile", "Urine Routine"],
        preparation: "Fasting required",
        sampleType: "Blood & Urine",
        reportTime: "24-48 Hours",
        certification: "NABL Accredited",
        homeCollection: "Free"
      }
    },
    {
      id: 6,
      title: "Women Wellness Package",
      tests: "88 Tests",
      price: "₹899",
      oldPrice: "₹1999",
      image: "/images/Tests/full-body.png",
      discount: "55% OFF",
      details: {
        inclusions: ["Anemia Screening", "Thyroid Profile", "Bone Health", "CBC"],
        preparation: "Fasting required",
        sampleType: "Blood",
        reportTime: "24 Hours",
        certification: "NABL Accredited",
        homeCollection: "Available"
      }
    }
  ]
};
