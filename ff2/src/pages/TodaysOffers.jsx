import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Info,
  ChevronLeft,
  ChevronRight,
  Activity,
  Clock,
  ShieldCheck,
  ArrowLeft,
} from "lucide-react";
import apiService from "../utils/api";
import { getImagePath } from "../utils/config";
import { mockData } from "../utils/mockData";
import { addToCart as addToCartService } from "../utils/cart";
import { showToast } from "../utils/toast";

const FALLBACK_IMG = "/images/Tests/full-body.png";
const toNum = (v) =>
  typeof v === "number" ? v : parseInt(String(v || "").replace(/[^\d]/g, ""), 10) || 0;

// Normalize an API test/package into the offer-card shape this page renders.
const fromApi = (t) => ({
  id: t._id,
  title: t.name,
  desc: t.description,
  price: typeof t.price === "number" ? `₹${t.price}` : t.price,
  oldPrice: t.originalPrice ? `₹${t.originalPrice}` : "",
  discount: t.discountPercentage ? `${t.discountPercentage}% OFF` : "",
  tests: t.totalTests
    ? `${t.totalTests} Tests`
    : Array.isArray(t.includes) && t.includes.length
    ? `${t.includes.length} Tests`
    : "",
  reportsIn: t.reportsIn || (t.details && t.details.reportTime) || "",
  image: t.image ? getImagePath(t.image) : "",
  category: t.category || "",
});

// Fallback to the bundled mock offers if the API is unreachable.
const fromMock = (o) => ({
  id: o.id,
  title: o.title,
  desc: (o.details && o.details.homeCollection) || "",
  price: o.price,
  oldPrice: o.oldPrice,
  discount: o.discount,
  tests: o.tests,
  reportsIn: (o.details && o.details.reportTime) || "",
  image: o.image,
  category: "Special Offer",
});

const OfferCard = ({ offer, onKnowMore, onBook }) => {
  const [imgOk, setImgOk] = useState(true);
  return (
    <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100">
      {/* Green header — title, price, discount */}
      <div
        className="px-5 py-5 text-center"
        style={{ background: "linear-gradient(135deg, #0c7a63 0%, #056b58 100%)" }}
      >
        <h3 className="text-white font-extrabold text-lg md:text-xl leading-snug mb-3">
          {offer.title}
        </h3>
        <div className="flex items-center justify-center flex-wrap gap-x-3 gap-y-1">
          {offer.oldPrice && (
            <span className="text-white/60 line-through text-base md:text-lg">
              {offer.oldPrice}
            </span>
          )}
          <span className="text-white font-black text-3xl md:text-4xl">{offer.price}</span>
          {offer.discount && (
            <span className="bg-emerald-400 text-emerald-950 text-xs font-extrabold px-2.5 py-1 rounded-full">
              {offer.discount}
            </span>
          )}
        </div>
      </div>

      {/* Image + quick facts */}
      <div className="relative">
        <div
          className="w-full h-52 md:h-64 flex items-center justify-center"
          style={{ background: "linear-gradient(135deg, #e6fbf5 0%, #d3f3ee 100%)" }}
        >
          {imgOk && offer.image ? (
            <img
              src={offer.image}
              alt={offer.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                if (e.currentTarget.src.indexOf(FALLBACK_IMG) === -1) {
                  e.currentTarget.src = FALLBACK_IMG;
                } else {
                  setImgOk(false);
                }
              }}
            />
          ) : (
            <Activity size={64} className="text-emerald-500/60" />
          )}
        </div>

        {/* Know More — floating */}
        <button
          onClick={() => onKnowMore(offer)}
          className="absolute -bottom-5 left-1/2 -translate-x-1/2 inline-flex items-center gap-2 bg-white border border-emerald-600 text-emerald-700 font-bold text-sm px-5 py-2.5 rounded-full shadow-lg hover:bg-emerald-50 transition-colors whitespace-nowrap"
        >
          <Info size={16} /> Know More
        </button>
      </div>

      {/* Quick facts + Book Now */}
      <div className="pt-9 pb-5 px-5">
        <div className="flex items-center justify-center gap-5 text-gray-600 text-sm mb-5 flex-wrap">
          {offer.tests && (
            <span className="inline-flex items-center gap-1.5">
              <Activity size={15} className="text-emerald-600" /> {offer.tests}
            </span>
          )}
          {offer.reportsIn && (
            <span className="inline-flex items-center gap-1.5">
              <Clock size={15} className="text-emerald-600" /> Reports in {offer.reportsIn}
            </span>
          )}
          <span className="inline-flex items-center gap-1.5">
            <ShieldCheck size={15} className="text-emerald-600" /> NABL Certified Lab
          </span>
        </div>

        <button
          onClick={() => onBook(offer)}
          className="w-full h-14 rounded-2xl text-white font-extrabold text-lg tracking-wide shadow-lg transition-transform duration-150 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #ff9a2e 0%, #f97316 100%)",
            boxShadow: "0 10px 24px rgba(249,115,22,0.35)",
          }}
        >
          BOOK NOW
        </button>
      </div>
    </div>
  );
};

const TodaysOffers = () => {
  const navigate = useNavigate();
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const touchX = useRef(null);

  // Load offers dynamically from the API (fall back to bundled mock offers).
  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const res = await apiService.getTests();
        const data = (res && res.data) || [];
        const list = data
          .filter((t) => t.isActive !== false)
          .sort((a, b) => (b.discountPercentage || 0) - (a.discountPercentage || 0))
          .map(fromApi);
        if (alive && list.length) {
          setOffers(list);
          return;
        }
        throw new Error("empty");
      } catch (e) {
        if (alive) setOffers((mockData.specialOffers || []).map(fromMock));
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const count = offers.length;
  const next = useCallback(() => setActive((p) => (p + 1) % count), [count]);
  const prev = useCallback(() => setActive((p) => (p - 1 + count) % count), [count]);

  // Auto-advance
  useEffect(() => {
    if (paused || count <= 1) return;
    const id = setInterval(() => setActive((p) => (p + 1) % count), 5000);
    return () => clearInterval(id);
  }, [paused, count]);

  const handleBook = (offer) => {
    addToCartService({
      id: offer.id,
      _id: offer.id,
      name: offer.title,
      title: offer.title,
      price: toNum(offer.price),
      originalPrice: offer.oldPrice ? toNum(offer.oldPrice) : undefined,
      image: offer.image,
      category: offer.category || "Special Offer",
    });
    showToast(`${offer.title} added to cart`);
    navigate("/cart");
  };

  const handleKnowMore = (offer) => {
    navigate(`/product?id=${offer.id}&category=${encodeURIComponent(offer.category || "")}`);
  };

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
    setPaused(true);
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const diff = touchX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) (diff > 0 ? next : prev)();
    touchX.current = null;
    setPaused(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-4 md:pt-8 pb-12">
      <div className="max-w-xl mx-auto px-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 text-gray-500 hover:text-emerald-700 mb-3 transition-colors text-sm"
        >
          <ArrowLeft size={16} /> Back to Home
        </button>

        <h1 className="text-2xl md:text-3xl font-black text-gray-900 text-center mb-1">
          TODAY'S SPECIAL OFFER
        </h1>
        <p className="text-center text-gray-500 mb-6 text-sm">
          Premium health packages at unbeatable prices.
        </p>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-24">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-600 mb-3" />
            <p className="text-gray-500">Loading offers…</p>
          </div>
        ) : count === 0 ? (
          <div className="text-center py-24 text-gray-500">No offers available right now.</div>
        ) : (
          <div
            className="relative"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
          >
            {/* Prev / Next (desktop) */}
            {count > 1 && (
              <>
                <button
                  onClick={prev}
                  aria-label="Previous offer"
                  className="hidden md:flex absolute -left-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={next}
                  aria-label="Next offer"
                  className="hidden md:flex absolute -right-5 top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full bg-white shadow-lg items-center justify-center text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors"
                >
                  <ChevronRight size={22} />
                </button>
              </>
            )}

            <AnimatePresence mode="wait">
              <motion.div
                key={offers[active].id}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.3 }}
              >
                <OfferCard
                  offer={offers[active]}
                  onKnowMore={handleKnowMore}
                  onBook={handleBook}
                />
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            {count > 1 && (
              <div className="flex justify-center items-center gap-2 mt-5">
                {offers.map((o, i) => (
                  <button
                    key={o.id}
                    onClick={() => setActive(i)}
                    aria-label={`Go to offer ${i + 1}`}
                    style={{
                      height: 7,
                      width: i === active ? 20 : 7,
                      minHeight: 0,
                      minWidth: 0,
                      padding: 0,
                      border: "none",
                      borderRadius: 9999,
                      lineHeight: 0,
                      display: "block",
                      background: i === active ? "#0c7a63" : "#cbd5e1",
                      cursor: "pointer",
                      transition: "width 0.3s ease, background 0.3s ease",
                    }}
                  />
                ))}
              </div>
            )}

            {/* View all offers */}
            <div className="mt-6 text-center">
              <button
                onClick={() => navigate("/offers")}
                className="inline-flex items-center gap-2 text-emerald-700 font-bold text-sm border border-emerald-600 rounded-full px-6 py-2.5 hover:bg-emerald-600 hover:text-white transition-colors"
              >
                View All Offers
                <ChevronRight size={16} />
              </button>
              <p className="text-gray-400 text-xs mt-2">
                Showing {active + 1} of {count} offers
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TodaysOffers;
