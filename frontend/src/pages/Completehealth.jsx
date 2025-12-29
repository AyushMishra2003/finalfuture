import React, { useState, useEffect } from "react";
import {
  Plus,
  Home,
  Percent,
  Phone,
  MessageCircle,
  ShoppingCart,
  X,
  Star,
  Heart,
  Share,
  Filter,
  Search,
  Bell,
  User,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Clock,
  MapPin,
  ShieldCheck,
  Zap,
  Activity,
  Calendar,
  Info,
  Beaker,
  FileText,
  Thermometer,
  Award,
  ArrowRight,
  TrendingUp,
  Droplet,
  Brain,
  Pill,
} from "lucide-react";
import apiService from "../utils/api";

const Completehealth = () => {
  // State
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTest, setSelectedTest] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [cart, setCart] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [services, setServices] = useState([]);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [bookedItems, setBookedItems] = useState({}); // Track booked items: { testId: patientCount }
  const [expandedCategories, setExpandedCategories] = useState([]); // Track expanded test categories

  // Comprehensive Test Database
  const testDatabase = {
    "Liver Function": {
      icon: Activity,
      color: "#ef4444",
      tests: [
        {
          name: "SGOT (AST)",
          description: "Measures the enzyme Aspartate Aminotransferase in blood",
          importance: "Elevated levels indicate liver damage, heart problems, or muscle injury"
        },
        {
          name: "SGPT (ALT)",
          description: "Measures the enzyme Alanine Aminotransferase primarily found in liver",
          importance: "High levels are a specific indicator of liver inflammation or damage"
        },
        {
          name: "Alkaline Phosphatase (ALP)",
          description: "Enzyme found in liver, bones, and bile ducts",
          importance: "Helps detect liver disease, bile duct obstruction, and bone disorders"
        },
        {
          name: "Total Bilirubin",
          description: "Measures total amount of bilirubin in blood",
          importance: "High levels cause jaundice and indicate liver dysfunction or bile duct problems"
        },
        {
          name: "Direct Bilirubin",
          description: "Measures conjugated bilirubin processed by the liver",
          importance: "Elevated levels suggest bile duct obstruction or liver disease"
        },
        {
          name: "Indirect Bilirubin",
          description: "Measures unconjugated bilirubin before liver processing",
          importance: "High levels may indicate hemolytic anemia or Gilbert's syndrome"
        },
        {
          name: "Total Protein",
          description: "Measures combined albumin and globulin levels",
          importance: "Abnormal levels indicate liver disease, kidney disease, or nutritional problems"
        },
        {
          name: "Albumin",
          description: "Main protein made by the liver",
          importance: "Low levels indicate chronic liver disease, malnutrition, or kidney problems"
        },
        {
          name: "Globulin",
          description: "Group of proteins made by liver and immune system",
          importance: "Abnormal levels suggest liver disease, immune disorders, or infections"
        },
        {
          name: "A/G Ratio",
          description: "Ratio of Albumin to Globulin",
          importance: "Helps diagnose liver disease, kidney disease, and immune disorders"
        }
      ]
    },
    "Kidney Function": {
      icon: Droplet,
      color: "#3b82f6",
      tests: [
        {
          name: "Creatinine",
          description: "Waste product from muscle metabolism filtered by kidneys",
          importance: "Elevated levels indicate impaired kidney function or kidney disease"
        },
        {
          name: "Urea",
          description: "Waste product from protein breakdown",
          importance: "High levels suggest kidney dysfunction, dehydration, or high protein diet"
        },
        {
          name: "Uric Acid",
          description: "Waste product from purine metabolism",
          importance: "High levels cause gout and kidney stones; indicates kidney problems"
        },
        {
          name: "BUN (Blood Urea Nitrogen)",
          description: "Measures nitrogen portion of urea in blood",
          importance: "Elevated BUN indicates kidney disease, dehydration, or heart failure"
        },
        {
          name: "Sodium",
          description: "Essential electrolyte for fluid balance and nerve function",
          importance: "Abnormal levels affect hydration, blood pressure, and kidney function"
        },
        {
          name: "Potassium",
          description: "Electrolyte crucial for heart and muscle function",
          importance: "Imbalance can cause dangerous heart rhythm problems"
        },
        {
          name: "Chloride",
          description: "Electrolyte that helps maintain fluid and acid-base balance",
          importance: "Abnormal levels indicate kidney disease or metabolic disorders"
        }
      ]
    },
    "Lipid Profile": {
      icon: Heart,
      color: "#f59e0b",
      tests: [
        {
          name: "Total Cholesterol",
          description: "Measures all cholesterol in blood",
          importance: "High levels increase risk of heart disease and stroke"
        },
        {
          name: "HDL (Good Cholesterol)",
          description: "High-Density Lipoprotein removes excess cholesterol",
          importance: "Higher levels protect against heart disease; low HDL increases risk"
        },
        {
          name: "LDL (Bad Cholesterol)",
          description: "Low-Density Lipoprotein deposits cholesterol in arteries",
          importance: "High levels cause plaque buildup and increase heart attack risk"
        },
        {
          name: "Triglycerides",
          description: "Most common type of fat in blood from food and body",
          importance: "High levels increase risk of heart disease and pancreatitis"
        },
        {
          name: "VLDL",
          description: "Very Low-Density Lipoprotein carries triglycerides",
          importance: "Elevated levels contribute to plaque buildup in arteries"
        },
        {
          name: "TC/HDL Ratio",
          description: "Ratio of Total Cholesterol to HDL",
          importance: "Important cardiac risk indicator; lower ratio is better"
        }
      ]
    },
    "Thyroid Profile": {
      icon: Zap,
      color: "#8b5cf6",
      tests: [
        {
          name: "T3 Total",
          description: "Triiodothyronine hormone regulating metabolism",
          importance: "Abnormal levels indicate hyperthyroidism or hypothyroidism"
        },
        {
          name: "T4 Total",
          description: "Thyroxine hormone produced by thyroid gland",
          importance: "Measures thyroid function; affects metabolism, energy, and mood"
        },
        {
          name: "TSH (Ultrasensitive)",
          description: "Thyroid Stimulating Hormone from pituitary gland",
          importance: "Most sensitive test for thyroid disorders; guides treatment"
        }
      ]
    },
    "Blood Sugar": {
      icon: Activity,
      color: "#10b981",
      tests: [
        {
          name: "Fasting Blood Sugar",
          description: "Glucose level after 8-12 hours fasting",
          importance: "Screens for diabetes and prediabetes; monitors blood sugar control"
        },
        {
          name: "PP Blood Sugar",
          description: "Post-Prandial glucose 2 hours after meal",
          importance: "Shows how body processes sugar after eating; detects diabetes"
        },
        {
          name: "HbA1c",
          description: "Average blood sugar over past 2-3 months",
          importance: "Gold standard for diabetes diagnosis and long-term control monitoring"
        }
      ]
    },
    "Complete Blood Count": {
      icon: Beaker,
      color: "#ec4899",
      tests: [
        {
          name: "Hemoglobin",
          description: "Protein in red blood cells carrying oxygen",
          importance: "Low levels indicate anemia; high levels suggest dehydration or lung disease"
        },
        {
          name: "RBC Count",
          description: "Number of red blood cells per volume of blood",
          importance: "Abnormal counts indicate anemia, dehydration, or blood disorders"
        },
        {
          name: "WBC Count",
          description: "Number of white blood cells fighting infection",
          importance: "High counts suggest infection; low counts indicate immune problems"
        },
        {
          name: "Platelet Count",
          description: "Cells responsible for blood clotting",
          importance: "Low counts cause bleeding; high counts increase clotting risk"
        },
        {
          name: "PCV (Hematocrit)",
          description: "Percentage of blood volume occupied by red cells",
          importance: "Helps diagnose anemia, dehydration, and blood disorders"
        },
        {
          name: "MCV",
          description: "Mean Corpuscular Volume - average red cell size",
          importance: "Helps classify type of anemia and guide treatment"
        },
        {
          name: "MCH",
          description: "Mean Corpuscular Hemoglobin per red cell",
          importance: "Indicates amount of oxygen-carrying hemoglobin in each cell"
        },
        {
          name: "MCHC",
          description: "Mean Corpuscular Hemoglobin Concentration",
          importance: "Measures hemoglobin concentration; helps diagnose anemia types"
        },
        {
          name: "RDW",
          description: "Red Cell Distribution Width - variation in cell size",
          importance: "Helps differentiate between types of anemia"
        },
        {
          name: "Neutrophils",
          description: "Most abundant white blood cells fighting bacteria",
          importance: "High levels indicate bacterial infection; low levels increase infection risk"
        },
        {
          name: "Lymphocytes",
          description: "White blood cells fighting viruses and making antibodies",
          importance: "High in viral infections; low in immune deficiency"
        },
        {
          name: "Monocytes",
          description: "Large white blood cells removing dead cells and fighting infection",
          importance: "Elevated in chronic infections and inflammatory conditions"
        },
        {
          name: "Eosinophils",
          description: "White blood cells fighting parasites and allergies",
          importance: "High levels indicate allergies, asthma, or parasitic infections"
        },
        {
          name: "Basophils",
          description: "Least common white blood cells involved in allergic reactions",
          importance: "Elevated in allergic reactions and certain blood disorders"
        }
      ]
    },
    "Iron Deficiency": {
      icon: Pill,
      color: "#dc2626",
      tests: [
        {
          name: "Serum Iron",
          description: "Measures iron circulating in blood",
          importance: "Low levels indicate iron deficiency anemia"
        },
        {
          name: "TIBC",
          description: "Total Iron Binding Capacity",
          importance: "High TIBC suggests iron deficiency; helps diagnose anemia"
        },
        {
          name: "Transferrin Saturation",
          description: "Percentage of transferrin protein carrying iron",
          importance: "Low saturation indicates iron deficiency"
        },
        {
          name: "Ferritin",
          description: "Protein storing iron in body",
          importance: "Best indicator of total body iron stores; low means deficiency"
        }
      ]
    }
  };


  // Categories for Hero Buttons
  const categories = [
    "All",
    "Full Body",
    "Diabetes",
    "Cardiac",
    "Thyroid",
    "Women's Health",
    "Senior Citizen",
  ];

  // Stats for Hero Section
  const stats = [
    { label: "Tests Available", value: "150+", icon: Beaker, color: "#3b82f6" },
    { label: "Avg Report Time", value: "12 Hrs", icon: Clock, color: "#10b981" },
    { label: "Labs Certified", value: "100% NABL", icon: Award, color: "#f59e0b" },
    { label: "Happy Patients", value: "50k+", icon: Heart, color: "#ef4444" },
  ];

  // Fetch Data (Mock + API Fallback)
  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        // Simulating API call or using real one
        // const response = await apiService.getAllTests();
        // For now, using enhanced mock data to match the UI requirements
        const mockData = [
          {
            id: 1,
            title: "Premium Full Body Checkup",
            category: "Full Body",
            tier: "Premium",
            price: 2499,
            mrp: 4999,
            discount: "50% OFF",
            rating: 4.9,
            reviews: 128,
            reportTime: "24 Hours",
            sampleType: "Blood & Urine",
            fasting: "10-12 Hrs Fasting",
            testCount: 85,
            description: "Comprehensive health assessment covering all vital organs.",
            popular: true,
            features: ["Liver Function", "Kidney Function", "Lipid Profile", "Thyroid Profile", "Iron Deficiency"],
            whyNeeded: "To assess your overall health status and screen for common lifestyle diseases like diabetes, hypertension, and high cholesterol.",
            preparation: [
              "Do not eat or drink anything other than water for 10-12 hours before the test.",
              "Avoid alcohol 24 hours prior.",
              "Wear loose, comfortable clothing."
            ]
          },
          {
            id: 2,
            title: "Advanced Thyroid Profile",
            category: "Thyroid",
            tier: "Advanced",
            price: 899,
            mrp: 1499,
            discount: "40% OFF",
            rating: 4.8,
            reviews: 94,
            reportTime: "12 Hours",
            sampleType: "Blood",
            fasting: "Not Required",
            testCount: 3,
            description: "Detailed evaluation of thyroid hormones T3, T4, and TSH.",
            popular: false,
            features: ["T3 Total", "T4 Total", "TSH Ultrasensitive"],
            whyNeeded: "To diagnose thyroid disorders which can affect metabolism, energy levels, and mood.",
            preparation: [
              "No fasting required.",
              "Inform doctor if taking biotin supplements."
            ]
          },
          {
            id: 3,
            title: "Hba1c (Glycosylated Hemoglobin)",
            category: "Diabetes",
            tier: "Basic",
            price: 299,
            mrp: 500,
            discount: "40% OFF",
            rating: 4.9,
            reviews: 350,
            reportTime: "6 Hours",
            sampleType: "Blood",
            fasting: "Not Required",
            testCount: 1,
            description: "Gold standard test for monitoring long-term blood sugar control.",
            popular: true,
            features: ["Average Blood Sugar (Past 3 months)"],
            whyNeeded: "Crucial for diagnosing and monitoring diabetes management over time.",
            preparation: [
              "No fasting required.",
              "Can be taken at any time of the day."
            ]
          },
          {
            id: 4,
            title: "Vitamin Deficiency Package",
            category: "Full Body",
            tier: "Advanced",
            price: 1299,
            mrp: 2199,
            discount: "41% OFF",
            rating: 4.7,
            reviews: 210,
            reportTime: "24 Hours",
            sampleType: "Blood",
            fasting: "Required",
            testCount: 2,
            description: "Check for Vitamin D and B12 deficiencies standard in urban lifestyles.",
            popular: true,
            features: ["Vitamin D Total", "Vitamin B12"],
            whyNeeded: "Vitamin deficiencies can lead to fatigue, bone pain, and neurological issues.",
            preparation: [
              "Fasting is preferred.",
              "Morning sample collection recommended."
            ]
          },
          {
            id: 5,
            title: "Cardiac Risk Assessment",
            category: "Cardiac",
            tier: "Premium",
            price: 1999,
            mrp: 3500,
            discount: "42% OFF",
            rating: 4.9,
            reviews: 85,
            reportTime: "24 Hours",
            sampleType: "Blood",
            fasting: "12 Hrs Fasting",
            testCount: 15,
            description: "In-depth heart health checkup including lipid profile and cardiac markers.",
            popular: false,
            features: ["Lipid Profile", "Hs-CRP", "Homocysteine", "Lipoprotein (a)"],
            whyNeeded: "Evaluates risk factors for heart disease and stroke.",
            preparation: [
              "Strict 12-hour fasting required."
            ]
          },
          {
            id: 6,
            title: "Senior Citizen Wellness (Male)",
            category: "Senior Citizen",
            tier: "Premium",
            price: 2999,
            mrp: 5999,
            discount: "50% OFF",
            rating: 4.8,
            reviews: 60,
            reportTime: "24-48 Hours",
            sampleType: "Blood & Urine",
            fasting: "12 Hrs Fasting",
            testCount: 95,
            description: "Tailored health package for men over 60 monitoring age-related markers.",
            popular: false,
            features: ["PSA (Prostate)", "Bone Health", "Diabetes", "Heart Health"],
            whyNeeded: "Preventive care for age-specific health concerns in senior men.",
            preparation: [
              "12-hour fasting required.",
              "First morning urine sample preferred."
            ]
          }
        ];

        // Simulating network delay
        setTimeout(() => {
          setServices(mockData);
          setLoading(false);
        }, 800);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter Logic
  const filteredServices = services.filter((service) => {
    const matchesCategory = activeCategory === "All" || service.category === activeCategory;
    const matchesSearch = service.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Handlers
  const handleOpenDrawer = (test) => {
    setSelectedTest(test);
    setIsDrawerOpen(true);
    // Prevent body scroll when drawer is open
    document.body.style.overflow = 'hidden';
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
    setTimeout(() => setSelectedTest(null), 300); // Wait for animation
    document.body.style.overflow = 'auto';
  };

  const handleAddToCart = (test) => {
    // Update booked items state
    setBookedItems(prev => ({
      ...prev,
      [test.id]: (prev[test.id] || 0) + 1
    }));

    // Add to cart logic
    const newItem = { ...test, quantity: 1 };
    setCart([...cart, newItem]);

    // Dispatch custom event for Header cart count update
    const event = new CustomEvent('cartUpdated', { detail: { count: cart.length + 1 } });
    window.dispatchEvent(event);

    setToastMessage(`${test.title} added to cart!`);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Toggle test category expansion
  const toggleCategory = (categoryName) => {
    setExpandedCategories(prev =>
      prev.includes(categoryName)
        ? prev.filter(cat => cat !== categoryName)
        : [...prev, categoryName]
    );
  };

  const activeTest = selectedTest || {};

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)",
      fontFamily: `"Inter", "Segoe UI", sans-serif`,
      paddingBottom: "40px"
    }}>

      {/* Toast Notification */}
      {showToast && (
        <div style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          background: "rgba(16, 185, 129, 0.95)",
          color: "white",
          padding: "12px 24px",
          borderRadius: "12px",
          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
          zIndex: 1000,
          display: "flex",
          alignItems: "center",
          gap: "8px",
          animation: "slideIn 0.3s ease-out"
        }}>
          <CheckCircle size={20} />
          {toastMessage}
        </div>
      )}

      {/* Hero Section */}
      <div style={{
        background: "white",
        padding: "40px 20px 20px",
        borderBottomLeftRadius: "30px",
        borderBottomRightRadius: "30px",
        boxShadow: "0 4px 20px -5px rgba(0, 0, 0, 0.05)",
        marginBottom: "30px",
        position: "relative",
        overflow: "hidden"
      }}>
        {/* Background Decor */}
        <div style={{
          position: "absolute",
          top: "-50px",
          right: "-50px",
          width: "200px",
          height: "200px",
          background: "linear-gradient(45deg, #eff6ff, #dbeafe)",
          borderRadius: "50%",
          opacity: 0.6,
          zIndex: 0
        }} />

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "30px" }}>
            <span style={{
              color: "#3b82f6",
              fontWeight: "600",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              background: "#eff6ff",
              padding: "4px 12px",
              borderRadius: "20px"
            }}>
              Comprehensive Diagnostics
            </span>
            <h1 style={{
              fontSize: "clamp(28px, 5vw, 42px)",
              fontWeight: "800",
              color: "#1e293b",
              margin: "16px 0 8px",
              background: "linear-gradient(to right, #1e293b, #334155)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent"
            }}>
              Complete Health Solutions
            </h1>
            <p style={{ color: "#64748b", fontSize: "16px", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
              <ShieldCheck size={18} color="#10b981" /> 100% Accurate
              <span style={{ color: "#cbd5e1" }}>|</span>
              <Home size={18} color="#f59e0b" /> Free Home Collection
              <span style={{ color: "#cbd5e1" }}>|</span>
              <Award size={18} color="#6366f1" /> NABL Certified
            </p>
          </div>

          {/* Stats Row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
            gap: "15px",
            marginBottom: "30px"
          }}>
            {stats.map((stat, idx) => (
              <div key={idx} style={{
                background: "rgba(255,255,255,0.7)",
                backdropFilter: "blur(10px)",
                border: "1px solid #f1f5f9",
                borderRadius: "16px",
                padding: "15px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                boxShadow: "0 2px 10px rgba(0,0,0,0.03)"
              }}>
                <stat.icon size={24} color={stat.color} style={{ marginBottom: "8px" }} />
                <div style={{ fontSize: "20px", fontWeight: "700", color: "#1e293b" }}>{stat.value}</div>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500" }}>{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Search Bar */}
          <div style={{
            position: "relative",
            maxWidth: "600px",
            margin: "0 auto",
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.15)"
          }}>
            <Search
              size={20}
              color="#94a3b8"
              style={{ position: "absolute", left: "15px", top: "50%", transform: "translateY(-50%)" }}
            />
            <input
              type="text"
              placeholder="Search checks, tests, or organs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: "100%",
                padding: "16px 16px 16px 50px",
                borderRadius: "16px",
                border: "2px solid white",
                fontSize: "16px",
                outline: "none",
                transition: "all 0.3s",
                background: "white"
              }}
              onFocus={(e) => e.target.style.borderColor = "#3b82f6"}
              onBlur={(e) => e.target.style.borderColor = "white"}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>

        {/* Categories Filter */}
        <div style={{
          display: "flex",
          gap: "12px",
          overflowX: "auto",
          paddingBottom: "20px",
          marginBottom: "10px",
          scrollbarWidth: "none"
        }}>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                background: activeCategory === cat
                  ? "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)"
                  : "white",
                color: activeCategory === cat ? "white" : "#64748b",
                fontWeight: "600",
                fontSize: "14px",
                whiteSpace: "nowrap",
                cursor: "pointer",
                boxShadow: activeCategory === cat ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "0 2px 5px rgba(0,0,0,0.05)",
                transition: "all 0.3s ease"
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Loading Skeleton */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} style={{ height: "250px", background: "#e2e8f0", borderRadius: "20px", animation: "pulse 1.5s infinite" }} />
            ))}
          </div>
        )}

        {/* Tests Grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: "24px",
          opacity: loading ? 0 : 1,
          transition: "opacity 0.5s"
        }}>
          {filteredServices.map((service, index) => (
            <div
              key={service.id}
              onClick={() => handleOpenDrawer(service)}
              style={{
                background: "white",
                borderRadius: "20px",
                overflow: "hidden",
                boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
                cursor: "pointer",
                transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                position: "relative",
                border: "1px solid #f1f5f9",
                animation: `fadeInUp 0.5s ease forwards ${index * 0.1}s`
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-8px)";
                e.currentTarget.style.boxShadow = "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.05)";
              }}
            >
              {/* Badges */}
              {service.popular && (
                <div style={{
                  position: "absolute",
                  top: "16px",
                  right: "16px",
                  background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  boxShadow: "0 2px 5px rgba(245, 158, 11, 0.4)",
                  zIndex: 10
                }}>
                  MOST POPULAR
                </div>
              )}
              {service.tier === "Premium" && (
                <div style={{
                  position: "absolute",
                  top: "16px",
                  left: "16px",
                  background: "linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)",
                  color: "white",
                  fontSize: "11px",
                  fontWeight: "700",
                  padding: "4px 10px",
                  borderRadius: "20px",
                  zIndex: 10
                }}>
                  PREMIUM
                </div>
              )}

              <div style={{ padding: "24px" }}>
                {/* Header */}
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px", marginTop: "15px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "600", color: "#64748b",
                    background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px"
                  }}>
                    {service.category}
                  </span>
                </div>

                <h3 style={{
                  fontSize: "18px",
                  fontWeight: "700",
                  color: "#1e293b",
                  marginBottom: "12px",
                  lineHeight: "1.4"
                }}>
                  {service.title}
                </h3>

                {/* Quick Info */}
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  color: "#64748b",
                  fontSize: "13px",
                  marginBottom: "20px"
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Beaker size={16} color="#3b82f6" />
                    {service.testCount} Tests
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <Clock size={16} color="#10b981" />
                    {service.reportTime}
                  </div>
                </div>

                {/* Preview Features */}
                <div style={{ borderTop: "1px dashed #e2e8f0", paddingTop: "16px", marginBottom: "16px" }}>
                  {service.features.slice(0, 2).map((feature, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", marginBottom: "6px" }}>
                      <CheckCircle size={14} color="#10b981" />
                      {feature}
                    </div>
                  ))}
                  {service.features.length > 2 && (
                    <div style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "22px" }}>
                      + {service.features.length - 2} more parameters
                    </div>
                  )}
                </div>

                {/* Footer */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through", marginBottom: "2px" }}>
                      ₹{service.mrp}
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <div style={{ fontSize: "20px", fontWeight: "700", color: "#0f172a" }}>
                        ₹{service.price}
                      </div>
                      <div style={{ fontSize: "11px", fontWeight: "700", color: "#ef4444", background: "#fee2e2", padding: "2px 6px", borderRadius: "4px" }}>
                        {service.discount}
                      </div>
                    </div>
                  </div>

                  <div style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "50%",
                    background: "#3b82f6",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 4px 6px rgba(59, 130, 246, 0.3)"
                  }}>
                    <ArrowRight size={18} color="white" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {!loading && filteredServices.length === 0 && (
          <div style={{ textAlign: "center", padding: "60px 20px" }}>
            <div style={{ background: "#f1f5f9", width: "80px", height: "80px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <Search size={32} color="#94a3b8" />
            </div>
            <h3 style={{ color: "#1e293b", fontSize: "18px", fontWeight: "600", marginBottom: "8px" }}>No packages found</h3>
            <p style={{ color: "#64748b" }}>Try adjusting your search or category filter.</p>
          </div>
        )}
      </div>

      {/* Test Details Drawer (Right Side / Bottom Sheet) */}
      {/* Backdrop */}
      {isDrawerOpen && (
        <div
          onClick={handleCloseDrawer}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.4)",
            backdropFilter: "blur(4px)",
            zIndex: 40,
            animation: "fadeIn 0.3s"
          }}
        />
      )}

      {/* Drawer */}
      <div style={{
        position: "fixed",
        top: 0,
        right: 0,
        width: "100%",
        maxWidth: "500px",
        height: "100dvh",
        background: "white",
        zIndex: 9999,
        boxShadow: "-10px 0 25px rgba(0,0,0,0.1)",
        transform: isDrawerOpen ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        display: "flex",
        flexDirection: "column"
      }}>
        {/* Drawer Header */}
        <div style={{
          padding: "20px 24px",
          borderBottom: "1px solid #f1f5f9",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)"
        }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Package Details</h2>
          <button
            onClick={handleCloseDrawer}
            style={{
              border: "none",
              background: "#f1f5f9",
              borderRadius: "50%",
              width: "36px",
              height: "36px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s"
            }}
            onMouseOver={(e) => e.currentTarget.style.background = "#e2e8f0"}
            onMouseOut={(e) => e.currentTarget.style.background = "#f1f5f9"}
          >
            <X size={20} color="#64748b" />
          </button>
        </div>

        {/* Drawer Content - Scrollable */}
        <div style={{ flex: 1, overflowY: "auto", padding: "24px" }}>
          {activeTest && (
            <>
              {/* Title Block */}
              <div style={{ marginBottom: "24px" }}>
                <div style={{ display: "flex", gap: "10px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#3b82f6", background: "#eff6ff", padding: "4px 8px", borderRadius: "6px" }}>
                    {activeTest.category}
                  </span>
                  {activeTest.popular && (
                    <span style={{ fontSize: "12px", fontWeight: "600", color: "#d97706", background: "#fef3c7", padding: "4px 8px", borderRadius: "6px" }}>
                      Most Popular
                    </span>
                  )}
                </div>
                <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#1e293b", marginBottom: "12px", lineHeight: "1.3" }}>
                  {activeTest.title}
                </h1>
                <p style={{ fontSize: "15px", color: "#64748b", lineHeight: "1.6" }}>
                  {activeTest.description}
                </p>
              </div>

              {/* Info Grid */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Clock size={20} color="#3b82f6" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Report Time</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{activeTest.reportTime}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Beaker size={20} color="#8b5cf6" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Sample Type</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{activeTest.sampleType}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Activity size={20} color="#ef4444" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Fasting</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>{activeTest.fasting}</div>
                </div>
                <div style={{ background: "#f8fafc", padding: "16px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
                  <Award size={20} color="#f59e0b" style={{ marginBottom: "8px" }} />
                  <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>Certified</div>
                  <div style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a" }}>NABL Labs</div>
                </div>
              </div>

              {/* Sections */}
              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <Info size={18} color="#3b82f6" /> Why is this test needed?
                </h3>
                <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", background: "#eff6ff", padding: "16px", borderRadius: "12px" }}>
                  {activeTest.whyNeeded}
                </p>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <FileText size={18} color="#10b981" /> Tests Included ({activeTest.testCount})
                </h3>

                {/* Expandable Test Categories */}
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {activeTest.features?.map((categoryName, categoryIndex) => {
                    const categoryData = testDatabase[categoryName];
                    const isExpanded = expandedCategories.includes(categoryName);

                    // If category not in database, show simple version
                    if (!categoryData) {
                      return (
                        <div key={categoryIndex} style={{
                          border: "1px solid #e2e8f0",
                          borderRadius: "12px",
                          overflow: "hidden",
                          background: "white"
                        }}>
                          <div style={{
                            padding: "14px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "10px",
                            background: "#f8fafc"
                          }}>
                            <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981" }} />
                            <span style={{ fontSize: "14px", fontWeight: "600", color: "#334155" }}>
                              {categoryName}
                            </span>
                            <span style={{
                              marginLeft: "auto",
                              fontSize: "11px",
                              fontWeight: "600",
                              color: "#10b981",
                              background: "#d1fae5",
                              padding: "3px 8px",
                              borderRadius: "12px"
                            }}>
                              Included
                            </span>
                          </div>
                        </div>
                      );
                    }

                    const CategoryIcon = categoryData.icon;

                    return (
                      <div key={categoryIndex} style={{
                        border: "2px solid #e2e8f0",
                        borderRadius: "14px",
                        overflow: "hidden",
                        background: "white",
                        transition: "all 0.3s ease",
                        boxShadow: isExpanded ? "0 4px 12px rgba(0,0,0,0.08)" : "0 1px 3px rgba(0,0,0,0.05)"
                      }}>
                        {/* Category Header - Clickable */}
                        <div
                          onClick={() => toggleCategory(categoryName)}
                          style={{
                            padding: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                            cursor: "pointer",
                            background: isExpanded ? `${categoryData.color}10` : "#f8fafc",
                            transition: "all 0.3s ease",
                            userSelect: "none"
                          }}
                          onMouseEnter={(e) => {
                            if (!isExpanded) e.currentTarget.style.background = "#f1f5f9";
                          }}
                          onMouseLeave={(e) => {
                            if (!isExpanded) e.currentTarget.style.background = "#f8fafc";
                          }}
                        >
                          {/* Icon */}
                          <div style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: `${categoryData.color}15`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0
                          }}>
                            <CategoryIcon size={20} color={categoryData.color} />
                          </div>

                          {/* Category Name */}
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "15px", fontWeight: "700", color: "#1e293b", marginBottom: "2px" }}>
                              {categoryName}
                            </div>
                            <div style={{ fontSize: "12px", color: "#64748b" }}>
                              {categoryData.tests.length} test{categoryData.tests.length > 1 ? 's' : ''}
                            </div>
                          </div>

                          {/* Badge */}
                          <span style={{
                            fontSize: "11px",
                            fontWeight: "600",
                            color: "#10b981",
                            background: "#d1fae5",
                            padding: "4px 10px",
                            borderRadius: "12px",
                            whiteSpace: "nowrap"
                          }}>
                            Included
                          </span>

                          {/* Expand Icon */}
                          <div style={{
                            width: "28px",
                            height: "28px",
                            borderRadius: "8px",
                            background: isExpanded ? categoryData.color : "#e2e8f0",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            transition: "all 0.3s ease",
                            flexShrink: 0
                          }}>
                            {isExpanded ? (
                              <ChevronUp size={18} color="white" />
                            ) : (
                              <ChevronDown size={18} color="#64748b" />
                            )}
                          </div>
                        </div>

                        {/* Expanded Content - Individual Tests */}
                        <div style={{
                          maxHeight: isExpanded ? "2000px" : "0",
                          overflow: "hidden",
                          transition: "max-height 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                        }}>
                          <div style={{ padding: "0 16px 16px 16px" }}>
                            {categoryData.tests.map((test, testIndex) => (
                              <div key={testIndex} style={{
                                padding: "14px",
                                marginTop: "10px",
                                background: "#f8fafc",
                                borderRadius: "10px",
                                border: "1px solid #e2e8f0",
                                transition: "all 0.2s ease"
                              }}
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.background = "#f1f5f9";
                                  e.currentTarget.style.borderColor = categoryData.color;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.background = "#f8fafc";
                                  e.currentTarget.style.borderColor = "#e2e8f0";
                                }}
                              >
                                {/* Test Name */}
                                <div style={{
                                  fontSize: "14px",
                                  fontWeight: "700",
                                  color: "#1e293b",
                                  marginBottom: "8px",
                                  display: "flex",
                                  alignItems: "center",
                                  gap: "8px"
                                }}>
                                  <div style={{
                                    width: "6px",
                                    height: "6px",
                                    borderRadius: "50%",
                                    background: categoryData.color
                                  }} />
                                  {test.name}
                                </div>

                                {/* Description */}
                                <div style={{
                                  fontSize: "13px",
                                  color: "#475569",
                                  lineHeight: "1.5",
                                  marginBottom: "8px",
                                  paddingLeft: "14px"
                                }}>
                                  <strong style={{ color: "#64748b" }}>What it measures:</strong> {test.description}
                                </div>

                                {/* Importance */}
                                <div style={{
                                  fontSize: "13px",
                                  color: "#334155",
                                  lineHeight: "1.5",
                                  paddingLeft: "14px",
                                  borderLeft: `3px solid ${categoryData.color}`,
                                  background: "white",
                                  padding: "8px 12px",
                                  borderRadius: "6px",
                                  marginTop: "8px"
                                }}>
                                  <strong style={{ color: categoryData.color }}>Why it matters:</strong> {test.importance}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div style={{ marginBottom: "30px" }}>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#1e293b", marginBottom: "16px", display: "flex", alignItems: "center", gap: "8px" }}>
                  <CoffeeIcon /> Preparation
                </h3>
                <ul style={{ padding: "0", margin: "0", listStyle: "none" }}>
                  {activeTest.preparation?.map((step, i) => (
                    <li key={i} style={{
                      display: "flex",
                      gap: "12px",
                      marginBottom: "12px",
                      fontSize: "14px",
                      color: "#475569",
                      lineHeight: "1.5"
                    }}>
                      <span style={{
                        background: "#e2e8f0",
                        color: "#64748b",
                        width: "24px",
                        height: "24px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "12px",
                        fontWeight: "700",
                        flexShrink: 0
                      }}>{i + 1}</span>
                      {step}
                    </li>
                  ))}
                </ul>
              </div>
            </>
          )}
        </div>

        {/* Drawer Footer - Sticky */}
        <div style={{
          padding: "20px 24px",
          paddingBottom: "max(20px, env(safe-area-inset-bottom))",
          borderTop: "1px solid #f1f5f9",
          background: "white",
          boxShadow: "0 -4px 6px -1px rgba(0, 0, 0, 0.05)"
        }}>
          {activeTest && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "20px" }}>
              <div>
                <div style={{ fontSize: "12px", color: "#94a3b8", textDecoration: "line-through" }}>
                  Total MRP ₹{activeTest.mrp}
                </div>
                <div style={{ fontSize: "24px", fontWeight: "700", color: "#0f172a" }}>
                  ₹{activeTest.price}
                </div>
              </div>
              <button
                onClick={() => handleAddToCart(activeTest)}
                style={{
                  flex: 1,
                  background: bookedItems[activeTest.id] ? "linear-gradient(135deg, #FF8C00 0%, #FF7A00 100%)" : "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                  color: "white",
                  border: "none",
                  padding: "16px",
                  borderRadius: "14px",
                  fontSize: "16px",
                  fontWeight: "600",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                  transition: "all 0.3s ease"
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.transform = "translateY(-2px)";
                  e.currentTarget.style.boxShadow = bookedItems[activeTest.id] ? "0 10px 15px -3px rgba(255, 140, 0, 0.4)" : "0 10px 15px -3px rgba(16, 185, 129, 0.4)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}
              >
                {bookedItems[activeTest.id]
                  ? `${bookedItems[activeTest.id]} Patient${bookedItems[activeTest.id] > 1 ? 's' : ''} Booked`
                  : 'Book This Test'}
                <ArrowRight size={18} />
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        @keyframes slideIn {
          from { transform: translateY(-100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

// Helper component for icon
const CoffeeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="#f59e0b"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M17 8h1a4 4 0 1 1 0 8h-1"></path>
    <path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"></path>
    <line x1="6" y1="1" x2="6" y2="4"></line>
    <line x1="10" y1="1" x2="10" y2="4"></line>
    <line x1="14" y1="1" x2="14" y2="4"></line>
  </svg>
);

export default Completehealth;
