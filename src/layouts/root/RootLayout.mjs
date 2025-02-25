import {Container} from "./Container.mjs";
import {LoginLayout} from "../pages/login/LoginLayout.mjs";
import {DashboardLayout} from "../pages/dashboard/DashboardLayout.mjs";

export const RootLayout = new CjsLayout(
    [
        [Container, [
            [LoginLayout],
            // [DashboardLayout],
        ]]
    ]
);

RootLayout.loadDashboard = () => Container.loadLayout(DashboardLayout);
RootLayout.loadLogin = () => Container.loadLayout(LoginLayout);

RootLayout.onLoad(() => {
    console.log('RootLayout loaded!');

    // Search.set("/dashboard/stats")
    // Search.set("/dashboard/messages")
    // Search.set("/dashboard/account")
    // Search.set("/dashboard/report")
    // Search.set("/dashboard/users")
    // Search.set("/dashboard/discount")
});

RootLayout.logout = () => {
    console.log("Logging out...");
    RootLayout.loadLogin();
};
