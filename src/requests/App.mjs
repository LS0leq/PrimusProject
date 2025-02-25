import {UserRequests} from "./channels/UserRequests.mjs";
import {StationsRequests} from "./channels/StationsRequests.mjs";
import {PointsRequests} from "./channels/PointsRequests.mjs";

export const App = {
    users: new UserRequests(),
    stations: new StationsRequests(),
    points: new PointsRequests()
}
