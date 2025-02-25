import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";

/**
 * @typedef {Object} PointsThreshold
 * @property {number} id
 * @property {number} points_required
 * @property {number} discount_value
 * @property {string} description
 * @property {string} created_on
 */

export class PointsRequests {
    #path = `${ApiUrl}/points`;

    /**
     * @returns {Promise<PointsThreshold[]>}
     */
    async getAllThresholds() {
        const request = await new CjsRequest(`${this.#path}/thresholds/get-all`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();


        if (request.isError()) return [];
        return request.json();
    }

    /**
     * @returns {Promise<number>}
     */
    async getSelfPoints() {
        const request = await new CjsRequest(`${this.#path}/get/self`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return 0;
        return request.json().points;
    }

    /**
     * @param {number} pointsRequired
     * @param {number} discountValue
     * @param {string} [description]
     * @returns {Promise<PointsThreshold|null>}
     */
    async createThreshold(pointsRequired, discountValue, description = "") {
        const body = { points_required: pointsRequired, discount_value: discountValue, description };
        const request = await new CjsRequest(`${this.#path}/thresholds/create`, "post")
            .setHeaders(getHeaders())
            .setBody(body)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
        return request.json();
    }

    /**
     * @param {number} thresholdId
     * @returns {Promise<{ message: string, discount_code: string, discount_value: number, expiry_on: string, remaining_points: number } | null>}
     */
    async exchangePoints(thresholdId) {
        const body = { threshold_id: thresholdId };
        const request = await new CjsRequest(`${this.#path}/exchange`, "post")
            .setHeaders(getHeaders())
            .setBody(body)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
        return request.json();
    }
}
