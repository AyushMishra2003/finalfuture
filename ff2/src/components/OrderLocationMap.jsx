import React from 'react';
import { MapPin, Navigation } from 'react-feather';

const OrderLocationMap = ({ order, adminLocation }) => {
    const { shippingAddress } = order;
    const location = shippingAddress?.location;

    if (!location || !location.latitude) {
        return (
            <div className="alert alert-warning">
                <MapPin size={16} className="me-2" />
                Location not available for this order
            </div>
        );
    }

    const googleMapsUrl = `https://www.google.com/maps?q=${location.latitude},${location.longitude}`;
    const directionsUrl = adminLocation
        ? `https://www.google.com/maps/dir/${adminLocation.lat},${adminLocation.lon}/${location.latitude},${location.longitude}`
        : googleMapsUrl;

    return (
        <div className="card">
            <div className="card-header bg-primary text-white">
                <MapPin size={18} className="me-2" />
                Order Location
            </div>
            <div className="card-body">
                <div className="mb-3">
                    <strong>Coordinates:</strong>
                    <p className="mb-1">
                        Latitude: {location.latitude.toFixed(6)}<br />
                        Longitude: {location.longitude.toFixed(6)}
                    </p>
                    {location.accuracy && (
                        <small className="text-muted">
                            Accuracy: ±{Math.round(location.accuracy)}m
                        </small>
                    )}
                </div>

                {order.distance && (
                    <div className="alert alert-info mb-3">
                        <Navigation size={16} className="me-2" />
                        <strong>Distance from you:</strong> {order.distance}
                    </div>
                )}

                <div className="d-grid gap-2">
                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn btn-outline-primary"
                    >
                        <MapPin size={16} className="me-2" />
                        View on Google Maps
                    </a>
                    {adminLocation && (
                        <a
                            href={directionsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-primary"
                        >
                            <Navigation size={16} className="me-2" />
                            Get Directions
                        </a>
                    )}
                </div>

                {/* Embedded Map */}
                <div className="mt-3">
                    <iframe
                        width="100%"
                        height="300"
                        frameBorder="0"
                        style={{ border: 0 }}
                        src={`https://www.google.com/maps/embed/v1/place?key=YOUR_GOOGLE_MAPS_API_KEY&q=${location.latitude},${location.longitude}&zoom=15`}
                        allowFullScreen
                        title="Order Location Map"
                    />
                </div>
            </div>
        </div>
    );
};

export default OrderLocationMap;
