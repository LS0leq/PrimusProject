import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";

export class DiscountsRequests {
    #path = `${ApiUrl}/discounts`;

    async getAll() {
        const request = await new CjsRequest(`${this.#path}/get-all`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return [];

        return request.json();
    }

    async getById(discountId) {
        const request = await new CjsRequest(`${this.#path}/${discountId}`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async create(data) {
        const request = await new CjsRequest(`${this.#path}/create`, "post")
            .setHeaders(getHeaders())
            .setBody(JSON.stringify(data))
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async apply(data) {
        const request = await new CjsRequest(`${this.#path}/apply`, "post")
            .setHeaders(getHeaders())
            .setBody(JSON.stringify(data))
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async delete(discountId) {
        const request = await new CjsRequest(`${this.#path}/${discountId}`, "delete")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

}
