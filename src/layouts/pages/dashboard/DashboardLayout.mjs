import {Wrapper} from "./Wrapper.mjs";
import {SideNav} from "./SideNav.mjs";
import {Content} from "./Content.mjs";
import {StatsLayout} from "../../dashboard/stats/StatsLayout.mjs";
import {UsersLayout} from "../../dashboard/users/UsersLayout.mjs";
import {ReportLayout} from "../../dashboard/report/ReportLayout.mjs";
import {DiscountLayout} from "../../dashboard/discount/DiscountLayout.mjs";
import {MapLayout} from "../../dashboard/map/MapLayout.mjs";

export const DashboardLayout = new CjsLayout(
    [
        [Wrapper,[
            [SideNav],
            [Content]
        ]]
    ]
);

const Layouts = {
    "stats": StatsLayout,
    "users": UsersLayout,
    "report": ReportLayout,
    "discount": DiscountLayout,
    "map":MapLayout
}

DashboardLayout.loadContent = (category) => {
    if(!(category in Layouts)) return;

    Content.loadLayout(Layouts[category]);
}