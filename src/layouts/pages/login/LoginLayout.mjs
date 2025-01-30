import {Wrapper} from "./Wrapper.mjs";
import {Form} from "./Form.mjs";
import {Info} from "./Info.mjs";

export const LoginLayout = new CjsLayout(
    [
        [Wrapper, [
            [Form],
            [Info]
        ]]
    ]
);