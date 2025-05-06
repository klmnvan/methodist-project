import React, {createContext, useContext, useState} from "react";

export const darkTheme = {
    back: "#21242B",
    container: "#2B2D39",
    title: "#FFFFFF",
    description: "#9AA5B5",
}

export const lightTheme = {
    back: "#F3F3F3",
    container: "#FFFFFF",
    title: "#26272B",
    description: "#AAADB2",
}

const ThemeContext = createContext();
export const MethodistThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState("dark");

    const switchTheme = () => {
        const newTheme = themeName === "light" ? "dark" : "light";
        setThemeName(newTheme);

        // Обновляем CSS-переменные
        const root = document.documentElement;
        const theme = newTheme === "light" ? lightTheme : darkTheme;
        root.style.setProperty("--color-container", theme.container);
        root.style.setProperty("--color-bg", theme.back);
        root.style.setProperty("--color-title", theme.title);
        root.style.setProperty("--color-description", theme.description);
    };

    return (
        <ThemeContext.Provider value={{ theme: themeName, switchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useTheme = () => useContext(ThemeContext);