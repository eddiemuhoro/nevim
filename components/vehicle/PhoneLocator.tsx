import React from "react";
import { Button, View, StyleSheet, Text } from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import { useLocationWithDistance } from "@/hooks/useLocationWithDistance";

export default function VehicleLocation({ vehicleCoordinates }) {
  const { phoneLocation, distance, showDistance, toggleShowDistance } =
    useLocationWithDistance(vehicleCoordinates);

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: parseFloat(vehicleCoordinates.lat),
          longitude: parseFloat(vehicleCoordinates.lng),
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Marker for Vehicle */}
        <Marker
          coordinate={{
            latitude: parseFloat(vehicleCoordinates.lat),
            longitude: parseFloat(vehicleCoordinates.lng),
          }}
          title="Vehicle"
        />

        {/* Marker for Phone (if location available) */}
        {phoneLocation && (
          <Marker
            coordinate={{
              latitude: phoneLocation.latitude,
              longitude: phoneLocation.longitude,
            }}
            title="Phone"
          />
        )}

        {/* Line between Phone and Vehicle */}
        {showDistance && phoneLocation && (
          <Polyline
            coordinates={[
              {
                latitude: phoneLocation.latitude,
                longitude: phoneLocation.longitude,
              },
              {
                latitude: parseFloat(vehicleCoordinates.lat),
                longitude: parseFloat(vehicleCoordinates.lng),
              },
            ]}
            strokeColor="blue"
            strokeWidth={2}
          />
        )}
      </MapView>

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
