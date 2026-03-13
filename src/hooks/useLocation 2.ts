'use client';

import { useState, useCallback } from 'react';

interface LocationState {
  lat: number | null;
  lng: number | null;
  accuracy: number | null;
  error: string | null;
  loading: boolean;
  method: 'gps' | 'manual' | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    lat: null, lng: null, accuracy: null, error: null, loading: false, method: null,
  });

  const getLocation = useCallback(() => {
    // Check if we're on HTTP (not HTTPS) — GPS won't work
    if (typeof window !== 'undefined' && window.location.protocol === 'http:' &&
        !window.location.hostname.includes('localhost')) {
      setState(p => ({ ...p, error: 'NEEDS_HTTPS' }));
      return;
    }

    if (!navigator.geolocation) {
      setState(p => ({ ...p, error: 'GPS_NOT_SUPPORTED' }));
      return;
    }

    setState(p => ({ ...p, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setState({
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
          accuracy: pos.coords.accuracy,
          error: null,
          loading: false,
          method: 'gps',
        });
      },
      (err) => {
        const code = err.code === 1 ? 'GPS_DENIED'
                   : err.code === 2 ? 'GPS_UNAVAILABLE'
                   : 'GPS_TIMEOUT';
        setState(p => ({ ...p, error: code, loading: false }));
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const setManualLocation = useCallback((lat: number, lng: number) => {
    setState({ lat, lng, accuracy: null, error: null, loading: false, method: 'manual' });
  }, []);

  const reset = useCallback(() => {
    setState({ lat: null, lng: null, accuracy: null, error: null, loading: false, method: null });
  }, []);

  return { ...state, getLocation, setManualLocation, reset };
}
