const tintColorLight = '#000';
const tintColorDark = '#fff';

export default {
  light: {
    text: '#000',
    background: '#F1F1F1',
    tint: tintColorLight,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    primary: "#76BCFD",
    surface: "#fff",
    danger: '#ff0000',
    warning: '#ffae00',
    success: '#00ff00',
  },
  dark: {
    text: '#fff',
    background: '#131213',
    tint: tintColorDark,
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorDark,
    primary: "#76BCFD",
    surface: "#1F1F1F",
    danger: '#ff0000',
    warning: '#ffae00',
    success: '#00ff00',
  },
} as const;
