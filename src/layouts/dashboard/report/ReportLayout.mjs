import {Card} from "../Card.mjs";
import {Reports} from "./Reports.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {GenerateRaport} from "./GenerateRaport.mjs";

export const ReportLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd raportów",text:"",user:" "})],
        [Wrapper.withData({class:"wrapper column"}),[
            [Card.withData({title: "Lista wygenerowanych raportów"}),[
                [Reports]
            ]],
            [Card.withData({title: "Wygeneruj raport"}),[
                [GenerateRaport]
            ]
        ]]]
    ]
);