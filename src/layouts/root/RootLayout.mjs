import {Container} from "./Container.mjs";
import {LoginLayout} from "../pages/login/LoginLayout.mjs";

export const RootLayout = new CjsLayout(
    [
        [Container, [
            [LoginLayout]
        ]]
    ]
);

RootLayout.onLoad(() => {
    console.log('RootLayout loaded!');
});