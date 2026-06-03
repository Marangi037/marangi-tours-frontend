import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const ImageOverrideContext = createContext();

const STORAGE_KEY = 'marangi_image_overrides';

const loadOverrides = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

export const ImageOverrideProvider = ({ children }) => {
  const [overrides, setOverrides] = useState(loadOverrides);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(overrides));
  }, [overrides]);

  const getImageUrl = useCallback((attractionId, defaultUrl) => {
    return overrides[attractionId] || defaultUrl;
  }, [overrides]);

  const setImageOverride = useCallback((attractionId, newUrl) => {
    setOverrides((prev) => ({ ...prev, [attractionId]: newUrl }));
  }, []);

  const clearOverride = useCallback((attractionId) => {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[attractionId];
      return next;
    });
  }, []);

  const clearAllOverrides = useCallback(() => {
    setOverrides({});
  }, []);

  return (
    <ImageOverrideContext.Provider value={{ overrides, getImageUrl, setImageOverride, clearOverride, clearAllOverrides }}>
      {children}
    </ImageOverrideContext.Provider>
  );
};

export const useImageOverrides = () => {
  const context = useContext(ImageOverrideContext);
  if (!context) {
    throw new Error('useImageOverrides must be used within ImageOverrideProvider');
  }
  return context;
};
