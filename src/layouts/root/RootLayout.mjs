import {Container} from "./Container.mjs";
import {LoginLayout} from "../pages/login/LoginLayout.mjs";
import {DashboardLayout} from "../pages/dashboard/DashboardLayout.mjs";

export const RootLayout = new CjsLayout(
    [
        [Container, [
            // [LoginLayout],
            [DashboardLayout],
        ]]
    ]
);

RootLayout.onLoad(() => {
    console.log('RootLayout loaded!');

    // Search.set("/dashboard/stats")
    Search.set("/dashboard/messages")
    // Search.set("/dashboard/account")
    // Search.set("/dashboard/report")
    // Search.set("/dashboard/users")
    // Search.set("/dashboard/discount")
});