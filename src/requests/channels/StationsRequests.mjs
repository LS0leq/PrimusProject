import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";

export class StationsRequests {
    #path = `${ApiUrl}/stations`;

    async getAll(params = {}) {
        const request = await new CjsRequest(`${this.#path}/get-all`, "get")
            .setHeaders(getHeaders())
            .setQueryParams(params)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return [];

        return request.json();
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
        const request = await new CjsRequest(`${this.#path}/update/${stationId}/update`, "put")
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

    async addOrUpdateImage(stationId, image) {
        const formData = new FormData();
        formData.append("image", image);

        const request = await new CjsRequest(`${this.#path}/image/${stationId}`, "post")
            .setHeaders(getHeaders())
            .setBody(formData)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.json();
    }

    async getImage(stationId) {
        const request = await new CjsRequest(`${this.#path}/image/${stationId}`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        return request.blob();
    }
}
