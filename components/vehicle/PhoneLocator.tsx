import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import { useLocationWithDistance } from "@/hooks/useLocationWithDistance";

interface VehicleLocationProps {
  vehicleCoordinates: { lat: string; lng: string };
}

export default function VehicleLocation({
  vehicleCoordinates,
}: VehicleLocationProps) {
  const { phoneLocation, distance, showDistance, toggleShowDistance } =
    useLocationWithDistance({
      lat: vehicleCoordinates.lat,
      lng: vehicleCoordinates.lng,
    });

  return (
    <View style={styles.container}>
      {/* Button to Show Distance */}
      <View style={styles.infoContainer}>
        <Button
          title={
            showDistance ? "Hide Distance" : "Show Distance - Phone to Vehicle"
          }
          onPress={toggleShowDistance}
        />
        {showDistance && distance && (
          <Text style={styles.distanceText}>Distance: {distance} km</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  infoContainer: {
    padding: 10,
    backgroundColor: "white",
    alignItems: "center",
  },
  distanceText: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: "bold",
  },
});
