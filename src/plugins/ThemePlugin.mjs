const Themes = {
    light: {
        "--light": "#ffffff",
        "--light-100": "#f8f8f8",
        "--light-200": "#ececec",
        "--light-300": "#d5d5d5",
        "--light-400": "#cbcbcb",
        "--light-500": "#8d8d8d",
        "--base-100": "#00e159",
        "--dark-100": "#181818",
        "--dark-200": "#343434",
        "--dark-300": "#464646",
        "--dark-400": "#626262",
        "--dark-500": "#808080",
        "--filter-green-100": "",
        "--filter-white-100": "invert(100%) brightness(5)",
        "--filter-black-100": "invert(0%) brightness(0%)",
        "--dark-font-regular": "SourceSans3-SemiBold",
        "--shadow-25": "rgba(128, 128, 128, 0.25)",
        "--background-l-100-d-300": "#f8f8f8"
    },
    dark: {
        "--light": "#000000",
        "--light-100": "#131313",
        "--light-200": "#1a1a1a",
        "--light-300": "#282828",
        "--light-400": "#3a3a3a",
        "--light-500": "#7c7c7c",
        "--base-100": "#00e159",
        "--dark-100": "#f8f8f8",
        "--dark-200": "#e5e5e5",
        "--dark-300": "#bdbdbd",
        "--dark-400": "#a8a8a8",
        "--dark-500": "#858585",
        "--filter-green-100": "invert(48%) sepia(79%) saturate(2476%) hue-rotate(86deg) brightness(118%) contrast(119%)",
        "--filter-white-100": "invert(0%) brightness(0%)",
        "--filter-black-100": "invert(100%) brightness(5)",
        "--dark-font-regular": "SourceSans3-Regular",
        "--shadow-25": "rgba(21,21,21,0.25)",
        "--background-l-100-d-300": "#282828"
    }
}

const Shared = {
    "--const-filter-black": "invert(0%) brightness(0%)",
    "--const-filter-white": "invert(100%) brightness(5)",
    "--const-filter-green": "invert(26%) sepia(75%) saturate(2210%) hue-rotate(86deg) brightness(98%) contrast(103%)",
    "--const-filter-green-2": "invert(26%) sepia(75%) saturate(2210%) hue-rotate(86deg) brightness(98%) contrast(103%)",
    "--const-filter-dark-red": "invert(21%) sepia(70%) saturate(3500%) hue-rotate(0deg) brightness(75%) contrast(100%)",
    "--base-100-dark-10": "#00cc4a",
    "--base-100-dark-20": "#00be49",
    "--base-100-dark-50": "#00a63f",
    "--base-100-dark-100": "#00772c",
    "--base-100-opacity": "rgba(0,225,89,0.33)",
}


class Theme {
    loadTheme = () => {
        const root = document.querySelector(":root");

        for(const [name, value] of Object.entries(Themes[this.getTheme()])) {
            root.style.setProperty(name, value);
        }

        for(const [name, value] of Object.entries(Shared)) {
            root.style.setProperty(name, value);
        }

    }
    /** @param {"light"|"dark"} themeName */
    setTheme = (themeName) => {
        localStorage.setItem("theme", themeName);

        this.loadTheme();
    }
    /**
     * Provides theme selected by user
     * @returns {"light"|"dark"}
     */
    getTheme = () => {
        const theme = localStorage.getItem("theme");
        const themeName = theme === null ? "light" : theme;

        if(!(themeName in Themes)) return "light";

        return themeName;
    }
}

export const ThemePlugin = new Theme();