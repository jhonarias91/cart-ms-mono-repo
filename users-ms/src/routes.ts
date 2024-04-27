import {Router} from "express";

import {AuthMiddleware} from "./middleware/auth.middleware";
import {Ambassadors} from "./controller/user.controller";
import {HealthCheck, getSystemInfo} from "./controller/health.controller";
import { UpdateCreate,AuthenticatedUser} from "./controller/user.controller";

export const routes = (router: Router) => {
    // Admin
    //router.post('/api/admin/register', Register);
    router.get('/api/admin/ambassadors', AuthMiddleware, Ambassadors);
    // Ambassador
    
    //health
    router.get('/api/users/health', HealthCheck);
    router.get('/api/users/systeminfo', getSystemInfo);
    //Users
    router.post('/api/users/updatecreate', UpdateCreate);
    router.get('/api/users/user', AuthenticatedUser);

}
