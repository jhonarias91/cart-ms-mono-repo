import {Router} from "express";
import {Login} from "./controller/auth.controller";

export const routes = (router: Router) => {
    // Login
    router.post('/api/auth/login', Login);
}
