import {DashboardLayout} from "./layouts/pages/dashboard/DashboardLayout.mjs";
import {RootLayout} from "./layouts/root/RootLayout.mjs";

Search.setDisplayedOnScreen(true);

init(RootLayout);

Search.onChange((search) => {
});