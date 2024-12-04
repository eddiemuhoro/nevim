import Colors from "@/constants/color.constants";
import React from "react";
import {
	ActivityIndicator,
	ActivityIndicatorProps,
	useColorScheme,
} from "react-native";

export default function ThemedActivityIndicator(props: ActivityIndicatorProps) {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return <ActivityIndicator color={theme.text} {...props} />;
}
