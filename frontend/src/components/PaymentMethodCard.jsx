import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const PaymentMethodCard = ({
    id,
    icon: Icon,
    title,
    subtitle,
    children,
    disabled,
    disabledText,
    activeMethod,
    onSelect
}) => {
    return (
        <div
            className={`payment-method-card ${activeMethod === id ? 'selected' : ''} ${disabled ? 'disabled' : ''}`}
            onClick={() => !disabled && onSelect(id)}
        >
            <div className="card-header-row">
                <div className="method-icon">
                    <Icon size={24} />
                </div>
                <div className="method-info">
                    <h3 className="method-title">{title}</h3>
                    <p className="method-subtitle">{disabled ? disabledText : subtitle}</p>
                </div>
                <div className="selection-indicator">
                    <div className={`radio-circle ${activeMethod === id ? 'checked' : ''}`} />
                </div>
            </div>

            <AnimatePresence>
                {activeMethod === id && !disabled && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="method-content-wrapper"
                    >
                        <div className="method-content">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default PaymentMethodCard;
