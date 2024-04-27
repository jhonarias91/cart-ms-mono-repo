import axios from "axios";
import dotenv from 'dotenv';

dotenv.config();

//User-ms
const usersMsBase = process.env.REACT_APP_USERS_MS_BASE_URL;
export const axiosUsersApi = axios.create({
    baseURL: `${usersMsBase}/api/users/`,
    withCredentials: true //enabled send cookies and auth
})

//Products-ms
const productsMsBase = process.env.REACT_APP_PRODUCTS_MS_BASE_RUL;
export const axiosProductsApi = axios.create({
    baseURL: `${productsMsBase}/api/products/`,
    withCredentials: true
})

//Auth-ms
const authMsBase =  process.env.REACT_APP_AUTH_MS_BASE_URL;
export const axiosAuthApi = axios.create({
    baseURL: `${authMsBase}/api/auth/`,
    withCredentials: true
})