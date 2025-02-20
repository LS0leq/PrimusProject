import {Card} from "../Card.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {SettingsForm} from "./SettingsForm.mjs";


export const AccountLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd konta",text:"",user:" "})],
        [Wrapper.withData({class:"wrapper column"}),[
            [Card.withData({title: "Edytuj dane konta"}),[
                [SettingsForm]
            ]
            ]]]
    ]
);