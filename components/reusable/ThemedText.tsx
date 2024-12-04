import { useThemeColor } from "@/hooks/useTheme.hook";
import React, { ReactNode } from "react";
import { Text, TextProps, TextStyle } from "react-native";

const ThemedText = ({
	style,
	size = "md",
	color,
	darkColor,
	lightColor,
	weight = "normal",
	fontWeight,
	align = "auto",
	lineHeight,
	textDecorationLine,
	textDecorationColor,
	textDecorationStyle,
	textTransform,
	fontStyle,
	textShadowOffset,
	textShadowRadius,
	textShadowColor,
	includeFontPadding,
	fontFamily,
	fontVariant,
	letterSpacing,
	children,
	...textProps
}: ThemedTextProps) => {
	const textSize = () => {
		if (typeof size === "string") {
			const foundSize = textSizes.find((options) => options.size === size);
			if (!foundSize)
				return textSizes.find((options) => options.size === "md")!.value;
			return foundSize.value;
		} else {
			return size;
		}
	};

	const themeColor = useThemeColor("text", {
		light: lightColor,
		dark: darkColor,
	});

	return (
		<Text
			style={{
				color: color ?? themeColor,
				fontSize: textSize(),
				fontWeight: weight,
				width: "auto",
				textAlign: align,
				lineHeight,
				textDecorationLine,
				textDecorationColor,
				textDecorationStyle,
				textTransform,
				fontStyle,
				textShadowOffset,
				textShadowRadius,
				textShadowColor,
				includeFontPadding,
				// fontFamily: fontWeight
				// 	? mapFontweightToFontFamily(fontWeight)
				// 	: fontFamily,
				fontVariant,
				letterSpacing,
				...style,
			}}
			{...textProps}
		>
			{children}
		</Text>
	);
};

export default ThemedText;

function mapFontweightToFontFamily(weight: FontWeight, fontPrefix = "Mulish") {
	switch (weight) {
		case "extralight":
			return `${fontPrefix}ExtraLight`;
		case "light":
			return `${fontPrefix}Light`;
		case "regular":
			return `${fontPrefix}`;
		case "semibold":
			return `${fontPrefix}SemiBold`;
		case "bold":
			return `${fontPrefix}Bold`;
		case "extrabold":
			return `${fontPrefix}ExtraBold`;
		case "black":
			return `${fontPrefix}Black`;
		default:
			return `${fontPrefix}`;
	}
}

const textSizes = [
	{ size: "xxxs", value: 8 },
	{ size: "xxs", value: 10 },
	{ size: "xs", value: 12 },
	{ size: "sm", value: 14 },
	{ size: "md", value: 16 },
	{ size: "lg", value: 18 },
	{ size: "xl", value: 20 },
	{ size: "xxl", value: 24 },
	{ size: "xxxl", value: 28 },
] as const;

type TextSize = (typeof textSizes)[number]["size"];

export interface ThemedTextProps extends TextProps {
	color?: TextStyle["color"];
	style?: TextStyle;
	size?: TextStyle["fontSize"] | TextSize;
	weight?: TextStyle["fontWeight"];
	align?: TextStyle["textAlign"];
	lineHeight?: TextStyle["lineHeight"];
	textDecorationLine?: TextStyle["textDecorationLine"];
	textDecorationStyle?: TextStyle["textDecorationStyle"];
	textDecorationColor?: TextStyle["textDecorationColor"];
	textTransform?: TextStyle["textTransform"];
	fontStyle?: TextStyle["fontStyle"];
	textShadowOffset?: TextStyle["textShadowOffset"];
	textShadowRadius?: TextStyle["textShadowRadius"];
	textShadowColor?: TextStyle["textShadowColor"];
	includeFontPadding?: TextStyle["includeFontPadding"];
	fontFamily?: TextStyle["fontFamily"];
	fontVariant?: TextStyle["fontVariant"];
	letterSpacing?: TextStyle["letterSpacing"];
	fontWeight?: FontWeight;
	darkColor?: string;
	lightColor?: string;
	icon?: {
		name: any;
		position?: "append" | "prepend";
		size?: number;
		color?: string;
		gap?: number;
	};
	textProps?: TextProps;
	children: ReactNode;
}

type FontWeight =
	| "extralight"
	| "light"
	| "regular"
	| "semibold"
	| "extrabold"
	| "bold"
	| "black";
