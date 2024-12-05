import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tabs } from "expo-router";
import React from "react";

import ImageIcon from "@/components/reusable/ImageIcon";
import { useColorScheme } from "@/components/useColorScheme";

// You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>["name"];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

const INDICATOR_SIZE = {
  width: 80,
  height: "70%",
} as const;

export default function TabLayout() {
  const theme = useColorScheme();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarActiveTintColor: "blue", // color for active tab
        tabBarInactiveTintColor: "gray", // color for inactive tabs
      }}
    >
      {/* <Tabs.Screen
        name="vehicles"
        options={{
          title: "Vehicles",
          tabBarIcon: ({ size }) => (
            <ImageIcon
              source={require("@/assets/images/home.png")}
              size={"50%"}
              resizeMode="contain"
            />
          ),
        }}
      /> */}
      <Tabs.Screen
        name="bodas"
        options={{
          title: "Boda",
          tabBarIcon: ({ size }) => (
            <ImageIcon
              source={require("@/assets/images/home.png")}
              size={"50%"}
              resizeMode="contain"
            />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Settings",
          tabBarIcon: ({ size }) => (
            <ImageIcon
              source={require("@/assets/images/manage-icon.png")}
              size={"50%"}
              resizeMode="contain"
            />
          ),
        }}
      />
    </Tabs>
  );
}
