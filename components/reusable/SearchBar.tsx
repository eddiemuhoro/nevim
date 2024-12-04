import React from "react";
import ThemedTextInput from "./TextInputs";
import ThemedIcon from "./ThemedIcon";

export default function SearchBar(
	props: React.ComponentProps<typeof ThemedTextInput>
) {
	return (
		<ThemedTextInput
			leftSlot={<ThemedIcon name="search" />}
			placeholder="Search"
			{...props}
			size="sm"
		/>
	);
}
