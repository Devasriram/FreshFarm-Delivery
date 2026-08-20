import api from "./api";

export const registerCustomer = (data) =>
    api.post("/customers/register", data);

export const loginCustomer = (data) =>
    api.post("/customers/login", data);

export const sendCustomerOtp = (mobile_number) =>
    api.post("/customers/send-otp", { mobile_number });

export const verifyCustomerOtp = (mobile_number, otp) =>
    api.post("/customers/verify-otp", { mobile_number, otp });

export const getCustomerProfile = () =>
    api.get("/customers/profile", {
        headers: {
            Authorization:
                "Bearer " + localStorage.getItem("token"),
        },
    });