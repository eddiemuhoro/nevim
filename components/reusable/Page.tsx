import { sWidth } from "@/constants/window.constants";
import { useThemeColor } from "@/hooks/useTheme.hook";
import userStore from "@/store/user.store";
import { Stack, Tabs, router, useNavigation, usePathname } from "expo-router";
import React, {
	ReactNode,
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react";
import { Platform, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Box, { BoxProps } from "./Box";
import ThemedButton, { ThemedIconButton } from "./Buttons";
import ThemedIcon from "./ThemedIcon";

function BackButton() {
	const platform = Platform.OS;
	return (
		<ThemedButton
			type="text"
			onPress={() => {
				router.back();
			}}
		>
			{platform === "ios" ? (
				<ThemedIcon name="chevron-left" size={"xxl"} />
			) : (
				<ThemedIcon name="arrow-left" size={"xl"} />
			)}
		</ThemedButton>
	);
}

const Page = forwardRef(
	({ children, scrollable = false, ...props }: PageProps, ref) => {
		const [isDrawerOpen, setIsDrawerOpen] = useState(false);

		const user = userStore((state) => state.user);

		const handleToggleDrawer = () => {
			setIsDrawerOpen(!isDrawerOpen);
		};

		const handleCloseDrawer = () => {
			setIsDrawerOpen(false);
		};

		const path = usePathname();

		useEffect(() => {
			console.log("Page Rendered: ", props.header?.title);
		}, []);

		const scrollRef = React.useRef<ScrollView>(null);

		function scrollToTop() {
			scrollRef.current?.scrollTo({ y: 0, animated: true });
		}

		function scrollToBottom() {
			scrollRef.current?.scrollToEnd({ animated: true });
		}

		useImperativeHandle(ref, () => ({
			scrollToTop,
			scrollToBottom,
		}));

		const insets = useSafeAreaInsets();

		const backgroundColor = useThemeColor("background");

		const navigation = useNavigation();

		return (
			<>
				{props.header && props.header.for != "Tab" && (
					<>
						{props.header.headerComponent ? (
							<Stack.Screen
								options={{
									headerShown: true,
									header: () => (
										<Box block pt={insets.top}>
											{props.header?.headerComponent}
										</Box>
									),
									headerTitle: props.header?.title || "Test",
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor,
									},
									headerShadowVisible: false,
									headerBackVisible: false,
									headerBackButtonMenuEnabled: true,
								}}
							/>
						) : (
							<Stack.Screen
								options={{
									title: props.header?.title || "",
									headerShown: true,
									headerRight: () => (
										<Box align="flex-end">
											{props.header?.rightComponent ? (
												props.header?.rightComponent
											) : (
												<></>
											)}
										</Box>
									),
									headerLeft: () =>
										props.header?.disableBackButton ? <></> : <BackButton />,
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor,
									},
									headerShadowVisible: false,
									headerBackVisible: false,
								}}
							/>
						)}
					</>
				)}
				{props.header && props.header.for == "Tab" && (
					<>
						{props.header.headerComponent ? (
							<Tabs.Screen
								options={{
									headerShown: true,
									header: () => (
										<Box block pt={insets.top}>
											{props.header?.headerComponent}
										</Box>
									),
									headerTitle: props.header?.title || "",
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor,
									},
									headerShadowVisible: false,
								}}
							/>
						) : (
							<Tabs.Screen
								options={{
									title: props.header?.title || "",
									headerShown: true,
									headerRight: () => (
										<Box align="flex-end">
											{props.header?.rightComponent ? (
												props.header?.rightComponent
											) : (
												<>
													{user && (
														<ThemedIconButton
															icon={{ name: "menu" }}
															onPress={handleToggleDrawer}
														/>
													)}
												</>
											)}
										</Box>
									),
									headerTitleAlign: "center",
									headerStyle: {
										backgroundColor,
									},
									headerShadowVisible: false,
								}}
							/>
						)}
					</>
				)}
				<>
					<PageBody scrollable={scrollable} bodyProps={props}>
						{children}
					</PageBody>
				</>
			</>
		);
	}
);

export default Page;

function PageBody({
	scrollable,
	bodyProps,
	children,
}: {
	scrollable: boolean;
	bodyProps?: BoxProps;
	children: ReactNode;
}) {
	const backgroundColor = useThemeColor("background");

	return (
		<>
			{scrollable ? (
				<ScrollView contentContainerStyle={{ paddingBottom: 20 }}>
					<Box
						width={sWidth}
						flex={1}
						color={backgroundColor}
						height={"100%"}
						gap={10}
						py={10}
						{...bodyProps}
					>
						{children}
					</Box>
				</ScrollView>
			) : (
				<Box
					width={sWidth}
					flex={1}
					color={backgroundColor}
					height={"100%"}
					gap={10}
					py={10}
					{...bodyProps}
				>
					{children}
				</Box>
			)}
		</>
	);
}

interface PageProps extends BoxProps {
	children: ReactNode;
	scrollable?: boolean;
	headerComponent?: ReactNode;
	header?: {
		title?: string;
		disableBackButton?: boolean;
		rightComponent?: ReactNode;
		for?: "Stack" | "Drawer" | "Tab";
		headerComponent?: ReactNode;
	};
	disableHeader?: boolean;
}
