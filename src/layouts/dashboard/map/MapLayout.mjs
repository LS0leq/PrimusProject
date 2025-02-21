import {Wrapper} from "../Wrapper.mjs";
import {Header} from "../Header.mjs";
import {Card} from "../Card.mjs";
import {Map} from "./Map.mjs";

export const MapLayout = new CjsLayout(
    [
        [Header.withData({title: "Przegląd mapy",text:"",user:""})],
        [Wrapper.withData({class:"wrapper discount"}),[
            [Card.withData({title: "Mapa"}),[
                [Map]
            ]],
        ]]
    ]
);