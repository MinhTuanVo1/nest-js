import {MigrationInterface, QueryRunner} from "typeorm";

export class SecondMigration1658300760233 implements MigrationInterface {
    name = 'SecondMigration1658300760233'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "avatar" character varying NOT NULL DEFAULT 'https://i.pinimg.com/564x/b3/48/ac/b348acfeb9a26afe01022ec26550bda3.jpg'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "avatar"`);
    }

}
