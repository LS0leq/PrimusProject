import {Wrapper} from "./Wrapper.mjs";
import {RecentTransactions} from "./RecentTransactions.mjs";
import {Ballance} from "./Ballance.mjs";

export const StatsLayout = new CjsLayout(
    [
        [Wrapper,[
            [Ballance],
            [RecentTransactions],
        ]]
        
    ]
);