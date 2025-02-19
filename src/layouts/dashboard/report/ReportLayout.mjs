import {Wrapper} from "./Wrapper.mjs";
import {Header} from "../stats/Header.mjs";
import {Card} from "../Card.mjs";
import {Reports} from "./Reports.mjs";

export const ReportLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd raportów",text:"ss ",user:" "})],
        [Wrapper.withData({class:"wrapper report"}),[
            [Card.withData({title: "Lista wygenerowanych raportów"}),[
                [Reports]
            ]],
        ]]
    ]
);