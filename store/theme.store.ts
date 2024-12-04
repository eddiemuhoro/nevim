import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ThemeStore {
    theme: "light" | "dark" | "system";
}

const themeStore = create(
    persist<ThemeStore>(
        (set) => ({
            theme: "system",
        }),
        {
            name: "theme-storage",
        }
    )
);

export default themeStore;