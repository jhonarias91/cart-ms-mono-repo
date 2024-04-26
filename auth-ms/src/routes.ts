import {Router} from "express";
import {Login, Register} from "./controller/auth.controller";
import { HealthCheck } from "./controller/health.controller";

export const routes = (router: Router) => {
    // Login
    router.post('/api/auth/login', Login);
    //Register
    router.post('/api/auth/register', Register);
    router.get('/api/auth/health', HealthCheck)
}
