import { MigrationInterface, QueryRunner } from "typeorm";

export class AddMaterialDurationCheck1783966310330 implements MigrationInterface {
    name = 'AddMaterialDurationCheck1783966310330'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD CONSTRAINT "CHK_493253fa1cec57a9e0ec4f603e" CHECK ("duration" >= 0)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP CONSTRAINT "CHK_493253fa1cec57a9e0ec4f603e"`);
    }

}
