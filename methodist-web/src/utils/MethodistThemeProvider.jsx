import React, {createContext, useContext, useState} from "react";

export const darkTheme = {
    body: "#000",
    textColor: "#fff",
    headingColor: "lightblue"
}

export const lightTheme = {
    body: "#fff",
    textColor: "#000",
    headingColor: "#d23669"
}

const ThemeContext = createContext();
export const MethodistThemeProvider = ({ children }) => {
    const [themeName, setThemeName] = useState("light");

    const switchTheme = () => {
        const newTheme = themeName === "light" ? "dark" : "light";
        setThemeName(newTheme);

        // Обновляем CSS-переменные
        const root = document.documentElement;
        const theme = newTheme === "light" ? lightTheme : darkTheme;
        root.style.setProperty("--color-bg", theme.body);
        root.style.setProperty("--color-title", theme.textColor);
        root.style.setProperty("--color-description", theme.headingColor);
    };

    return (
        <ThemeContext.Provider value={{ theme: themeName, switchTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};
export const useTheme = () => useContext(ThemeContext);