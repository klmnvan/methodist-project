import React, { createContext, useContext } from "react";
import {action, makeAutoObservable, observable} from "mobx";

export const darkTheme = {
    back: "#21242B",
    container: "#2B2D39",
    title: "#FFFFFF",
    description: "#9AA5B5",
};

export const lightTheme = {
    back: "#F3F3F3",
    container: "#FFFFFF",
    title: "#26272B",
    description: "#AAADB2",
};

class AppStore {
    queryClient = null;
    theme = "dark";
    events = []
    categories = []
    commissions = []
    statuses = [];
    eventForms = [];
    results = [];
    participationForms = [];
    profile = null

    constructor() {
        makeAutoObservable(this, {
            events: observable,
            commissions: observable,
            categories: observable,
            profile: observable,
            queryClient: observable,
            statuses: observable,
            eventForms: observable,
            results: observable,
            participationForms: observable,
            setEvents: action,
            setCategories: action,
            setCommissions: action,
            setQueryClient: action,
            setStatuses: action,
            setEventForms: action,
            setResults: action,
            setParticipationForms: action,
        });
    }

    switchTheme = () => {
        this.theme = this.theme === "light" ? "dark" : "light";
        this._updateThemeCSS();
    };

    _updateThemeCSS() {
        const root = document.documentElement;
        const theme = this.theme === "light" ? lightTheme : darkTheme;
        root.style.setProperty("--color-container", theme.container);
        root.style.setProperty("--color-bg", theme.back);
        root.style.setProperty("--color-title", theme.title);
        root.style.setProperty("--color-description", theme.description);
    }

    setQueryClient = (client) => {
        this.queryClient = client;
    }

    setEvents = (data) => {
        this.events = data
    }

    setCommissions = (data) => {
        this.commissions = data
    }

    setCategories = (data) => {
        this.categories = data
    }

    setStatuses = (data) => {
        this.statuses = data
    }

    setEventForms = (data) => {
        this.eventForms = data
    }

    setResults = (data) => {
        this.results = data
    }

    setParticipationForms = (data) => {
        this.participationForms = data
    }

    setProfile = (data) => {
        this.profile = data
    }

}

const appStore = new AppStore();
const AppStoreContext = createContext();

export const AppStoreProvider = ({ children }) => {
    return (
        <AppStoreContext.Provider value={appStore}>
            {children}
        </AppStoreContext.Provider>
    );
};

export const useTheme = () => {
    const store = useContext(AppStoreContext);
    return {
        theme: store.theme,
        switchTheme: store.switchTheme, // Вызов MobX-действия
    };
};

export const useStore = () => {
    const store = useContext(AppStoreContext);
    if (!store) throw new Error("useStore must be used within AppStoreProvider");
    return store;
};