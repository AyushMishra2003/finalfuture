import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { baseUrl } from "../utils/config";

// Fallback configuration in case baseUrl is not properly imported
const API_BASE_URL = baseUrl || "http://147.93.27.120:3000";

const SearchComponent = ({ isMobile = false }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const debounceRef = useRef(null);

  // Validate required dependencies
  if (!navigate || typeof navigate !== "function") {
    console.error("SearchComponent: useNavigate hook is not available");
    return <div>Navigation error - please refresh the page</div>;
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      // Clear any pending debounced search
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const handleSearch = async (query) => {
    // Enhanced input validation
    if (!query || typeof query !== "string" || query.trim().length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
      return;
    }

    // Prevent search if already loading
    if (isLoading) {
      return;
    }

    setIsLoading(true);

    try {
      // Validate baseUrl exists
      if (!API_BASE_URL) {
        throw new Error("Base URL is not configured");
      }

      // Add timeout to prevent hanging requests
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 5000);

      const searchUrl = `${API_BASE_URL}/api/v1/tests/search?q=${encodeURIComponent(
        query.trim()
      )}`;

      const response = await fetch(searchUrl, {
        method: "GET",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });

      // Clear timeout if request completes
      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(
          `HTTP error! status: ${response.status} - ${response.statusText}`
        );
      }

      const data = await response.json();

      // Enhanced data validation
      if (data && typeof data === "object") {
        if (data.success === true && Array.isArray(data.data)) {
          const validSuggestions = data.data
            .filter(
              (item) =>
                item && typeof item === "object" && item.name && item._id
            )
            .slice(0, 8); // Limit to 8 suggestions

          setSuggestions(validSuggestions);
          setShowSuggestions(validSuggestions.length > 0);
        } else if (Array.isArray(data)) {
          // Handle direct array response
          const validSuggestions = data
            .filter(
              (item) =>
                item && typeof item === "object" && item.name && item._id
            )
            .slice(0, 8);

          setSuggestions(validSuggestions);
          setShowSuggestions(validSuggestions.length > 0);
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    } catch (error) {
      console.warn("Search API error:", error?.message || "Unknown error");

      // Gracefully handle errors without breaking the UI
      setSuggestions([]);
      setShowSuggestions(false);

      // Log specific error types for debugging
      if (error?.name === "AbortError") {
        console.log("Search request timed out after 5 seconds");
      } else if (
        error?.message?.includes("Failed to fetch") ||
        error?.message?.includes("NetworkError")
      ) {
        console.log(
          "Network error - backend may not be available at:",
          API_BASE_URL
        );
      } else if (error?.message?.includes("Base URL is not configured")) {
        console.error("Configuration error: Base URL is missing");
      } else {
        console.log("Unexpected error during search:", error);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    // Enhanced input validation
    if (!e || !e.target) {
      console.warn("Invalid input event received");
      return;
    }

    const value = e.target.value || "";
    setSearchTerm(value);

    // Clear existing debounce timer
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    // Only search if value has content
    if (value.trim().length >= 2) {
      // Set new debounce timer
      debounceRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300); // 300ms delay
    } else {
      // Clear suggestions immediately for short queries
      setSuggestions([]);
      setShowSuggestions(false);
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    // Validate suggestion object
    if (!suggestion || typeof suggestion !== "object" || !suggestion._id) {
      console.warn("Invalid suggestion clicked:", suggestion);
      return;
    }

    try {
      setSearchTerm("");
      setSuggestions([]);
      setShowSuggestions(false);

      const category = suggestion.category || "general";
      navigate(
        `/product?id=${encodeURIComponent(
          suggestion._id
        )}&category=${encodeURIComponent(category)}`
      );
    } catch (error) {
      console.error("Error navigating to product:", error);
    }
  };

  const handleSubmit = (e) => {
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    const trimmedSearchTerm = searchTerm?.trim() || "";

    if (trimmedSearchTerm.length >= 2) {
      try {
        navigate(`/search?q=${encodeURIComponent(trimmedSearchTerm)}`);
        setSearchTerm("");
        setSuggestions([]);
        setShowSuggestions(false);

        // Clear any pending debounced search
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
          debounceRef.current = null;
        }
      } catch (error) {
        console.error("Error during search navigation:", error);
      }
    }
  };

  const inputId = isMobile
    ? "unique-search-input-mobile"
    : "unique-search-input";
  const suggestionsId = isMobile ? "suggestions-mobile" : "suggestions";

  return (
    <div className="unique-search" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <input
          id={inputId}
          className="search-input"
          placeholder="Search..."
          type="text"
          value={searchTerm}
          onChange={handleInputChange}
          autoComplete="off"
        />
        <button type="submit">Search</button>
      </form>

      {(showSuggestions && suggestions.length > 0) || isLoading ? (
        <div id={suggestionsId} className="suggestions-container">
          {isLoading ? (
            <div className="suggestion-item suggestion-loading">
              <div className="suggestion-content">
                <span>Searching...</span>
                <div
                  className="spinner-border spinner-border-sm ms-2"
                  role="status"
                >
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            </div>
          ) : (
            suggestions
              .map((suggestion, index) => {
                // Validate each suggestion
                if (
                  !suggestion ||
                  typeof suggestion !== "object" ||
                  !suggestion._id
                ) {
                  return null;
                }

                return (
                  <div
                    key={suggestion._id || `suggestion-${index}`}
                    className="suggestion-item"
                    onClick={() => handleSuggestionClick(suggestion)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        handleSuggestionClick(suggestion);
                      }
                    }}
                  >
                    <div className="suggestion-content">
                      <h6 className="suggestion-title">
                        {suggestion.name || "Unnamed Test"}
                      </h6>
                      <p className="suggestion-category">
                        {suggestion.category || "General"}
                      </p>
                      <span className="suggestion-price">
                        ₹{suggestion.price || "0"}
                      </span>
                    </div>
                  </div>
                );
              })
              .filter(Boolean) // Remove any null entries
          )}
        </div>
      ) : null}
    </div>
  );
};

export default SearchComponent;
