import api from "./api";

export const registerCustomer = (data) =>
    api.post("/customers/register", data);

export const loginCustomer = (data) =>
    api.post("/customers/login", data);

export const getCustomerProfile = () =>
    api.get("/customers/profile", {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token"),
        },
    });