import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";

export class StationsRequests {
    #path = `${ApiUrl}/stations`;

    async getAll(params = {}) {
        const queryString = new URLSearchParams(params).toString();
        const url = queryString ? `${this.#path}/get-all?${queryString}` : `${this.#path}/get-all`;

        const request = await new CjsRequest(url, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return [];

        const data = await request.json();

        return data.items || [];
    }


    async getById(stationId) {
        const request = await new CjsRequest(`${this.#path}/${stationId}`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async create(data, image = null) {
        const formData = new FormData();
        formData.append("data", JSON.stringify(data));
        if (image) {
            formData.append("image", image);
        }

        const request = await new CjsRequest(`${this.#path}/create`, "post")
            .setHeaders(getHeaders())
            .setBody(formData)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async update(stationId, data) {
        const request = await new CjsRequest(`${this.#path}/update/${stationId}`, "put")
            .setHeaders(getHeaders())
            .setBody(JSON.stringify(data))
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async delete(stationId) {
        const request = await new CjsRequest(`${this.#path}/delete/${stationId}`, "delete")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }
}
