import {DashboardLayout} from "./layouts/pages/dashboard/DashboardLayout.mjs";
import {RootLayout} from "./layouts/root/RootLayout.mjs";
import {ThemePlugin} from "./plugins/ThemePlugin.mjs";
import {App} from "./requests/App.mjs";

Search.setDisplayedOnScreen(true);

CjsPluginManager.enable({
    notification: true
});

init(RootLayout);

Search.onChange((search) => {
    if(Search.startsWith("/dashboard")) {
        if(!DashboardLayout.exists()) {
            RootLayout.loadDashboard();
        }

        const category = Search.get(1);

        DashboardLayout.loadContent(category);
    }

});

ThemePlugin.loadTheme();

ThemePlugin.setTheme("dark");

(async () => {
    const stations = await App.stations.getAll();

})();