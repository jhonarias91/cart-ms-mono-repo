import {Router} from "express";
import {Login, Logout, Register} from "./controller/auth.controller";
import { HealthCheck } from "./controller/health.controller";

export const routes = (router: Router) => {
    // Login
    router.post('/api/auth/login', Login);
    //Register
    router.post('/api/auth/register', Register);
    router.get('/api/auth/health', HealthCheck)
    router.post('/api/auth/logout', Logout);
}
