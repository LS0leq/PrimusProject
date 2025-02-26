const FORMAT_PREFIX = `cached-`

function formatKey(key) { return `${FORMAT_PREFIX}${key}`; }

export const AppCache = {
    /**
     * @param {string} key
     * @returns {null|object}
     */
    get(key) {
        if(localStorage.getItem(formatKey(key)) === null) return null;

        const value = JSON.parse(localStorage.getItem(formatKey(key)));
        const { data, expiryTimestamp } = value;

        if(new Date().getTime() > expiryTimestamp) return null;

        return data;
    },
    /**
     * @param {string} key
     * @param {object} data
     * @param {number} expiryHours
     */
    set(key, data, expiryHours = 1) {
        const expiryTimestamp = new Date().getTime() + (1000 * 60 * 60 * expiryHours);

        localStorage.setItem(formatKey(key), JSON.stringify({ data, expiryTimestamp }));
    },
    clear() {
        for (let i = 0; i < localStorage.length; i++){
            const key = localStorage.key(i);

            if(!key.startsWith(FORMAT_PREFIX)) continue;

            localStorage.removeItem(key);
        }
    }
}