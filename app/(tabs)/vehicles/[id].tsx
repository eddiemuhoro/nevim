import Box from "@/components/reusable/Box";
import ThemedButton from "@/components/reusable/Buttons";
import Page from "@/components/reusable/Page";
import ThemedIcon from "@/components/reusable/ThemedIcon";
import ThemedText from "@/components/reusable/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { VehicleType } from "@/types/vehicle.types";
import {
  commaSeparatedNumber,
  generateRandomPastelColor,
} from "@/utils/ui.utils";
import { Stack, router, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Button,
  Image,
  Modal,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import moment from "moment";
import { vehicles } from "./index";
import VehicleLocation from "@/components/vehicle/PhoneLocator";

export default function VehicleDetails() {
  const router = useRouter();
  // const vehicle = JSON.parse(vehicleJson) as VehicleType;
  const { id, vehicle: vehicleJson } = useLocalSearchParams();
  const vehicle =
    typeof vehicleJson === "string" ? JSON.parse(vehicleJson) : null;

  console.log(vehicle);

  if (!vehicle) {
    return (
      <View>
        <Text>Vehicle not found</Text>
      </View>
    );
  }

  console.log(vehicle.vehicleRegNumber);

  const accentColor = generateRandomPastelColor();

  const insets = useSafeAreaInsets();

  const initialStartDate = moment().subtract(7, "days").toDate();
  const [startDate, setStartDate] = useState(initialStartDate);
  const [endDate, setEndDate] = useState(new Date());

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [dateToChange, setDateToChange] = useState("nkghgvjgj");

  const totalDistance = vehicle.dailyDistances
    .filter(({ date }: { date: string }) => {
      const momentDate = moment(date, "DD-MM-YYYY");
      const isSameOrAfterStart = momentDate.isSameOrAfter(
        moment(startDate),
        "day"
      );
      const isSameOrBeforeEnd = momentDate.isSameOrBefore(
        moment(endDate),
        "day"
      );
      const isWithinRange = momentDate.isBetween(
        moment(startDate),
        moment(endDate),
        "day",
        "[]"
      ); // '[]' includes start and end dates
      return isSameOrAfterStart && isSameOrBeforeEnd && isWithinRange;
    })
    .reduce((total: number, { distance }: { distance: string }) => {
      const parsedDistance = parseFloat(distance);
      return total + (isNaN(parsedDistance) ? 0 : parsedDistance);
    }, 0);

  const theme = useTheme();
  return (
    <>
      <Stack.Screen
        options={{
          header: () => (
            <Box
              block
              direction="row"
              px={20}
              justify="space-between"
              align="center"
              pt={insets.top + 10}
              gap={20}
            >
              <ThemedButton
                onPress={() => {
                  router.back();
                }}
                pa={9}
                type="secondary-outlined"
              >
                <ThemedIcon name={"chevron-left"} />
              </ThemedButton>

              <Box width={30}></Box>
            </Box>
          ),
        }}
      />
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
                      parseFloat(vehicle.dailyDistances[0]?.distance)
                    )
                  : 0}{" "}
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
                Distance Between Phone and Vehicle.
              </ThemedText>
              <ThemedText weight="bold">10 km</ThemedText>
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
                  Vehicle Location
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
              <MapView
                style={{ width: "100%", height: "100%", flex: 1 }}
                initialRegion={{
                  latitude: parseFloat(vehicle.coordinates.lat),
                  longitude: parseFloat(vehicle.coordinates.lng),
                  latitudeDelta: 0.22,
                  longitudeDelta: 0.21,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(vehicle.coordinates.lat),
                    longitude: parseFloat(vehicle.coordinates.lng),
                  }}
                  title={vehicle.vehicleRegNumber}
                />
              </MapView>
            </Box>
          </Box>
        </Box>
      </Page>
    </>
  );
}
