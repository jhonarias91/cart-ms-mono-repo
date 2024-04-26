import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserAndLink1713412775576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user (
                uid VARCHAR(255) KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NULL,
                email VARCHAR(255) UNIQUE NOT NULL,                                
                is_ambassador BOOLEAN NOT NULL DEFAULT false,
                provider VARCHAR(255) NULL
            );
        `);
        // add other tables
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
 
        await queryRunner.query('DROP TABLE IF EXISTS user');
    
    }

}
