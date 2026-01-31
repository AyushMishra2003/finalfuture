import React, { useEffect } from 'react';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import './PaymentSuccess.css';

const PaymentSuccess = ({ onComplete }) => {
    useEffect(() => {
        // Redirect after 3 seconds
        const timer = setTimeout(() => {
            onComplete();
        }, 3000);

        return () => clearTimeout(timer);
    }, [onComplete]);

    return (
        <div className="payment-success-overlay">
            <motion.div
                className="payment-success-modal"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
            >
                <motion.div
                    className="success-checkmark"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200,
                        damping: 10
                    }}
                >
                    <CheckCircle size={80} />
                </motion.div>

                <motion.h2
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                >
                    Payment Successful!
                </motion.h2>

                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                >
                    Your order has been confirmed
                </motion.p>

                <motion.div
                    className="success-loader"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8 }}
                >
                    <div className="loader-bar">
                        <motion.div
                            className="loader-progress"
                            initial={{ width: "0%" }}
                            animate={{ width: "100%" }}
                            transition={{ duration: 3, ease: "linear" }}
                        />
                    </div>
                    <p className="redirect-text">Redirecting to order summary...</p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default PaymentSuccess;
