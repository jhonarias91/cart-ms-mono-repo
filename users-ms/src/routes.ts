import {Router} from "express";

import {AuthMiddleware} from "./middleware/auth.middleware";
import {Ambassadors, Rankings} from "./controller/user.controller";
import {HealthCheck} from "./controller/health.controller";
import { UpdateCreate,AuthenticatedUser,Logout} from "./controller/user.controller";

export const routes = (router: Router) => {
    // Admin
    //router.post('/api/admin/register', Register);
    
    router.get('/api/admin/ambassadors', AuthMiddleware, Ambassadors);

    // Ambassador
    
    router.get('/api/ambassador/rankings', AuthMiddleware, Rankings);

    //Checkout
    router.get('/api/users/healthcheck', HealthCheck);
    //Users
    router.post('/api/users/updatecreate', UpdateCreate);
    router.get('/api/users/user', AuthenticatedUser);
    router.post('/api/users/logout', Logout);

}
