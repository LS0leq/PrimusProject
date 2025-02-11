import {DashboardLayout} from "./layouts/pages/dashboard/DashboardLayout.mjs";
import {RootLayout} from "./layouts/root/RootLayout.mjs";

Search.setDisplayedOnScreen(true);

init(RootLayout);

Search.onChange((search) => {
    if(Search.startsWith("/dashboard")) {
        const category = Search.get(1);

        DashboardLayout.loadContent(category);
    }
});