export const setAutherUser = (data) => {
    localStorage.setItem("user", JSON.stringify(data));
};

export const getAutherUser = (data) => {
    if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
    }
};

export const removeAutherUser = () => {
    if (localStorage.getItem("user")) localStorage.removeItem("user");
};