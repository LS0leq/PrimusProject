import {Card} from "../Card.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {List} from "./List.mjs";

export const UsersLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd użytkowników",text:"",user:" "})],
        [Wrapper.withData({class:"wrapper column"}),[
            [Card.withData({title: "Lista użytkowników"}),[
                [List]
            ]
            ]]]
    ]
);