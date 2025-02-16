import {Wrapper} from "./Wrapper.mjs";
import {RecentTransactions} from "./RecentTransactions.mjs";
import {Ballance} from "./Ballance.mjs";
import {Income} from "./Income.mjs";
import {Card} from "../Card.mjs";
import {Header} from "./Header.mjs";

export const StatsLayout = new CjsLayout(
[
        [Header.withData({title: "Przegląd danych"})],
        [Wrapper,[
            [Card.withData({title: "Bilans"}),[
                [Ballance]
            ]],
            [Card.withData({ title: "Ostatnie transakcje" }), [
                [RecentTransactions]
            ]],
            [Card.withData({ title: "Przychody" }), [
                [Income]
            ]]
        ]]
    ]
);