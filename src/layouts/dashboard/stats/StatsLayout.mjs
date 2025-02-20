import {Header} from "../Header.mjs";
import {Wrapper} from "../Wrapper.mjs";
import {RecentTransactions} from "./RecentTransactions.mjs";
import {Ballance} from "./Ballance.mjs";
import {Income} from "./Income.mjs";
import {Card} from "../Card.mjs";
import {Column} from "./Column.mjs";
import {GenerateRaport} from "./GenerateRaport.mjs";
import {Tracker} from "./Tracker.mjs";

export const StatsLayout = new CjsLayout(
[
        [Header.withData({title: "Przegląd danych", text: "Witaj ponownie, ", user: "Admin"})],
        [Wrapper.withData({class:"wrapper stats"}),[
            [Column,[
                [Card.withData({title: "Bilans"}),[
                    [Ballance]
                ]],
                [Card.withData({ title: "Ostatnie transakcje" }), [
                    [RecentTransactions]
                ]],
                [Card.withData({ title: "Ilość ładowań dzisiaj" }), [
                    [Tracker]
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