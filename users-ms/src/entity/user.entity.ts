import {Column, Entity, PrimaryColumn} from "typeorm";

@Entity()
export class User {
    
    @PrimaryColumn()
    uid: string;

    @Column()
    first_name: string;

    @Column({
        nullable:true
     })
    last_name: string;

    @Column({
        unique: true
    })
    email: string;

   

    @Column()
    provider: string;
   
    @Column()
    is_ambassador: boolean;

    get name(): string {
        return this.first_name + ' ' + this.last_name;
    }
}
