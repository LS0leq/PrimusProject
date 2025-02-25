import {Card} from "../Card.mjs";
import {List} from "./List.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {Generate} from "./Generate.mjs";

export const ReportLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd raportów",text:"",user:" "})],
        [Wrapper.withData({class:"wrapper column"}),[
            [Card.withData({title: "Lista wygenerowanych raportów"}),[
                [List]
            ]],
            [Card.withData({title: "Wygeneruj raport"}),[
                [Generate]
            ]
        ]]]
    ]
);