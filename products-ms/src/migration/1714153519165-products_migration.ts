import {MigrationInterface, QueryRunner} from "typeorm";

export class productsMigration1714153519165 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { // Create Product table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS product (
                id INT AUTO_INCREMENT PRIMARY KEY,
                title VARCHAR(255) NOT NULL,
                description VARCHAR(255) NOT NULL,
                image VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            );
            `
        );

       // Create Order table
      // Create Order table
    await queryRunner.query(
        `CREATE TABLE IF NOT EXISTS \`order\` (
            id INT AUTO_INCREMENT PRIMARY KEY,
            transaction_id VARCHAR(255),
            uid VARCHAR(255) NOT NULL,
            code VARCHAR(255) NOT NULL,
            ambassador_email VARCHAR(255) NOT NULL,
            first_name VARCHAR(255) NOT NULL,
            last_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            address VARCHAR(255),
            country VARCHAR(255),
            city VARCHAR(255),
            zip VARCHAR(255),
            complete BOOLEAN NOT NULL DEFAULT false,
            created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
        );`
    );


        // Create OrderItem table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS order_item (
                id INT AUTO_INCREMENT PRIMARY KEY,
                product_title VARCHAR(255) NOT NULL,
                price DECIMAL(10, 2) NOT NULL,
                quantity INT NOT NULL,
                ambassador_revenue DECIMAL(10, 2) NOT NULL,
                admin_revenue DECIMAL(10, 2) NOT NULL,
                order_id INT NOT NULL,
                product_id INT NOT NULL
            );`
        );

        // Create Link table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS link (
                id INT AUTO_INCREMENT PRIMARY KEY,
                code VARCHAR(255) UNIQUE NOT NULL,
                uid VARCHAR(255) NOT NULL
            );`
        );

        // Create Link_Products join table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS link_products (
                link_id INT NOT NULL,
                product_id INT NOT NULL,
                PRIMARY KEY (link_id, product_id)
            );`
        );

        /*
        // Add foreign key constraints
        await queryRunner.query(
            `ALTER TABLE \`order\` ADD CONSTRAINT fk_link_code FOREIGN KEY (code) REFERENCES link (code);`
        );

        await queryRunner.query(
            `ALTER TABLE order_item ADD CONSTRAINT fk_order_order_id FOREIGN KEY (order_id) REFERENCES \`order\` (id);`
        );

        await queryRunner.query(
            `ALTER TABLE order_item ADD CONSTRAINT fk_product_product_id_order FOREIGN KEY (product_id) REFERENCES product (id);`
        );

        await queryRunner.query(
            `ALTER TABLE link_products ADD CONSTRAINT fk_link_link_id FOREIGN KEY (link_id) REFERENCES link (id);`
        );

        await queryRunner.query(
            `ALTER TABLE link_products ADD CONSTRAINT fk_product_product_id FOREIGN KEY (product_id) REFERENCES product (id);`
        );*/

    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS link_products');    
        await queryRunner.query('DROP TABLE IF EXISTS link');
        await queryRunner.query('DROP TABLE IF EXISTS order_item');
        await queryRunner.query('DROP TABLE IF EXISTS \`order\`');
        await queryRunner.query('DROP TABLE IF EXISTS order_item');
    }

}
