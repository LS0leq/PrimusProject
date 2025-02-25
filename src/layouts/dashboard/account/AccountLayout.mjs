import {Card} from "../Card.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {Personal} from "./Personal.mjs";
import {Address} from "./Address.mjs";
import {Contact} from "./Contact.mjs";

const style = "width: calc(50% - 10px)";

export const AccountLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd konta",text:"",user:" "})],
        [Wrapper.withData({ style: "display: flex; flex-wrap: wrap; gap: 10px; padding: 10px;" }),[
            [Card.withData({title: "Dane adresowe", style }),[
                [Address]
            ]],
            [Card.withData({title: "Dane kontaktowe", style }),[
                [Contact]
            ]],
            [Card.withData({title: "Dane osobowe", style  }),[
                [Personal]
            ]],
        ]]
    ]
);