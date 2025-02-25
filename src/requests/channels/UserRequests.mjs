import { ApiUrl } from "../../Constants.mjs";
import { getHeaders } from "../AppUtils.mjs";

/**
 * @typedef {Object} User
 * @property {number} id
 * @property {string} first_name
 * @property {string} last_name
 * @property {string} email
 * @property {string} role
 * @property {string} [token]
 * @property {string} [refresh_token]
 * @property {number} [expires_in]
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
     * @param {Object} updateData
     * @returns {Promise<{message: string, changes: Object} | null>}
     */
    async updateSelf(updateData) {
        const request = await new CjsRequest(`${this.#path}/update/self`, "put")
            .setHeaders(getHeaders())
            .setBody(updateData)
            .onError(r => CjsNotification.error(r.json().error))
            .doRequest();

        if (request.isError()) return null;
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
}
