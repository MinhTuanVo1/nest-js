import { MigrationInterface, QueryRunner } from 'typeorm';

export class BaseMigration1658296906247 implements MigrationInterface {
  name = 'BaseMigration1658296906247';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "name" text NOT NULL, "username" character varying NOT NULL, "email" character varying NOT NULL, "birthday" date NOT NULL, "role" character varying NOT NULL, "isBlocked" boolean NOT NULL DEFAULT false, "password" character varying NOT NULL, CONSTRAINT "username" UNIQUE ("username"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "users"`);
  }
}
