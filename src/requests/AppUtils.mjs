export const getHeaders = () => {
    return {
        "Authorization": `Bearer ${localStorage.getItem("token")}`
    }
}