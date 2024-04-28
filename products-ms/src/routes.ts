import {Router} from "express";
import {AuthMiddleware} from "./middleware/auth.middleware";
import {
    CreateProduct,
    DeleteProduct,
    GetProduct,
    Products, ProductsBackend,
    ProductsFrontend,
    UpdateProduct
} from "./controller/product.controller";
import {CreateLink, GetLink, Links, Stats} from "./controller/link.controller";
import {ConfirmOrder, CreateOrder, Orders, Rankings} from "./controller/order.controller";
import { HealthCheck } from "./controller/health.controller";


export const routes = (router: Router) => {

    router.get('/api/products/health',HealthCheck);
    // Admin
    /*
    router.post('/api/admin/register', Register);
    router.post('/api/admin/login', Login);
    router.get('/api/admin/user', AuthMiddleware, AuthenticatedUser);
    router.post('/api/admin/logout', AuthMiddleware, Logout);
    router.put('/api/admin/users/info', AuthMiddleware, UpdateInfo);
    router.put('/api/admin/users/password', AuthMiddleware, UpdatePassword);
    router.get('/api/admin/ambassadors', AuthMiddleware, Ambassadors);
    */
    router.get('/api/admin/products', AuthMiddleware, Products);
    router.post('/api/admin/products', AuthMiddleware, CreateProduct);
    router.get('/api/admin/products/:id', AuthMiddleware, GetProduct);
    router.put('/api/admin/products/:id', AuthMiddleware, UpdateProduct);
    router.delete('/api/admin/products/:id', AuthMiddleware, DeleteProduct);
    router.get('/api/admin/users/:id/links', AuthMiddleware, Links);
    router.get('/api/admin/orders', AuthMiddleware, Orders);

    // Ambassador
    router.get('/api/products/frontend', ProductsFrontend);
    router.get('/api/products/backend', ProductsBackend);
    //router.post('/api/products/links', AuthMiddleware, CreateLink);
    //router.get('/api/products/stats', AuthMiddleware, Stats);
    //router.get('/api/products/rankings', AuthMiddleware, Rankings);

    router.post('/api/products/links', AuthMiddleware, CreateLink);
    router.get('/api/products/stats',  Stats);
    router.get('/api/products/rankings', Rankings);

    // Checkout
    router.get('/api/products/checkout/links/:code', GetLink);
    router.post('/api/products/checkout/orders', CreateOrder);
    router.post('/api/products/checkout/orders/confirm', ConfirmOrder);
}
