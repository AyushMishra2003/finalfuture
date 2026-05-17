import React, { useState, useEffect } from 'react';

const LocationDropdown = () => {
  const [selectedAddress, setSelectedAddress] = useState('Select Address');
  const [showModal, setShowModal] = useState(false);
  const [pincode, setPincode] = useState('');

  const handleCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Here you would typically reverse geocode to get address
          setSelectedAddress('Current Location');
          console.log('Location:', latitude, longitude);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get current location. Please enter pincode manually.');
        }
      );
    } else {
      alert('Geolocation is not supported by this browser.');
    }
  };

  const handlePincodeSubmit = (e) => {
    e.preventDefault();
    if (pincode.length === 6) {
      // Here you would typically validate and get address from pincode
      setSelectedAddress(`Pincode: ${pincode}`);
      setShowModal(false);
      setPincode('');
    } else {
      alert('Please enter a valid 6-digit pincode');
    }
  };

  return (
    <>
      {/* Dropdown */}
      <div className="dropdown">
        <button 
          className="dropdown-toggle location-btn" 
          id="dropdownMenuButton" 
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <i className="fa-solid fa-location-dot" style={{fontSize: 'clamp(16px, 1.7vw, 30px)', color: '#007c6f'}}></i>
          <span className="text-start">
            <h6 className="m-0 dlv-addrss">Delivery Address</h6>
            <p className="m-0 slc-addrss">{selectedAddress}</p>
          </span>
          <i className="fa-solid fa-caret-down toggle-icon"></i>
        </button>

        <ul className="dropdown-menu drp-location p-2 text-center" aria-labelledby="dropdownMenuButton">
          <li>
            <button className="current-l" onClick={handleCurrentLocation}>
              <i className="fa-solid fa-location-crosshairs"></i> Use Current Location
            </button>
          </li>
          <li>
            <span className="d-flex align-items-center">
              <hr className="flex-grow-1" />
              <span className="mx-2">or</span>
              <hr className="flex-grow-1" />
            </span>
          </li>
          <li>
            <span 
              className="d-flex gap-2" 
              style={{cursor: 'pointer'}}
              onClick={() => setShowModal(true)}
            >
              <i className="fa-solid fa-location-dot" style={{fontSize: '21px'}}></i>
              <p className="m-0">Enter Delivery Pincode</p>
            </span>
          </li>
        </ul>
      </div>

      {/* Pincode Modal */}
      {showModal && (
        <div className="modal fade show" style={{display: 'block'}} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Enter Delivery Pincode</h5>
                <button 
                  type="button" 
                  className="btn-close" 
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handlePincodeSubmit}>
                  <div className="mb-3">
                    <label htmlFor="pincode" className="form-label">Pincode</label>
                    <input
                      type="text"
                      className="form-control"
                      id="pincode"
                      value={pincode}
                      onChange={(e) => setPincode(e.target.value)}
                      placeholder="Enter 6-digit pincode"
                      maxLength="6"
                      pattern="[0-9]{6}"
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">Set Location</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
      {showModal && <div className="modal-backdrop fade show"></div>}
    </>
  );
};

export default LocationDropdown;
