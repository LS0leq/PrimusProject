import {Container} from "./Container.mjs";
import {LoginLayout} from "../pages/login/LoginLayout.mjs";
import {DashboardLayout} from "../pages/dashboard/DashboardLayout.mjs";
import {App} from "../../requests/App.mjs";

export const RootLayout = new CjsLayout(
    [
        [Container, [
            // [LoginLayout],
            // [DashboardLayout],
        ]]
    ]
);

RootLayout.loadDashboard = () => Container.loadLayout(DashboardLayout);
RootLayout.loadLogin = () => Container.loadLayout(LoginLayout);

RootLayout.onLoad(async () => {
    console.log('RootLayout loaded!');

    if(localStorage.getItem("token")) {
        const isTokenValid = await App.users.validateToken();

        if(!isTokenValid) return RootLayout.loadLogin();

        App.users.self();

        return Search.set("/dashboard/stats");
    }

    RootLayout.loadLogin();

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
