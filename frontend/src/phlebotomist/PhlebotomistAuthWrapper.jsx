import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PhlebotomistAuthWrapper = ({ children }) => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('collectorToken');
        
        if (!token) {
            navigate('/phlebotomist/login');
        }
    }, [navigate]);

    const token = localStorage.getItem('collectorToken');
    
    if (!token) {
        return null;
    }

    return <>{children}</>;
};

export default PhlebotomistAuthWrapper;
