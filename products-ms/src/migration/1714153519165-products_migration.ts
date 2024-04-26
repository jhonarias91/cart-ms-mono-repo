import {MigrationInterface, QueryRunner} from "typeorm";

export class productsMigration1714153519165 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> { // Create Product table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "product" (
                "id" SERIAL PRIMARY KEY,
                "title" VARCHAR NOT NULL,
                "description" VARCHAR NOT NULL,
                "image" VARCHAR NOT NULL,
                "price" NUMERIC NOT NULL
            );`
        );

        // Create Order table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "order" (
                "id" SERIAL PRIMARY KEY,
                "transaction_id" VARCHAR,
                "uid" VARCHAR NOT NULL,
                "code" VARCHAR NOT NULL,
                "ambassador_email" VARCHAR NOT NULL,
                "first_name" VARCHAR NOT NULL,
                "last_name" VARCHAR NOT NULL,
                "email" VARCHAR NOT NULL,
                "address" VARCHAR,
                "country" VARCHAR,
                "city" VARCHAR,
                "zip" VARCHAR,
                "complete" BOOLEAN NOT NULL DEFAULT false,
                "created_at" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
            );`
        );

        // Create OrderItem table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "order_item" (
                "id" SERIAL PRIMARY KEY,
                "product_title" VARCHAR NOT NULL,
                "price" NUMERIC NOT NULL,
                "quantity" INT NOT NULL,
                "ambassador_revenue" NUMERIC NOT NULL,
                "admin_revenue" NUMERIC NOT NULL,
                "order_id" INT NOT NULL,
                "product_id" INT NOT NULL
            );`
        );

        // Create Link table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "link" (
                "id" SERIAL PRIMARY KEY,
                "code" VARCHAR UNIQUE NOT NULL,
                "uid" VARCHAR NOT NULL
            );`
        );

        // Create Link_Products join table
        await queryRunner.query(
            `CREATE TABLE IF NOT EXISTS "link_products" (
                "link_id" INT NOT NULL,
                "product_id" INT NOT NULL,
                PRIMARY KEY ("link_id", "product_id")
            );`
        );

        // Add foreign key constraints
        await queryRunner.query(
            `ALTER TABLE "order" ADD CONSTRAINT fk_link_code FOREIGN KEY ("code") REFERENCES "link" ("code");`
        );

        await queryRunner.query(
            `ALTER TABLE "order_item" ADD CONSTRAINT fk_order_order_id FOREIGN KEY ("order_id") REFERENCES "order" ("id");`
        );

        await queryRunner.query(
            `ALTER TABLE "order_item" ADD CONSTRAINT fk_product_product_id FOREIGN KEY ("product_id") REFERENCES "product" ("id");`
        );

        await queryRunner.query(
            `ALTER TABLE "link_products" ADD CONSTRAINT fk_link_link_id FOREIGN KEY ("link_id") REFERENCES "link" ("id");`
        );

        await queryRunner.query(
            `ALTER TABLE "link_products" ADD CONSTRAINT fk_product_product_id FOREIGN KEY ("product_id") REFERENCES "product" ("id");`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query('DROP TABLE IF EXISTS link_products');    
        await queryRunner.query('DROP TABLE IF EXISTS link');
        await queryRunner.query('DROP TABLE IF EXISTS order_item');
        await queryRunner.query('DROP TABLE IF EXISTS order');
        await queryRunner.query('DROP TABLE IF EXISTS order_item');
    }

}
