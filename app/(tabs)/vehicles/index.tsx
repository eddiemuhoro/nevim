import { FlatList, RefreshControl } from "react-native";
import "react-native-get-random-values";
import Box from "@/components/reusable/Box";
import ThemedButton from "@/components/reusable/Buttons";
import Page from "@/components/reusable/Page";
import ThemedIcon from "@/components/reusable/ThemedIcon";
import ThemedText from "@/components/reusable/ThemedText";
import { VehicleType } from "@/types/vehicle.types";
import { generateRandomPastelColor } from "@/utils/ui.utils";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export const vehicles: VehicleType[] = [
  {
    deviceId: "DEV12345",
    vehicleRegNumber: "ABC123",
    totalDistanceCovered: "1500 km",
    coordinates: {
      lat: "0.506882",
      lng: "35.245660",
    },
    dailyDistances: [
      { distance: "50 km", date: "2024-12-01" },
      { distance: "60 km", date: "2024-12-02" },
    ],
  },
  {
    deviceId: "DEV67890",
    vehicleRegNumber: "XYZ456",
    totalDistanceCovered: "2000 km",

    coordinates: {
      lat: "0.515893",
      lng: "35.264436",
    },
    dailyDistances: [
      { distance: "80 km", date: "2024-12-01" },
      { distance: "70 km", date: "2024-12-02" },
    ],
  },
  {
    deviceId: "DEV54321",
    vehicleRegNumber: "LMN789",
    totalDistanceCovered: "1750 km",

    coordinates: {
      lat: "0.491429",
      lng: "35.287844",
    },
    dailyDistances: [
      { distance: "40 km", date: "2024-12-01" },
      { distance: "90 km", date: "2024-12-02" },
    ],
  },
  {
    deviceId: "DEV09876",
    vehicleRegNumber: "PQR321",
    totalDistanceCovered: "2200 km",

    coordinates: {
      lat: "0.477787",
      lng: "35.263581",
    },
    dailyDistances: [
      { distance: "30 km", date: "2024-12-01" },
      { distance: "100 km", date: "2024-12-02" },
    ],
  },
  {
    deviceId: "DEV11223",
    vehicleRegNumber: "UVW654",
    totalDistanceCovered: "1850 km",

    coordinates: {
      lat: "0.486496",
      lng: "35.245610",
    },
    dailyDistances: [
      { distance: "70 km", date: "2024-12-01" },
      { distance: "75 km", date: "2024-12-02" },
    ],
  },
];

export default function VehicleTab() {
  return (
    <Page
      header={{
        title: "Vehicles",
        disableBackButton: true,
      }}
      px={20}
    >
      <FlatList
        data={vehicles}
        renderItem={({ item }) => <VehicleCard vehicle={item} />}
        keyExtractor={(item) => item.deviceId.toString()}
        ItemSeparatorComponent={() => <Box height={15} />}
      />
    </Page>
  );
}

function VehicleCard({ vehicle }: { vehicle: VehicleType }) {
  return (
    <ThemedButton
      type="surface"
      radius={25}
      pa={15}
      onPress={() => {
        router.push({
          pathname: `/vehicles/[id]`,
          params: { id: vehicle.deviceId, vehicle: JSON.stringify(vehicle) },
        });
      }}
    >
      <Box direction="row" align="center" gap={15}>
        <Box width={50} height={50} align="center" justify="center" radius={20}>
          {/* <ThemedIcon name={"token"} size={"md"} source="MaterialIcons" /> */}
          <ThemedIcon
            name={"track-changes"}
            size={"md"}
            source="MaterialIcons"
          />
        </Box>
        <Box flex={1}>
          <ThemedText style={{ opacity: 0.5 }} size={"sm"} weight="bold">
            {vehicle.vehicleRegNumber}
          </ThemedText>
          <ThemedText weight="bold">
            {vehicle.totalDistanceCovered} km
          </ThemedText>
        </Box>
        {/* <ThemedIcon name={"chevron-right"} /> */}
      </Box>
    </ThemedButton>
  );
}
