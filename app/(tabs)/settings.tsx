import Box from "@/components/reusable/Box";
import ThemedButton from "@/components/reusable/Buttons";
import Page from "@/components/reusable/Page";
import ThemedIcon from "@/components/reusable/ThemedIcon";
import ThemedText from "@/components/reusable/ThemedText";
import themeStore from "@/store/theme.store";
import { router } from "expo-router";

export default function TabTwoScreen() {
	const theme = themeStore((state) => state.theme);
	return (
		<Page
			header={{
				title: "Settings",
				disableBackButton: true,
			}}
			px={20}
		>
			<ThemedButton type="surface" pa={15} radius={20}>
				<Box direction="row" align="center" gap={5}>
					<Box px={10}>
						<ThemedIcon name={"contrast"} size={"xl"} source="MaterialIcons" />
					</Box>
					<Box flex={1}>
						<ThemedText style={{ opacity: 0.6 }} size={"sm"}>
							Theme
						</ThemedText>
						<ThemedText>{theme}</ThemedText>
					</Box>
					<Box px={10}>
						{/* <ThemedIcon name={"edit-2"} /> */}
					</Box>
				</Box>
			</ThemedButton>
			<ThemedButton
				type="surface"
				color="crimson"
				pa={15}
				height={70}
				radius={20}
				onPress={() => {
					router.replace("/(auth)/login");
				}}
			>
				<Box direction="row" align="center" gap={5}>
					<Box px={10}>
						<ThemedIcon
							name={"logout"}
							size={"xl"}
							source="MaterialCommunityIcons"
							color="white"
						/>
					</Box>
					<Box flex={1}>
						<ThemedText color="white">Logout</ThemedText>
					</Box>
					<Box px={10}>
						<ThemedIcon name={"chevron-right"} color="white" />
					</Box>
				</Box>
			</ThemedButton>
		</Page>
	);
}
