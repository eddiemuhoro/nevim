import Colors from "@/constants/color.constants";
import { useThemeColor } from "@/hooks/useTheme.hook";
import React, { ReactNode } from "react";
import {
	ActivityIndicator,
	Pressable,
	ViewStyle,
	useColorScheme,
} from "react-native";
import {
	useAnimatedStyle,
	useSharedValue,
	withSpring,
} from "react-native-reanimated";
import Box, { AnimatedBox, BoxProps } from "./Box";
import Icon, { IconProps } from "./ThemedIcon";
import ThemedText, { ThemedTextProps } from "./ThemedText";

const ThemedButton = (props: ThemedButtonProps) => {
	const {
		color,
		icon,
		labelProps,
		label,
		loading = false,
		onPress,
		type = "text",
		disabled = false,
		wrapperProps,
		radius = 40,
		size = "md",
		children,
		...outerWrapperProps
	} = props;

	const sizeStyles = getButtonStyles(size);

	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	const scaleValue = useSharedValue(1);

	const animatedButtonStyle = useAnimatedStyle(
		() =>
			({
				transform: [{ scale: scaleValue.value }],
			} as any)
	);

	const handlePressIn = () => {
		if (!disabled && !loading) scaleValue.value = withSpring(0.9);
	};

	const handlePressOut = () => {
		if (!disabled && !loading) scaleValue.value = withSpring(1);
	};

	const iconColor = () => {
		if (icon?.color) return icon.color;
		if (type === "primary") {
			return theme.primary;
		}
		if (type === "primary-outlined") {
			return theme.primary;
		}
		if (type === "secondary-outlined") {
			return theme.text;
		}
		if (type === "secondary") {
			return theme.background;
		}
	};

	const textColor = useThemeColor("text");
	const backgroundColor = useThemeColor("background");

	const labelColor = () => {
		if (labelProps?.color) return labelProps.color;

		if (type === "text") {
			return textColor;
		}
		if (type === "primary") {
			return textColor;
		}
		if (type === "primary-outlined") {
			return theme.primary;
		}
		if (type === "secondary-outlined") {
			return theme.text;
		}
		if (type === "secondary") {
			return theme.background;
		}
	};

	const buttonColors = () => {
		if (color) {
			return { background: color, border: "transparent" };
		}
		if (type === "primary") {
			return { background: theme.primary, border: "transparent" };
		}
		if (type === "primary-outlined") {
			return { background: "transparent", border: theme.primary };
		}
		if (type === "surface") {
			return { background: theme.surface, border: "transparent" };
		}
		if (type === "secondary-outlined") {
			return { background: "transparent", border: theme.text };
		}
		if (type === "secondary") {
			return { background: theme.text, border: "transparent" };
		}
		return { background: "transparent", border: "transparent" };
	};

	function iconGapBasedOnSize() {
		if (size === "xxxs") return 2;
		if (size === "xxs") return 4;
		if (size === "xs") return 6;
		if (size === "sm") return 8;
		if (size === "md") return 10;
		if (size === "lg") return 12;
		if (size === "xl") return 14;
		if (size === "xxl") return 16;
		if (size === "xxxl") return 18;
	}

	const ButtonIcon = ({ icon }: { icon: IconProps }) => (
		<Icon size={icon.size ? icon.size : size} color={iconColor()} {...icon} />
	);

	return (
		<AnimatedBox
			style={animatedButtonStyle}
			radius={radius}
			color={buttonColors()?.background}
			borderColor={buttonColors()?.border}
			borderWidth={type.includes("outlined") ? 1 : 0}
			align="center"
			justify="center"
			{...outerWrapperProps}
			opacity={disabled ? 0.7 : 1}
		>
			<Pressable
				style={{
					width: "100%",
					alignItems: outerWrapperProps.align || "center",
					justifyContent: outerWrapperProps.justify || "center",
					paddingVertical: children ? 0 : sizeStyles.paddingVertical,
					paddingHorizontal: children ? 0 : sizeStyles.paddingHorizontal,
					borderRadius: radius,
				}}
				onPressIn={handlePressIn}
				onPressOut={handlePressOut}
				onPress={() => {
					if (onPress) onPress();
				}}
				disabled={disabled || loading}
			>
				{children ? (
					<>
						{loading && (
							<ActivityIndicator size={"small"} color={labelColor()} />
						)}
						{children}
					</>
				) : (
					<Box
						gap={icon ? (icon.gap ? icon.gap : iconGapBasedOnSize()) : 0}
						radius={40}
						direction={outerWrapperProps.direction || "row"}
						align="center"
						justify="center"
						width={"100%"}
						{...wrapperProps}
					>
						{loading && (
							<ActivityIndicator size={"small"} color={labelColor()} />
						)}
						{loading === false && (
							<>
								{icon && icon.position !== "append" && (
									<ButtonIcon icon={icon} />
								)}
								<ThemedText
									color={labelColor()}
									size={size}
									fontWeight="semibold"
									{...labelProps}
								>
									{label}
								</ThemedText>
								{icon && icon.position === "append" && (
									<ButtonIcon icon={icon} />
								)}
							</>
						)}
					</Box>
				)}
			</Pressable>
		</AnimatedBox>
	);
};

export default ThemedButton;

export function ThemedToggleButton(props: ToggleButtonProps) {
	return (
		<ThemedButton
			type={props.active ? "primary-outlined" : "text"}
			borderWidth={2}
			{...props}
		/>
	);
}

export function ThemedIconButton(props: ThemedButtonProps) {
	return (
		<ThemedButton
			type="text"
			borderWidth={0}
			radius={20}
			size="sm"
			{...props}
		/>
	);
}

type BoxWrapper = Omit<BoxProps, "children">;
export interface ThemedButtonProps extends BoxWrapper {
	color?: string;
	label?: string | number;
	labelProps?: Omit<ThemedTextProps, "children">;
	loading?: boolean;
	onPress?: () => void;
	icon?: ButtonIconProps;
	type?:
		| "text"
		| "secondary"
		| "surface"
		| "primary"
		| "primary-outlined"
		| "secondary-outlined";
	disabled?: boolean;
	wrapperProps?: BoxWrapper;
	size?: ButtonSize;
	radius?: ViewStyle["borderRadius"];
	children?: ReactNode;
}

interface ButtonIconProps extends IconProps {
	position?: "append" | "prepend";
	gap?: number;
}

interface ToggleButtonProps extends ThemedButtonProps {
	active?: boolean;
}

type ButtonSize =
	| "xxxs"
	| "xxs"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "xxl"
	| "xxxl";

interface ButtonStyles {
	paddingVertical: number;
	paddingHorizontal: number;
}

const getButtonStyles = (size: ButtonSize): ButtonStyles => {
	let styles: ButtonStyles = {
		paddingVertical: 14,
		paddingHorizontal: 18,
	};

	switch (size) {
		case "xxxs":
			styles = {
				paddingVertical: 6,
				paddingHorizontal: 10,
			};
			break;
		case "xxs":
			styles = {
				paddingVertical: 8,
				paddingHorizontal: 12,
			};
			break;
		case "xs":
			styles = {
				paddingVertical: 10,
				paddingHorizontal: 14,
			};
			break;
		case "sm":
			styles = {
				paddingVertical: 12,
				paddingHorizontal: 16,
			};
			break;
		case "md":
			styles = {
				paddingVertical: 14,
				paddingHorizontal: 18,
			};
			break;
		case "lg":
			styles = {
				paddingVertical: 16,
				paddingHorizontal: 20,
			};
			break;
		case "xl":
			styles = {
				paddingVertical: 18,
				paddingHorizontal: 22,
			};
			break;
		case "xxl":
			styles = {
				paddingVertical: 20,
				paddingHorizontal: 24,
			};
			break;
		case "xxxl":
			styles = {
				paddingVertical: 22,
				paddingHorizontal: 26,
			};
			break;
		default:
			// Default values already set
			break;
	}

	return styles;
};
