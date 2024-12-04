import colors from "@/constants/color.constants";
import themeStore from "@/store/theme.store";
import { useColorScheme } from "react-native";

export function useThemeColor(
    colorName: keyof typeof colors.light & keyof typeof colors.dark,
    props?: { light?: string; dark?: string },
) {
    let themeToSet: "dark" | "light" = "light"

    const { theme: userTheme } = themeStore();

    const systemTheme = useColorScheme() ?? 'light';


    if (userTheme === 'system') {
        themeToSet = systemTheme;
    } else {
        themeToSet = userTheme;
    }

    if (!props) {
        return colors[themeToSet][colorName];
    }
    const colorFromProps = props[themeToSet];

    if (colorFromProps) {
        return colorFromProps;
    } else {
        return colors[themeToSet][colorName];
    }
}

export function useTheme() {
    let themeToSet: "dark" | "light" = "light"

    const { theme: userTheme } = themeStore();

    const systemTheme = useColorScheme() ?? 'light';

    if (userTheme === 'system') {
        themeToSet = systemTheme;
    } else {
        themeToSet = userTheme;
    }

    return themeToSet === "dark" ? colors.dark : colors.light;

}