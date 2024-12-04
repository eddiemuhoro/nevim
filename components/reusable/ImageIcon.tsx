import React from "react";
import { DimensionValue, Image } from "react-native";
import { iconSizes } from "./ThemedIcon";

export default function ImageIcon({ size = "md", ...props }: ImageIconProps) {
	const iconSize = () => {
		if (typeof size === "string") {
			if (size.includes("%")) {
				return size as DimensionValue;
			}
			return iconSizes.find((options) => options.size === size)!.value;
		} else {
			return size;
		}
	};
	return (
		<Image
			resizeMode="contain"
			style={{
				width: iconSize(),
				height: iconSize(),
			}}
			{...props}
		/>
	);
}

interface ImageIconProps extends React.ComponentProps<typeof Image> {
	size?: (typeof iconSizes)[number]["size"] | number | string;
}
