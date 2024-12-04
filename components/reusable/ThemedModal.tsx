import { sHeight } from "@/constants/window.constants";
import { useThemeColor } from "@/hooks/useTheme.hook";
import { AnimatePresence, MotiView } from "moti";
import React, { ReactNode } from "react";
import { Modal, Pressable } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Box, { BoxProps } from "./Box";
import ThemedButton from "./Buttons";
import ThemedText from "./ThemedText";

export default function ThemedModal({
	visible = false,
	containerProps,
	close,
	position = "center",
	scrollable,
	title,
	children,
	leftChild,
	hideCloseButton = false,
	...modalProps
}: ThemedModalProps) {
	const background = useThemeColor("background");
	const insets = useSafeAreaInsets();

	const CloseButton = () => (
		<Pressable style={{ width: "100%", flex: 1 }} onPress={close}></Pressable>
	);

	return (
		<>
			{visible && (
				<Modal
					transparent
					{...modalProps}
					visible={visible}
					onRequestClose={close}
				>
					<Box
						height={"100%"}
						block
						color={"rgba(0,0,0,0.5)"}
						justify={
							position === "center"
								? "center"
								: position === "top"
								? "flex-start"
								: "flex-end"
						}
						align={"center"}
						pa={position === "center" ? 10 : 0}
					>
						{position === "center" && <CloseButton />}
						{position === "bottom" && <CloseButton />}
						<AnimatePresence>
							<MotiView
								from={{
									transform: [
										{ translateY: position === "top" ? -100 : 100 },
										{ scale: position === "center" ? 0.6 : 1 },
									],
									opacity: 0,
								}}
								animate={{
									transform: [{ translateY: 0 }, { scale: 1 }],
									opacity: 1,
								}}
								transition={{ type: "timing", duration: 200 }}
								style={{ width: "100%", alignItems: "center" }}
							>
								<Box
									color={background}
									pt={leftChild || title ? 15 : 0}
									radiusBottom={
										position === "top" || position === "center" ? 30 : 0
									}
									radiusTop={
										position === "bottom" || position === "center" ? 30 : 0
									}
									block
									position="relative"
									style={{ maxHeight: sHeight - insets.top }}
								>
									{(leftChild || title) && (
										<Box
											direction="row"
											block
											justify="space-between"
											align="center"
										>
											<Box flex={0.5}>{leftChild && leftChild}</Box>
											<Box flex={1}>
												<ThemedText fontWeight="bold" align="center">
													{title || ""}
												</ThemedText>
											</Box>
											<Box flex={0.5} align="flex-end"></Box>
										</Box>
									)}
									{hideCloseButton == false && (
										<ThemedButton
											icon={{
												name: "x",
											}}
											onPress={() => close && close()}
											size="sm"
											type="text"
											style={{
												position: "absolute",
												top: 5,
												right: 0,
												zIndex: 10,
											}}
										/>
									)}
									<Box
										style={{ maxHeight: sHeight - insets.top }}
										pa={20}
										{...containerProps}
									>
										{children}
									</Box>
								</Box>
							</MotiView>
						</AnimatePresence>
						{position === "top" && <CloseButton />}
						{position === "center" && <CloseButton />}
					</Box>
				</Modal>
			)}
		</>
	);
}

export interface ThemedModalProps {
	containerProps?: Omit<BoxProps, "children">;
	children?: ReactNode;
	position?: "top" | "center" | "bottom";
	scrollable?: boolean;
	title?: string;
	leftChild?: ReactNode;
	hideCloseButton?: boolean;
	close?: () => void;
	visible?: boolean;
}
