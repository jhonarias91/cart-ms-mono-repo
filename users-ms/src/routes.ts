import {Router} from "express";
import {AuthenticatedUser, Login, Logout, Register, UpdateInfo, UpdatePassword} from "./controller/auth.controller";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {Ambassadors, Rankings} from "./controller/user.controller";
import {HealthCheck} from "./controller/health.controller";

import {CreateLink, GetLink, Links, Stats} from "./controller/link.controller";


export const routes = (router: Router) => {
    // Admin
    router.post('/api/admin/register', Register);
    router.post('/api/admin/login', Login);
    router.get('/api/admin/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/admin/logout', AuthMiddleware, Logout);
    router.put('/api/admin/users/info', AuthMiddleware, UpdateInfo);
    router.put('/api/admin/users/password', AuthMiddleware, UpdatePassword);
    router.get('/api/admin/ambassadors', AuthMiddleware, Ambassadors);
    router.get('/api/admin/users/:id/links', AuthMiddleware, Links);

    // Ambassador
    router.post('/api/ambassador/register', Register);
    router.post('/api/users/login', Login);
    router.get('/api/ambassador/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/ambassador/logout', AuthMiddleware, Logout);
    router.put('/api/ambassador/users/info', AuthMiddleware, UpdateInfo);
    router.put('/api/ambassador/users/password', AuthMiddleware, UpdatePassword);

    router.post('/api/ambassador/links', AuthMiddleware, CreateLink);
    router.get('/api/ambassador/stats', AuthMiddleware, Stats);
    router.get('/api/ambassador/rankings', AuthMiddleware, Rankings);

    // Checkout
    router.get('/api/checkout/links/:code', GetLink);

    //Checkout
    router.get('/api/ambassador/healthcheck', HealthCheck);
}
