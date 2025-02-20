import {Card} from "../Card.mjs";
import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {FAQList} from "./FAQList.mjs";
import {Form} from "./Form.mjs";
import {QuestionList} from "./QuestionList.mjs";


export const MessageLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd użytkowników",text:"",user:" "})],
        [Wrapper.withData({class:"wrapper column"}),[
            [Card.withData({title: "Lista FAQ"}),[
                [FAQList]
            ]],
            [Card.withData({ title: "Tworzenie nowego pytania" }), [
                [Form]
            ]],
            [Card.withData({ title: "Lista pytań" }), [
                [QuestionList]
            ]
            ]]]
    ]
);