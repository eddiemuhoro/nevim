import Box from "@/components/reusable/Box";
import ThemedButton from "@/components/reusable/Buttons";
import Page from "@/components/reusable/Page";
import ThemedTextInput, {
  ThemedPasswordInput,
} from "@/components/reusable/TextInputs";
import ThemedCard from "@/components/reusable/ThemedCard";
import ThemedText from "@/components/reusable/ThemedText";
import { useTheme } from "@/hooks/useTheme.hook";
import { router } from "expo-router";
import React from "react";
import { Image } from "react-native";

const LOGO_SIZE = 110;

export default function LoginScreen() {
  const theme = useTheme();
  return (
    <Page align="center" justify="center" px={20}>
      <ThemedCard
        block
        align="center"
        pt={LOGO_SIZE / 2 + 10}
        gap={20}
        radius={40}
      >
        <Box
          borderColor={theme.background}
          borderWidth={9}
          radius={LOGO_SIZE / 2}
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          align="center"
          justify="center"
          position="absolute"
          style={{
            top: -LOGO_SIZE / 2,
            backgroundColor: theme.surface,
          }}
        >
          <Image
            source={require("@/assets/images/key.png")}
            style={{ width: "50%", height: "50%", alignSelf: "center" }}
            resizeMode="contain"
          />
        </Box>
        <ThemedText weight="bold" size={"xxl"}>
          Login
        </ThemedText>
        <Box block gap={10}>
          <ThemedTextInput label="Username" placeholder="Enter your username" />
          <ThemedPasswordInput
            label="Password"
            placeholder="Enter your password"
          />
        </Box>
        <ThemedButton
          label={"Login"}
          type="primary"
          block
          labelProps={{
            color: theme.surface,
            weight: "bold",
          }}
          onPress={() => {
            // have the function or logic to verify before router.replace is called
            router.replace("/(tabs)/vehicles");
          }}
        />
      </ThemedCard>
    </Page>
  );
}
