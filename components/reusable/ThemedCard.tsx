import React from "react";
import { useTheme } from "../../hooks/useTheme.hook";
import Box, { BoxProps } from "./Box";
import ThemedIcon, { IconProps } from "./ThemedIcon";
import ThemedText from "./ThemedText";

export default function ThemedCard({
	title,
	icon,
	children,
	...boxProps
}: ThemedCardProps) {
	const theme = useTheme();
	return (
		<Box radius={30} color={theme.surface} gap={10} pa={20} {...boxProps}>
			{(icon || title) && (
				<Box align="center" gap={5}>
					{icon && <ThemedIcon size={"xxxl"} {...icon} />}
					{title && (
						<ThemedText align="center" fontWeight="bold">
							{title}
						</ThemedText>
					)}
				</Box>
			)}
			{children}
		</Box>
	);
}

interface ThemedCardProps extends BoxProps {
	title?: string;
	icon?: IconProps;
	children?: React.ReactNode;
}
