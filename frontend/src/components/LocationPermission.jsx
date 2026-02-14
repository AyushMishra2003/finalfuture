import React, { useState } from 'react';
import { MapPin, AlertCircle } from 'react-feather';
import useGeolocation from '../hooks/useGeolocation';

const LocationPermission = ({ onLocationCaptured, required = false }) => {
    const { location, error, loading, getLocation } = useGeolocation();
    const [permissionGranted, setPermissionGranted] = useState(false);

    const handleRequestLocation = () => {
        getLocation();
    };

    React.useEffect(() => {
        if (location) {
            setPermissionGranted(true);
            onLocationCaptured(location);
        }
    }, [location, onLocationCaptured]);

    if (permissionGranted && location) {
        return (
            <div className="alert alert-success d-flex align-items-center">
                <MapPin size={20} className="me-2" />
                <div>
                    <strong>Location Captured</strong>
                    <p className="mb-0 small">
                        Lat: {location.latitude.toFixed(6)}, Lon: {location.longitude.toFixed(6)}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="card border-primary mb-3">
            <div className="card-body">
                <div className="d-flex align-items-start">
                    <MapPin size={24} className="text-primary me-3 mt-1" />
                    <div className="flex-grow-1">
                        <h6 className="card-title">
                            Share Your Location {required && <span className="text-danger">*</span>}
                        </h6>
                        <p className="card-text small text-muted">
                            We need your location to provide accurate service and help our team reach you efficiently.
                        </p>
                        
                        {error && (
                            <div className="alert alert-danger alert-sm d-flex align-items-center mb-2">
                                <AlertCircle size={16} className="me-2" />
                                <small>{error}</small>
                            </div>
                        )}

                        <button
                            className="btn btn-primary btn-sm"
                            onClick={handleRequestLocation}
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm me-2" />
                                    Getting Location...
                                </>
                            ) : (
                                <>
                                    <MapPin size={16} className="me-2" />
                                    Allow Location Access
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LocationPermission;
