import {Request, Response} from "express";
import {getRepository} from "typeorm";
import {Product} from "../entity/product.entity";
import {client} from "../index";

export const Products = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).find());
}

export const CreateProduct = async (req: Request, res: Response) => {
    res.status(201).send(await getRepository(Product).save(req.body));
}

export const GetProduct = async (req: Request, res: Response) => {
    res.send(await getRepository(Product).findOne(req.params.id));
}

export const UpdateProduct = async (req: Request, res: Response) => {
    const repository = getRepository(Product);

    await repository.update(req.params.id, req.body);

    res.status(202).send(await repository.findOne(req.params.id));
}

export const DeleteProduct = async (req: Request, res: Response) => {
    await getRepository(Product).delete(req.params.id);

    res.status(204).send(null);
}

export const ProductsFrontend = async (req: Request, res: Response) => {
    let products = JSON.parse(await client.get('products_frontend'));

    if (!products) {
        products = await getRepository(Product).find();

        await client.set('products_frontend', JSON.stringify(products), {
            EX: 1800 //30 min
        });
    }

    res.send(products);
}

export const ProductsBackend = async (req: Request, res: Response) => {
    let products: Product[] = JSON.parse(await client.get('products_frontend'));

    if (!products) {
        products = await getRepository(Product).find();

        await client.set('products_frontend', JSON.stringify(products), {
            EX: 1800 //30 min
        });
    }

    /*
    a mi si me afecto la decisión de no decidir como los equipos.

        Bueno primero de todo el contenido que se ve que es de mucha calidad, no
        //me lo llevo todo y quien sabe si llevo a un 30-40%,
         pero si queda mucha curiosidad en seguir investigando y aplicando siempre que pueda.

         Por otro lado, no tuve la oportunidad de tener discusiones 
         de arquetctura con otro compañero, que me refuctara o me diera otra visión,
         entonces eso puede pesar.  Y ps si los compañeros tuvieron que trabajar yo 
         tuve que hacerlo el doble. 

         Me llevo una sensación de que quise hacer más en el monolito, pero no me dio.

         Profe solo 2 cosas negativas una es el tema de la puntualidad y e feeback por ejemplo
         de los diagramas si me quedo faltando,  y espero que no se acuerde
         de esto mañana, eso es todo muchas gracias profe. depronto si falto desde el pricipio acotar
         y dejar que se esperaba puntualmente en la entrega.
    */
    //

    if (req.query.s) {
        const s = req.query.s.toString().toLowerCase();

        products = products.filter(p => p.title.toLowerCase().indexOf(s) >= 0 || p.description.toLowerCase().indexOf(s) >= 0);
    }

    if (req.query.sort === 'asc' || req.query.sort === 'desc') {
        products.sort((a, b) => {
            const diff = a.price - b.price;

            if (diff === 0) return 0;

            const sign = Math.abs(diff) / diff; // -1, 1

            return req.query.sort === 'asc' ? sign : -sign;
        });
    }

    const page: number = parseInt(req.query.page as any) || 1;
    const perPage = 9;
    const total = products.length;

    const data = products.slice((page - 1) * perPage, page * perPage);

    res.send({
        data,
        meta: {
            total,
            page,
            last_page: Math.ceil(total / perPage)
        }
    });
}
