import {Column, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn} from "typeorm";
import {User} from "./user.entity";
//import {Product} from "./product.entity";
//import {Order} from "./order.entity";

@Entity()
export class Link {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({unique: true})
    code: string;

    @ManyToOne(() => User)
    @JoinColumn({name: 'user_id'})
    user: User;

    /* @ManyToMany(() => Product)
    @JoinTable({
        name: 'link_products',
        joinColumn: {name: 'link_id', referencedColumnName: 'id'},
        inverseJoinColumn: {name: 'product_id', referencedColumnName: 'id'}
    }) 
    products: Product[];*/
  
    //One to many ref: code, (order.link) manage by event bus
    //orders: Order[];
}
