import React, { useRef, useState } from "react";
import {
  Text,
  View,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import moment from "moment";
import { WebView } from "react-native-webview";
import Box from "@/components/reusable/Box";
import ThemedButton from "@/components/reusable/Buttons";
import Page from "@/components/reusable/Page";
import ThemedIcon from "@/components/reusable/ThemedIcon";
import ThemedText from "@/components/reusable/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { useLocalSearchParams } from "expo-router";
import {
  commaSeparatedNumber,
  generateRandomPastelColor,
} from "@/utils/ui.utils";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import VehicleLocation from "@/components/vehicle/PhoneLocator";

export default function VehicleDetails() {
  const webViewRef = useRef<WebView>(null);

  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const { id, vehicle: vehicleJson } = useLocalSearchParams();
  const vehicle =
    typeof vehicleJson === "string" ? JSON.parse(vehicleJson) : null;

  const initialStartDate = moment().subtract(7, "days").toDate();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateToChange, setDateToChange] = useState("");

  if (!vehicle) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Vehicle not found</Text>
      </View>
    );
  }

  const accentColor = generateRandomPastelColor();

  const totalDistance = vehicle.dailyDistances
    .filter(({ date }: { date: string }) => {
      const momentDate = moment(date, "DD-MM-YYYY");
      return (
        momentDate.isSameOrAfter(moment(startDate), "day") &&
        momentDate.isSameOrBefore(moment(endDate), "day")
      );
    })
    .reduce((total: number, { distance }: { distance: string }) => {
      const parsedDistance = parseFloat(distance);
      return total + (isNaN(parsedDistance) ? 0 : parsedDistance);
    }, 0);

  // Parse vehicle coordinates
  const lat = parseFloat(vehicle.coordinates.lat);
  const lng = parseFloat(vehicle.coordinates.lng);

  console.log(vehicle.coordinates);

  const leafletHTML = `
  <!DOCTYPE html>
  <html>
  <head>
    <link
      rel="stylesheet"
      href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
    />
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"></script>
    <style>
      #map {
        height: 100vh;
        width: 100%;
      }
      body, html {
        margin: 0;
        padding: 0;
        height: 100%;
      }
    </style>
  </head>
  <body>
    <div id="map"></div>
    <script>
      document.addEventListener("DOMContentLoaded", function() {
        // Initialize the map
        var map = L.map('map').setView([${lat}, ${lng}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors'
        }).addTo(map);
  
        // Add marker for vehicle location
        var vehicleMarker = L.marker([${lat}, ${lng}]).addTo(map).bindPopup("Vehicle Location").openPopup();
  
        // Placeholder for phone location
        var phoneMarker;
        var polyline;
  
        // Function to update phone location and draw line
        function updatePhoneLocation(lat, lng) {
          if (!phoneMarker) {
            phoneMarker = L.marker([lat, lng], { color: "blue" }).addTo(map).bindPopup("Phone Location");
          } else {
            phoneMarker.setLatLng([lat, lng]).openPopup();
          }
  
          // Draw a line between phone and vehicle
          if (polyline) {
            map.removeLayer(polyline);
          }
          polyline = L.polyline([[${lat}, ${lng}], [lat, lng]], { color: "red" }).addTo(map);
        }
  
        // Listen for messages from React Native
        window.addEventListener("message", function(event) {
          try {
            var data = JSON.parse(event.data);
            if (data.type === "updatePhoneLocation") {
              updatePhoneLocation(data.lat, data.lng);
            }
          } catch (e) {
            console.error("Error parsing message data:", e);
          }
        });
      });
    </script>
  </body>
  </html>
  `;

  return (
    <>
      <Page px={20} gap={15} scrollable>
        <Box
          gap={5}
          align="center"
          justify="center"
          flex={1}
          color={theme.surface}
          radius={40}
          py={20}
        >
          <Box
            width={60}
            height={60}
            align="center"
            justify="center"
            radius={40}
            color={accentColor}
            style={{
              alignSelf: "center",
            }}
          >
            <Image
              source={require("@/assets/images/bus-icon.png")}
              style={{ width: "40%", height: "40%" }}
            />
          </Box>
          <ThemedText size={"lg"} weight="800" align="center">
            {vehicle.vehicleRegNumber}
          </ThemedText>
        </Box>

        <Box color={theme.surface} radius={25} pa={15}>
          <Box direction="row" align="center" gap={10}>
            <Box
              width={40}
              height={40}
              align="center"
              justify="center"
              radius={20}
              color={generateRandomPastelColor()}
            >
              <Image
                source={require("@/assets/images/road-icon.png")}
                style={{ width: "40%", height: "40%" }}
              />
            </Box>
            <Box flex={1}>
              <ThemedText style={{ opacity: 0.5 }} size={"sm"} weight="bold">
                Total Distance Covered.
              </ThemedText>
              <ThemedText weight="bold">
                {commaSeparatedNumber(parseFloat(vehicle.totalDistanceCovered))}{" "}
                km
              </ThemedText>
            </Box>
          </Box>
        </Box>

        <Box color={theme.surface} radius={25} pa={15}>
          <Box direction="row" align="center" gap={10}>
            <Box
              width={40}
              height={40}
              align="center"
              justify="center"
              radius={20}
              color={generateRandomPastelColor()}
            >
              <Image
                source={require("@/assets/images/calendar-icon.png")}
                style={{ width: "40%", height: "40%" }}
              />
            </Box>
            <Box flex={1}>
              <ThemedText style={{ opacity: 0.5 }} size={"sm"} weight="bold">
                Distance Covered Today.
              </ThemedText>
              <ThemedText weight="bold">
                {vehicle.dailyDistances[0]
                  ? commaSeparatedNumber(
                      parseFloat(vehicle.dailyDistances[0]?.distance ?? 0)
                    )
                  : 0}{" "}
                km
              </ThemedText>
            </Box>
          </Box>
        </Box>

        <Box color={theme.surface} radius={25} pa={15}>
          <TouchableOpacity onPress={() => setShowDatePicker(!showDatePicker)}>
            <Box direction="row" align="center" gap={10}>
              <Box
                width={40}
                height={40}
                align="center"
                justify="center"
                radius={20}
                color={generateRandomPastelColor()}
              >
                <Image
                  source={require("@/assets/images/timeline-icon.png")}
                  style={{ width: "40%", height: "40%" }}
                />
              </Box>
              <Box flex={1} gap={5}>
                <Box gap={2}>
                  <ThemedText
                    style={{ opacity: 0.5 }}
                    size={"sm"}
                    weight="bold"
                  >
                    Distance Traveled Between.
                  </ThemedText>
                  <Box
                    direction="row"
                    align="center"
                    justify="space-between"
                    pr={10}
                    gap={10}
                  >
                    <ThemedText size={"xs"} weight="bold">
                      {startDate.toDateString()}
                    </ThemedText>
                    <Box height={1} flex={1} color={theme.text} />
                    <ThemedText size={"xs"} weight="bold">
                      {endDate.toDateString()}
                    </ThemedText>
                  </Box>
                </Box>
                <ThemedText weight="bold">
                  {commaSeparatedNumber(totalDistance)} km
                </ThemedText>
              </Box>
              <ThemedButton pa={10} type="surface" color={theme.surface}>
                <TouchableOpacity
                  onPress={() => setShowDatePicker(!showDatePicker)}
                >
                  <ThemedIcon
                    name="unfold-more"
                    size={"md"}
                    source="MaterialIcons"
                  />
                </TouchableOpacity>
              </ThemedButton>
            </Box>
          </TouchableOpacity>
          {showDatePicker && (
            // <Modal transparent={true}>
            <TouchableWithoutFeedback onPress={() => setShowDatePicker(false)}>
              <Box flex={1} justify="center" align="center">
                <TouchableWithoutFeedback>
                  <Box color={theme.surface} pa={20} radius={18}>
                    <Box direction="row" align="center" gap={100}>
                      <ThemedButton
                        onPress={() => setDateToChange("start")}
                        type="secondary-outlined"
                        label={"Start Date"}
                        size="sm"
                        radius={11}
                      />

                      <ThemedButton
                        onPress={() => setDateToChange("end")}
                        type="secondary-outlined"
                        label={"End Date"}
                        size="sm"
                        radius={11}
                      />
                    </Box>
                    {dateToChange === "start" ? (
                      <DateTimePicker
                        value={startDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setDateToChange("close");
                          if (selectedDate) {
                            setStartDate(selectedDate);
                          }
                        }}
                      />
                    ) : dateToChange === "end" ? (
                      <DateTimePicker
                        value={endDate}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                          setDateToChange("close");
                          setShowDatePicker(false);
                          if (selectedDate) {
                            setEndDate(selectedDate);
                          }
                        }}
                      />
                    ) : (
                      ""
                    )}
                  </Box>
                </TouchableWithoutFeedback>
              </Box>
            </TouchableWithoutFeedback>
            // </Modal>
          )}
        </Box>

        <VehicleLocation vehicleCoordinates={vehicle.coordinates} />

        <Box color={theme.surface} radius={25} pa={15}>
          <Box align="center" gap={15}>
            <Box block justify="space-between" gap={10} direction="row">
              <Box
                width={40}
                height={40}
                align="center"
                justify="center"
                radius={20}
                color={generateRandomPastelColor()}
              >
                <Image
                  source={require("@/assets/images/map-icon.png")}
                  style={{ width: "40%", height: "40%" }}
                />
              </Box>
              <Box gap={2} flex={1}>
                <ThemedText style={{ opacity: 0.5 }} size={"sm"} weight="bold">
                  Start Engine : {"09:30am"} - {"10:30am"}
                </ThemedText>
                <Box
                  direction="row"
                  align="center"
                  justify="space-between"
                  pr={10}
                  gap={10}
                >
                  <ThemedText size={"xs"} weight="bold">
                    Today
                  </ThemedText>
                </Box>
              </Box>
              <ThemedButton pa={10} type="surface" color={theme.surface}>
                <ThemedIcon name="pinch" size={"md"} source="MaterialIcons" />
              </ThemedButton>
            </Box>
            <Box height={280} block radius={20} overflow="hidden">
              <WebView
                ref={webViewRef}
                originWhitelist={["*"]}
                source={{ html: leafletHTML }}
                javaScriptEnabled
                domStorageEnabled
              />
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  );
}
