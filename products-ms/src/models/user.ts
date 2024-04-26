
export class User {
    
    uid: string;

    first_name: string;
   
    last_name: string;
  
    email: string;

    provider: string;
   
    is_ambassador: boolean;

    get name(): string {
        return this.first_name + ' ' + this.last_name;
    }
}
