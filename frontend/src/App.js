import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import page components
import Home from './pages/Home';
import Cart from './pages/Cart';
import Checkups from './pages/Checkups';
import Package from './pages/Package';
import Product from './pages/Product';
import SingleTest from './pages/SingleTest';
import WomanCare from './pages/WomanCare';
import MenCare from './pages/MenCare';
import SpecialCare from './pages/SpecialCare';
import VitalOrgan from './pages/VitalOrgan';
import LifestyleCheckup from './pages/LifestyleCheckup';
import Sitemap from './pages/Sitemap';
import PrivacyPolicy from './pages/PrivacyPolicy';
import TermsAndConditions from './pages/TermsAndConditions';
import ErrorPage from './pages/ErrorPage';
import MoneySavingPackages from './components/MoneySavingPackage';
import Completehealth from './pages/Completehealth';
import CreatePackage from './pages/CreatePackage';
import SendOtpTest from './pages/SendOtpTest';
import SendOtpBhashSMSTest from './pages/SendOtpBhashSMSTest';

import UserProfile from './pages/UserProfile';
import UserOrders from './pages/UserOrders';
import PaymentCallback from './pages/PaymentCallback';
import PaymentPage from './pages/PaymentPage';
import Contact from './pages/Contact';

// Import admin components
import AdminDashboard from './admin/AdminDashboard';
import AdminLogin from './admin/AdminLogin';
import AdminAuthWrapper from './admin/AdminAuthWrapper';

// Import shared components
import Header from './components/Header';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import { Search, CheckCircle, AlertTriangle } from "react-feather";


function App() {
  const location = window.location;
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="App">
      {!isAdminRoute && <Header />}
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkups" element={<Checkups />} />
          <Route path="/money-saving-packages" element={<MoneySavingPackages />} />
          <Route path="/completehealth" element={<Completehealth />} />
          <Route path="/package" element={<Package />} />
          <Route path="/create-package" element={<CreatePackage />} />
          <Route path="/product" element={<Product />} />
          <Route path="/single-test" element={<SingleTest />} />
          <Route path="/woman-care" element={<WomanCare />} />
          <Route path="/men-care" element={<MenCare />} />
          <Route path="/special-care" element={<SpecialCare />} />
          <Route path="/vital-organ" element={<VitalOrgan />} />
          <Route path="/lifestyle-health-checkup" element={<LifestyleCheckup />} />
          <Route path="/sitemap" element={<Sitemap />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/send-otp-test" element={<SendOtpTest />} />
          <Route path="/send-otp-bhashsms-test" element={<SendOtpBhashSMSTest />} />
          <Route path="/contact" element={<Contact />} />

          {/* User Routes */}
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/orders" element={<UserOrders />} />

          <Route path="/payment/callback" element={<PaymentCallback />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Admin Routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminAuthWrapper><AdminDashboard /></AdminAuthWrapper>} />
          <Route path="/admin/*" element={<AdminAuthWrapper><AdminDashboard /></AdminAuthWrapper>} />

          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Routes>
      </main>
      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </div>
  );
}

export default App;
