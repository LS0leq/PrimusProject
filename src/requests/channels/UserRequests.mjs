import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";
import {AppCache} from "../AppCache.mjs";

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} phone_number
 * @property {number} registered_on
 * @property {string} address_line1
 * @property {string} city
 * @property {string} postal_code
 * @property {string} country
 * @property {string} date_of_birth
 * @property {string} gender
 * @property {boolean} two_factor_enabled
 * @property {string} status
 * @property {number} balance
 * @property {string} role
 */

export class UserRequests {
    #path = `${ApiUrl}/users`;

    /**
     * @param {string} email
     * @param {string} password
     * @returns {Promise<boolean>}
     */
    async auth(email, password) {
        const request = await new CjsRequest(`${this.#path}/auth`, "post")
            .setBody({ email, password })
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();



        if (request.isError()) return false;

        localStorage.setItem("token", request.json().token);

        return true;
    }

    /**
     * @param {Object} userData
     * @returns {Promise<User|null>}
     */
    async createUser(userData) {
        const request = await new CjsRequest(`${this.#path}/create`, "post")
            .setBody(userData)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
        return request.json();
    }

    /**
     * @param {number} userId
     * @param {Object} updateData
     * @returns {Promise<{message: string, changes: Object} | null>}
     */
    async updateUser(userId, updateData) {
        const request = await new CjsRequest(`${this.#path}/update/${userId}`, "put")
            .setHeaders(getHeaders())
            .setBody(updateData)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
        return request.json();
    }

    /**
     * @returns {User|null}
     */
    syncSelf() {
        return AppCache.get("user");
    }

    /**
     * @returns {User[]|null}
     */
    syncUsers() {
        return AppCache.get("users") || [];
    }

    /**
     * @returns {Promise<User[]|null>}
     */
    async getUsers() {
        const request = await new CjsRequest(`${this.#path}/get-all`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        AppCache.set("users", request.json());

        return request.json();
    }


    /**
     * @returns {Promise<User|null>}
     */
    async self() {
        const request = await new CjsRequest(`${this.#path}/self`, "get")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;

        AppCache.set("user", request.json());

        return request.json();
    }

    /**
     * @param {Object} updateData
     * @returns {Promise<{message: string, changes: Object} | null>}
     */
    async updateSelf(updateData) {
        const request = await new CjsRequest(`${this.#path}/update/self`, "put")
            .setHeaders(getHeaders())
            .setBody(updateData)
            .onError(r => CjsNotification.error(r.json().error))
            .onSuccess(_ => CjsNotification.success("Zaktualizowano dane"))
            .doRequest();

        if (request.isError()) return null;

        AppCache.set("user", request.json());

        return request.json();
    }

    /**
     * @param {number} userId
     * @returns {Promise<{message: string} | null>}
     */
    async deleteUser(userId) {
        const request = await new CjsRequest(`${this.#path}/delete/${userId}`, "delete")
            .setHeaders(getHeaders())
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
        return request.json();
    }
    /**
     * @returns {Promise<boolean>}
     */
    async validateToken() {
        const request = await new CjsRequest(this.#path + "/validate-token", "GET")
            .setHeaders(getHeaders())
            .doRequest()

        if(request.isError()) return false;

        return request.json().valid;
    }

}

