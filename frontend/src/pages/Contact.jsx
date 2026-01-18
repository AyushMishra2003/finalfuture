import React, { useState } from "react";
import { motion } from "framer-motion";
import {
    MapPin, Phone, Mail, Clock, Send,
    MessageCircle, Calendar, CheckCircle,
    AlertCircle, ArrowRight
} from "lucide-react";

const Contact = () => {
    const [formState, setFormState] = useState({
        name: "",
        email: "",
        phone: "",
        department: "",
        message: ""
    });
    const [focusedField, setFocusedField] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleChange = (e) => {
        setFormState({ ...formState, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        // Simulate API call
        setTimeout(() => {
            setIsSubmitting(false);
            setIsSuccess(true);
            setTimeout(() => setIsSuccess(false), 3000);
            setFormState({ name: "", email: "", phone: "", department: "", message: "" });
        }, 1500);
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    return (
        <div className="min-h-screen bg-white font-sans overflow-x-hidden">
            {/* 1. Hero Section */}
            <section className="relative w-full h-[60vh] flex items-center justify-center bg-white overflow-hidden">
                {/* Animated Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-teal-50 via-white to-blue-50 opacity-70"></div>

                {/* Abstract Medical Shapes (Animated) */}
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                    className="absolute top-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full border border-teal-100 opacity-30 blur-3xl"
                />
                <motion.div
                    animate={{ rotate: -360 }}
                    transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                    className="absolute bottom-[-10%] right-[-5%] w-[600px] h-[600px] rounded-full border border-blue-100 opacity-30 blur-3xl"
                />

                {/* Content */}
                <div className="relative z-10 text-center px-4">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8 }}
                    >
                        <span className="inline-block px-4 py-1 mb-4 text-xs font-bold tracking-widest text-teal-600 uppercase bg-teal-50 rounded-full shadow-sm border border-teal-100">
                            Future of Diagnostics
                        </span>
                    </motion.div>

                    <motion.h1
                        initial="hidden"
                        animate="visible"
                        variants={fadeInUp}
                        className="text-5xl md:text-7xl font-extrabold text-slate-800 tracking-tight mb-4"
                    >
                        Connect With <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-500 to-blue-600">Future Lab</span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.3, duration: 0.8 }}
                        className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto font-light"
                    >
                        Advanced Diagnostics. Human Care. We’re here to guide your health journey.
                    </motion.p>
                </div>

                {/* Pulse Line */}
                <div className="absolute bottom-0 left-0 w-full h-24 overflow-hidden opacity-20">
                    <svg viewBox="0 0 1440 320" className="w-full h-full">
                        <path fill="#0d9488" fillOpacity="1" d="M0,160L48,170.7C96,181,192,203,288,197.3C384,192,480,160,576,149.3C672,139,768,149,864,170.7C960,192,1056,224,1152,213.3C1248,203,1344,149,1392,122.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
                    </svg>
                </div>
            </section>

            {/* 2. Glass Contact Card Section */}
            <section className="relative z-20 -mt-20 px-4 pb-20 container mx-auto">
                <div className="bg-white/80 backdrop-blur-xl border border-white/50 rounded-3xl shadow-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 gap-0 relative">

                    {/* Left: Contact Form */}
                    <div className="lg:col-span-7 p-8 md:p-12 lg:p-16 relative">
                        <h2 className="text-3xl font-bold text-slate-800 mb-2">Send us a Message</h2>
                        <p className="text-slate-500 mb-8">We usually respond within 2 hours.</p>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Name */}
                                <div className="relative group">
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="peer w-full bg-slate-50 border-b-2 border-slate-200 focus:border-teal-500 outline-none py-3 px-2 transition-all placeholder-transparent"
                                        placeholder="Full Name"
                                        value={formState.name}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('name')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    <label className="absolute left-2 -top-3.5 text-xs text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal-600 pointer-events-none">
                                        Full Name
                                    </label>
                                    {focusedField === 'name' && <motion.div layoutId="underline" className="absolute bottom-0 left-0 h-[2px] w-full bg-teal-500" />}
                                </div>

                                {/* Email */}
                                <div className="relative group">
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="peer w-full bg-slate-50 border-b-2 border-slate-200 focus:border-teal-500 outline-none py-3 px-2 transition-all placeholder-transparent"
                                        placeholder="Email Address"
                                        value={formState.email}
                                        onChange={handleChange}
                                        onFocus={() => setFocusedField('email')}
                                        onBlur={() => setFocusedField(null)}
                                    />
                                    <label className="absolute left-2 -top-3.5 text-xs text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal-600 pointer-events-none">
                                        Email Address
                                    </label>
                                </div>
                            </div>

                            {/* Phone */}
                            <div className="relative group">
                                <input
                                    type="tel"
                                    name="phone"
                                    required
                                    className="peer w-full bg-slate-50 border-b-2 border-slate-200 focus:border-teal-500 outline-none py-3 px-2 transition-all placeholder-transparent"
                                    placeholder="Phone Number"
                                    value={formState.phone}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('phone')}
                                    onBlur={() => setFocusedField(null)}
                                />
                                <label className="absolute left-2 -top-3.5 text-xs text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal-600 pointer-events-none">
                                    Phone Number
                                </label>
                            </div>

                            {/* Department Select */}
                            <div className="relative group">
                                <select
                                    name="department"
                                    className="peer w-full bg-slate-50 border-b-2 border-slate-200 focus:border-teal-500 outline-none py-3 px-2 transition-all text-slate-700 h-12"
                                    value={formState.department}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('department')}
                                    onBlur={() => setFocusedField(null)}
                                >
                                    <option value="" disabled selected hidden></option>
                                    <option value="booking">Test Booking</option>
                                    <option value="collection">Home Collection</option>
                                    <option value="corporate">Corporate Inquiry</option>
                                    <option value="support">Customer Support</option>
                                </select>
                                <label className={`absolute left-2 transition-all pointer-events-none ${formState.department
                                        ? "-top-3.5 text-xs text-teal-600"
                                        : "top-3 text-base text-slate-400 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal-600"
                                    }`}>
                                    Select Department
                                </label>
                            </div>

                            {/* Message */}
                            <div className="relative group">
                                <textarea
                                    name="message"
                                    required
                                    rows="4"
                                    className="peer w-full bg-slate-50 border-b-2 border-slate-200 focus:border-teal-500 outline-none py-3 px-2 transition-all placeholder-transparent resize-none"
                                    placeholder="Your Message"
                                    value={formState.message}
                                    onChange={handleChange}
                                    onFocus={() => setFocusedField('message')}
                                    onBlur={() => setFocusedField(null)}
                                ></textarea>
                                <label className="absolute left-2 -top-3.5 text-xs text-teal-600 transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3 peer-focus:-top-3.5 peer-focus:text-xs peer-focus:text-teal-600 pointer-events-none">
                                    Your Message
                                </label>
                            </div>

                            {/* Submit Button */}
                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                disabled={isSubmitting}
                                className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-lg shadow-teal-500/30 flex items-center justify-center gap-2 transition-all ${isSuccess ? "bg-green-500" : "bg-gradient-to-r from-teal-500 to-blue-600 hover:shadow-teal-500/50"
                                    }`}
                            >
                                {isSubmitting ? (
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 1 }}
                                        className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                    />
                                ) : isSuccess ? (
                                    <>Sent Successfully <CheckCircle size={20} /></>
                                ) : (
                                    <>Send Secure Message <Send size={20} /></>
                                )}
                            </motion.button>
                        </form>
                    </div>

                    {/* Right: Info Panel */}
                    <div className="lg:col-span-5 bg-gradient-to-br from-slate-900 to-slate-800 p-8 md:p-12 text-white flex flex-col justify-between relative overflow-hidden">
                        {/* Decor */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl -mr-16 -mt-16"></div>

                        <div>
                            <h3 className="text-2xl font-bold mb-8">Contact Information</h3>

                            <div className="space-y-6">
                                {[
                                    { icon: MapPin, title: "Headquarters", content: "Ground Floor, No:38, Sumangali Sevashram Road, near City Pearl Super Market, Chola Nagar, Cholanayakanahalli, Hebbal, Bengaluru, Karnataka 560024", delay: 0.1 },
                                    { icon: Phone, title: "Emergency Support", content: "+91 81234 59263", delay: 0.2 },
                                    { icon: Mail, title: "General Inquiry", content: "[EMAIL_ADDRESS]", delay: 0.3 },
                                    { icon: Clock, title: "Working Hours", content: "Mon - Sat: 09:00 AM - 10:00 PM", delay: 0.4 },
                                ].map((item, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: 20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.2 + item.delay }}
                                        className="flex items-start gap-4 group p-4 rounded-xl hover:bg-white/5 transition-all cursor-default"
                                    >
                                        <div className="p-3 bg-white/10 rounded-lg group-hover:bg-teal-500/20 group-hover:text-teal-400 transition-colors">
                                            <item.icon size={24} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm text-slate-400 font-medium mb-1">{item.title}</h4>
                                            <p className="text-lg font-semibold">{item.content}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>

                        <div className="mt-12 p-6 bg-white/5 rounded-2xl border border-white/10 backdrop-blur-sm">
                            <h4 className="flex items-center gap-2 font-bold text-teal-400 mb-2">
                                <AlertCircle size={18} /> Note
                            </h4>
                            <p className="text-sm text-slate-300 leading-relaxed">
                                For urgent medical reports, please use our <span className="text-teal-400 underline cursor-pointer">Start Reporting</span> portal or reach out via WhatsApp for instant support.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. Map Section */}
            <section className="w-full h-[400px] bg-slate-100 relative grayscale hover:grayscale-0 transition-all duration-700">
   <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4118.625423745121!2d77.59385045912636!3d13.036324913658728!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae17007203752d%3A0xddf2692240187855!2sFUTURE%20LABS%20DIAGNOSTICS%20%26%20RESEARCH%20CENTRE!5e0!3m2!1sen!2sin!4v1768757129689!5m2!1sen!2sin"
            className="w-100 h-[400px] map-iframe"
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
                {/* Floating Location Card */}
                <div className="absolute bottom-6 left-6 md:bottom-10 md:left-10 bg-white p-6 rounded-xl shadow-2xl max-w-sm">
                    <h4 className="font-bold text-slate-800 flex items-center gap-2">
                        <MapPin size={18} className="text-teal-500" /> Future Lab Center
                    </h4>
                    <p className="text-sm text-slate-500 mt-2">
                        Visit our state-of-the-art facility for walk-in tests and consultations.
                    </p>
                   <a
  href="https://www.google.com/maps/dir/?api=1&destination=13.0363249,77.5938504"
  target="_blank"
  rel="noopener noreferrer"
  className="mt-4 inline-flex items-center text-xs font-bold text-teal-600 uppercase tracking-wider gap-1 hover:gap-2 transition-all group"
>
  Get Directions
  <ArrowRight
    size={14}
    className="transition-transform duration-300 group-hover:translate-x-1"
  />
</a>
                </div>
            </section>

            {/* 4. Sticky Floating Actions (Mobile/Desktop) */}
            <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-green-500 rounded-full text-white shadow-lg shadow-green-500/30 flex items-center justify-center hover:bg-green-600 transition-colors relative group"
                >
                    <MessageCircle size={28} />
                    <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Chat on WhatsApp
                    </span>
                    <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-blue-600 rounded-full text-white shadow-lg shadow-blue-600/30 flex items-center justify-center hover:bg-blue-700 transition-colors relative group"
                >
                    <Phone size={24} />
                    <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Call Now
                    </span>
                </motion.button>

                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-14 h-14 bg-teal-500 rounded-full text-white shadow-lg shadow-teal-500/30 flex items-center justify-center hover:bg-teal-600 transition-colors relative group"
                >
                    <Calendar size={24} />
                    <span className="absolute right-full mr-4 bg-slate-800 text-white text-xs py-1 px-3 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                        Book Test
                    </span>
                </motion.button>
            </div>

        </div>
    );
};

export default Contact;
