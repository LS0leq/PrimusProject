import {Wrapper} from "./Wrapper.mjs";
import {RecentTransactions} from "./RecentTransactions.mjs";
import {Ballance} from "./Ballance.mjs";
import {Income} from "./Income.mjs";
import {Card} from "../Card.mjs";
import {Header} from "./Header.mjs";
import {Column} from "./Column.mjs";
import {GenerateRaport} from "./GenerateRaport.mjs";

export const StatsLayout = new CjsLayout(
[
        [Header.withData({title: "Przegląd danych"})],
        [Wrapper, [
            [Column,[
                [Card.withData({title: "Bilans"}),[
                    [Ballance]
                ]],
                [Card.withData({ title: "Ostatnie transakcje" }), [
                    [RecentTransactions]
                ]],
            ]],
            [Column, [
                [Card.withData({ title: "Godziny szczytu" }), [
                    [Income]
                ]],
                [Card.withData({ title: "Wygeneruj raport" }), [
                    [GenerateRaport]
                ]],
            ]]
        ]]
    ]
);