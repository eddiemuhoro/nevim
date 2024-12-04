import { Platform } from "react-native";

export function scaleByOs(value: number) {
    return Platform.OS === 'ios' ? value * 1.5 : value;
}

export function generateRandomPastelColor({
    hue = Math.floor(Math.random() * 360),
    saturation = 50,
    lightness = 95,
} = {}) {
    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function commaSeparatedNumber(number: number) {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}