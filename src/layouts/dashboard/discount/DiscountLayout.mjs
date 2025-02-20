import {Wrapper} from "../Wrapper.mjs";
import {Header} from "../Header.mjs";
import {Card} from "../Card.mjs";
import {Discounts} from "./Discounts.mjs";

export const DiscountLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd rabatów",text:"",user:""})],
        [Wrapper.withData({class:"wrapper discount"}),[
                [Card.withData({title: "Kody rabatowe"}),[
                    [Discounts]
                ]],
        ]]
    ]
);