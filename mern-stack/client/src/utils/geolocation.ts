import { useEffect, useState } from "react";

export const useGetGeoLocation = () => {
  const [geolocation, setGeolocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  const [error, setError] = useState(false);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (location) => {
          const { latitude, longitude } = location.coords;
          setGeolocation({ latitude, longitude });
        },
        () => {
          setError(true);
        }
      );
    }
  }, []);

  return { geolocation, error, setGeolocation };
};
