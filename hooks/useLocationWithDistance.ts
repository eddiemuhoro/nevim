import { useState, useEffect } from "react";
import * as Location from "expo-location";

interface Coordinates {
  latitude: number;
  longitude: number;
}

interface VehicleCoordinates {
  lat: string;
  lng: string;
}

interface UseLocationWithDistanceReturn {
  phoneLocation: Coordinates | null;
  distance: string | null;
  showDistance: boolean;
  toggleShowDistance: () => void;
}

export function useLocationWithDistance(
  vehicleCoordinates: VehicleCoordinates
): UseLocationWithDistanceReturn {
  const [phoneLocation, setPhoneLocation] = useState<Coordinates | null>(null);
  const [distance, setDistance] = useState<string | null>(null);
  const [showDistance, setShowDistance] = useState(false);

  // Fetch phone's location
  useEffect(() => {
    const fetchPhoneLocation = async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.error("Permission denied for location access");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      setPhoneLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    };

    fetchPhoneLocation();
  }, []);

  // Calculate distance between phone and vehicle
  useEffect(() => {
    if (phoneLocation && vehicleCoordinates) {
      const calculateDistance = (
        lat1: number,
        lon1: number,
        lat2: number,
        lon2: number
      ): number => {
        const toRadians = (degrees: number): number =>
          degrees * (Math.PI / 180);
        const R = 6371; // Earth's radius in kilometers
        const dLat = toRadians(lat2 - lat1);
        const dLon = toRadians(lon2 - lon1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRadians(lat1)) *
            Math.cos(toRadians(lat2)) *
            Math.sin(dLon / 2) *
            Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const dist = calculateDistance(
        phoneLocation.latitude,
        phoneLocation.longitude,
        parseFloat(vehicleCoordinates.lat),
        parseFloat(vehicleCoordinates.lng)
      );
      setDistance(dist.toFixed(2));
    }
  }, [phoneLocation, vehicleCoordinates]);

  const toggleShowDistance = () => setShowDistance(!showDistance);

  return { phoneLocation, distance, showDistance, toggleShowDistance };
}
