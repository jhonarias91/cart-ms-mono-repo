import {MigrationInterface, QueryRunner} from "typeorm";

export class updateUserAndLink1713412775576 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS user (
                id INT AUTO_INCREMENT PRIMARY KEY,
                first_name VARCHAR(255) NOT NULL,
                last_name VARCHAR(255) NOT NULL,
                email VARCHAR(255) UNIQUE NOT NULL,
                password VARCHAR(255) NOT NULL,
                is_ambassador BOOLEAN NOT NULL DEFAULT false
            );
        `);

        await queryRunner.query(`
            CREATE TABLE IF NOT EXISTS link (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(255) UNIQUE NOT NULL,
                user_id INT,
                CONSTRAINT fk_user
                    FOREIGN KEY (user_id)
                    REFERENCES user(id)
                    ON DELETE SET NULL
            );
        `);

        // add other tables
       
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

        await queryRunner.query('DROP TABLE IF EXISTS link');
 
        await queryRunner.query('DROP TABLE IF EXISTS user');

    
    }

}
