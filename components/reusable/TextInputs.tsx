import Colors from "@/constants/color.constants";
import React, { ReactNode, useEffect, useState } from "react";
import {
	FlatList,
	TextInput,
	TextInputProps,
	TouchableOpacity,
	useColorScheme,
} from "react-native";

import { sHeight } from "@/constants/window.constants";
import Box, { BoxProps } from "./Box";
import ThemedButton, { ThemedButtonProps, ThemedIconButton } from "./Buttons";
import Spacer from "./Spacer";
import ThemedIcon from "./ThemedIcon";
import ThemedModal from "./ThemedModal";
import ThemedText, { ThemedTextProps } from "./ThemedText";

export default function ThemedTextInput({
	wrapper,
	errorMessage,
	errors,
	leftSlot,
	leftSlotProps,
	rightSlot,
	rightSlotProps,
	dense,
	label,
	labelProps,
	size = "md",
	...input
}: ThemedTextInputProps) {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	const sizeStyles = getTextStyles(size);

	return (
		<Box>
			{label && (
				<>
					<ThemedText size={"sm"} fontWeight="light" {...labelProps}>
						{label}
					</ThemedText>
					<Spacer height={10} />
				</>
			)}
			<>
				<Box
					radius={20}
					direction="row"
					justify="flex-start"
					color={theme.background}
					{...wrapper}
				>
					{leftSlot && (
						<Box
							pl={sizeStyles.paddingHorizontal / 2}
							align="center"
							justify="center"
							{...leftSlotProps}
						>
							{leftSlot}
						</Box>
					)}

					<TextInput
						style={{
							flexGrow: 1,
							paddingLeft: leftSlot
								? sizeStyles.paddingHorizontal / 4
								: sizeStyles.paddingHorizontal,
							paddingVertical: sizeStyles.paddingVertical,
							fontSize: sizeStyles.fontSize,
							color: theme.text,
							minWidth: input.placeholder?.length
								? input.placeholder.length * 10
								: 100,
						}}
						placeholderTextColor={theme.text}
						{...input}
					/>
					{rightSlot && (
						<Box
							pr={sizeStyles.paddingHorizontal / 2}
							align="center"
							justify="center"
							{...rightSlotProps}
						>
							{rightSlot}
						</Box>
					)}
				</Box>

				{errorMessage && (
					<ThemedText color={theme.danger} size={12}>
						{errorMessage}
					</ThemedText>
				)}
				{errors && errorMessage?.length && (
					<Box block>
						{errors.map((err) => (
							<ThemedText key={err} color={theme.danger} size={12}>
								{err}
							</ThemedText>
						))}
					</Box>
				)}
			</>
		</Box>
	);
}

export function SearchBar(props: React.ComponentProps<typeof ThemedTextInput>) {
	return (
		<ThemedTextInput
			leftSlot={
				<Box px={5}>
					<ThemedIcon name="search" />
				</Box>
			}
			placeholder="Search"
			{...props}
		/>
	);
}

export function ThemedEmailInput(props: ThemedTextInputProps) {
	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return (
		<ThemedTextInput
			placeholder="Email"
			keyboardType="email-address"
			rightSlot={<ThemedIcon name="mail" size={18} />}
			rightSlotProps={{ pr: 20 }}
			{...props}
		/>
	);
}

export function ThemedPasswordInput(props: ThemedTextInputProps) {
	const [showPassword, setShowPassword] = useState(false);

	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return (
		<ThemedTextInput
			placeholder="Password"
			{...props}
			secureTextEntry={!showPassword}
			rightSlot={
				<ThemedButton onPress={() => setShowPassword(!showPassword)}>
					<ThemedIcon name={showPassword ? "eye-off" : "eye"} size={18} />
				</ThemedButton>
			}
			rightSlotProps={{ pr: 20 }}
		/>
	);
}

export function ThemedSearchInput(props: ThemedSearchInputProps) {
	const [value, setValue] = useState(props.value || "");

	return (
		<ThemedTextInput
			placeholder="Search"
			value={value}
			{...props}
			onChangeText={(value) => {
				setValue(value);
				if (props.onChangeText) props.onChangeText(value);
			}}
			rightSlot={
				<ThemedIconButton
					icon={{ name: "x" }}
					onPress={() => {
						setValue("");
						if (props.clear) props.clear();
					}}
				/>
			}
		/>
	);
}

export function ThemedSelectInput<T extends Obj[]>(
	props: ThemedSelectProps<T>
) {
	const [selectedOption, setSelectedOption] = useState<Record<string, any>>(
		props.selected as any
	);
	const [showOptionPicker, setShowOptionPicker] = useState(false);

	const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
		props.options
	);

	function filterOptions(query: string) {
		const found = props.options.filter((option) =>
			option[props.labelProperty]
				.toString()
				.toLowerCase()
				.includes(query.toLowerCase())
		);
		setFilteredOptions(found);
	}

	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	return (
		<>
			<TouchableOpacity onPress={() => setShowOptionPicker(true)}>
				<ThemedTextInput
					placeholder="Select"
					value={
						selectedOption ? selectedOption[props.labelProperty].toString() : ""
					}
					{...props}
					wrapper={{ viewProps: { pointerEvents: "none" }, ...props.wrapper }}
					rightSlot={
						<ThemedIconButton
							icon={{ name: "chevron-down" }}
							onPress={() => setShowOptionPicker(true)}
						/>
					}
				/>
			</TouchableOpacity>

			<ThemedModal
				position="bottom"
				visible={showOptionPicker}
				containerProps={{
					height: Math.min(props.options.length * 80, sHeight - 100),
				}}
				close={() => setShowOptionPicker(false)}
			>
				{props.enableSearch && (
					<ThemedTextInput
						placeholder="Search"
						leftSlot={<ThemedIcon name="search" size={16} />}
						onChangeText={(value) => {
							filterOptions(value);
						}}
					/>
				)}
				<FlatList
					data={filteredOptions}
					renderItem={({ item: option }: { item: T[number] }) => {
						return (
							<TouchableOpacity
								onPress={() => {
									if (props.onInput) props.onInput(option);
									setSelectedOption(option);
									setShowOptionPicker(false);
								}}
							>
								<Box
									key={option[props.labelProperty]}
									direction="row"
									block
									pa={20}
									gap={10}
								>
									<ThemedText>{option[props.labelProperty]}</ThemedText>
								</Box>
							</TouchableOpacity>
						);
					}}
				/>
			</ThemedModal>
		</>
	);
}
export function ThemedOptionsPicker<T extends Obj[]>(
	props: ThemedOptionsPickerProps<T>
) {
	const [selectedOption, setSelectedOption] = useState<
		Record<string, any> | null | undefined
	>(props.selected as any);
	const [showOptionPicker, setShowOptionPicker] = useState(false);

	const [filteredOptions, setFilteredOptions] = useState<T[number][]>(
		props.options
	);

	const colorScheme = useColorScheme();
	const theme = Colors[colorScheme ?? "light"];

	function filterOptions(query: string) {
		const found = props.options.filter((option) =>
			option[props.labelProperty]
				.toString()
				.toLowerCase()
				.includes(query.toLowerCase())
		);
		setFilteredOptions(found);
	}

	useEffect(() => {
		setSelectedOption(props.selected);
		filterOptions("");
	}, [props.selected]);

	return (
		<>
			<ThemedButton
				{...props}
				label={
					selectedOption
						? selectedOption[props.labelProperty].toString()
						: props.label
						? props.label
						: "Select"
				}
				icon={{ name: "chevron-down", position: "append" }}
				onPress={() => setShowOptionPicker(true)}
				type={selectedOption ? "secondary" : "surface"}
			/>

			<ThemedModal
				position="bottom"
				visible={showOptionPicker}
				containerProps={{
					height: Math.min(props.options.length * 50, sHeight - 120),
					radiusTop: 20,
					pa: 10,
					pb: 0,
				}}
				close={() => setShowOptionPicker(false)}
				title={`Select ${props.label}`}
			>
				{props.enableSearch && (
					<ThemedTextInput
						placeholder="Search"
						leftSlot={<ThemedIcon name="search" size={16} />}
						onChangeText={(value) => {
							filterOptions(value);
						}}
					/>
				)}
				<FlatList
					data={filteredOptions}
					renderItem={({ item: option }: { item: T[number] }) => {
						return (
							<Box align="flex-start" key={option[props.labelProperty]} block>
								<ThemedButton
									label={option[props.labelProperty]}
									type={selectedOption === option ? "secondary" : "text"}
									size="sm"
									onPress={() => {
										if (props.onInput) props.onInput(option);
										setSelectedOption(option);
										setShowOptionPicker(false);
									}}
									width={"100%"}
									wrapperProps={{ justify: "flex-start" }}
									radius={15}
								/>
							</Box>
						);
					}}
				/>
			</ThemedModal>
		</>
	);
}

type _BoxProps = Omit<BoxProps, "children">;

interface SlotProps extends _BoxProps {
	spacing?: number;
}

interface ThemedTextInputProps extends TextInputProps {
	wrapper?: Omit<BoxProps, "children">;
	errorMessage?: string | null | undefined;
	errors?: string[];
	leftSlot?: ReactNode;
	rightSlot?: ReactNode;
	leftSlotProps?: SlotProps;
	rightSlotProps?: SlotProps;
	label?: string;
	labelProps?: ThemedTextProps;
	dense?: boolean;
	size?: InputSize;
}

interface ThemedSearchInputProps extends ThemedTextInputProps {
	onInput?: (value: string) => void;
	clear?: () => void;
}

type Obj = { [key: string]: any }; // Define a general object type

type KeysUnion<T extends Obj[]> = T extends Array<infer U> ? keyof U : never; // Extract keys union from array of objects

interface ThemedSelectProps<T extends Obj[]> extends ThemedTextInputProps {
	options: T;
	labelProperty: KeysUnion<T>;
	enableSearch?: boolean;
	selected?: T[number];
	onInput?: (selectedOption: T[number]) => void;
}

interface ThemedOptionsPickerProps<T extends Obj[]> extends ThemedButtonProps {
	options: T;
	labelProperty: KeysUnion<T>;
	enableSearch?: boolean;
	selected?: T[number] | null;
	onInput?: (selectedOption: T[number]) => void;
}

// interface ThemedSelectProps extends Props<T> {
// 	onInput: (value: Record<string, any>) => void;
// 	options: Record<string, any>[];
// 	labelProperty: string;
// 	enableSearch?: boolean;
// 	selected?: Record<string, any>;
// }

type InputSize =
	| "xxxs"
	| "xxs"
	| "xs"
	| "sm"
	| "md"
	| "lg"
	| "xl"
	| "xxl"
	| "xxxl";

interface InputStyles {
	paddingVertical: number;
	paddingHorizontal: number;
	fontSize: number;
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
];

const getTextStyles = (size: InputSize): InputStyles => {
	let styles: InputStyles = {
		paddingVertical: 14,
		paddingHorizontal: 18,
		fontSize: 16,
	};

	switch (size) {
		case "xxxs":
			styles = {
				paddingVertical: 6,
				paddingHorizontal: 10,
				fontSize: 6,
			};
			break;
		case "xxs":
			styles = {
				paddingVertical: 2,
				paddingHorizontal: 12,
				fontSize: 8,
			};
			break;
		case "xs":
			styles = {
				paddingVertical: 0,
				paddingHorizontal: 14,
				fontSize: 10,
			};
			break;
		case "sm":
			styles = {
				paddingVertical: 12,
				paddingHorizontal: 16,
				fontSize: 12,
			};
			break;
		case "md":
			styles = {
				paddingVertical: 14,
				paddingHorizontal: 18,
				fontSize: 14,
			};
			break;
		case "lg":
			styles = {
				paddingVertical: 16,
				paddingHorizontal: 20,
				fontSize: 16,
			};
			break;
		case "xl":
			styles = {
				paddingVertical: 18,
				paddingHorizontal: 22,
				fontSize: 18,
			};
			break;
		case "xxl":
			styles = {
				paddingVertical: 20,
				paddingHorizontal: 24,
				fontSize: 20,
			};
			break;
		case "xxxl":
			styles = {
				paddingVertical: 22,
				paddingHorizontal: 26,
				fontSize: 22,
			};
			break;
		default:
			// Default values already set
			break;
	}

	return styles;
};
