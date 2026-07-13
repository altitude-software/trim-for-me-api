import { MigrationInterface, QueryRunner } from "typeorm";

export class JobOfferRestructure1783965628694 implements MigrationInterface {
    name = 'JobOfferRestructure1783965628694'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_a07e3f582439278d88cf48de70d"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_d1030a2a233119100773064e9ee"`);
        await queryRunner.query(`CREATE TABLE "MATERIAL_TYPE" ("id" uuid NOT NULL, "name" character varying NOT NULL, CONSTRAINT "PK_0f3363cb1b665793d568dad997b" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "REL_a07e3f582439278d88cf48de70"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "video_format_id"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "REL_d1030a2a233119100773064e9e"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "edit_level_id"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD "duration" integer`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD "quantity" integer`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "name" character varying NOT NULL`);
        await queryRunner.query(`CREATE TYPE "public"."JOB_OFFER_orientation_enum" AS ENUM('vertical', 'horizontal')`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "orientation" "public"."JOB_OFFER_orientation_enum" NOT NULL DEFAULT 'horizontal'`);
        await queryRunner.query(`CREATE TYPE "public"."JOB_OFFER_length_enum" AS ENUM('short', 'long')`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "length" "public"."JOB_OFFER_length_enum" NOT NULL DEFAULT 'long'`);
        await queryRunner.query(`CREATE TYPE "public"."JOB_OFFER_level_enum" AS ENUM('basic', 'intermediate', 'advanced')`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "level" "public"."JOB_OFFER_level_enum" NOT NULL DEFAULT 'intermediate'`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD "type" uuid`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD CONSTRAINT "CHK_3c0ac79453f2eb5aeb60eb070c" CHECK ("quantity" >= 0)`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD CONSTRAINT "FK_34ae71e8f852f795322b2bf6bc1" FOREIGN KEY ("type") REFERENCES "MATERIAL_TYPE"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);

        await queryRunner.query(`DROP TABLE "VIDEO_FORMAT"`);
        await queryRunner.query(`DROP TYPE "public"."VIDEO_FORMAT_length_enum"`);
        await queryRunner.query(`DROP TYPE "public"."VIDEO_FORMAT_orientation_enum"`);
        await queryRunner.query(`DROP TABLE "EDIT_LEVEL"`);
        await queryRunner.query(`DROP TYPE "public"."EDIT_LEVEL_level_enum"`);

        await queryRunner.query(`INSERT INTO "MATERIAL_TYPE" ("id", "name") VALUES
            (gen_random_uuid(), 'brute-video'),
            (gen_random_uuid(), 'script'),
            (gen_random_uuid(), 'audio'),
            (gen_random_uuid(), 'image'),
            (gen_random_uuid(), 'other')`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."EDIT_LEVEL_level_enum" AS ENUM('basic', 'intermediate', 'advanced')`);
        await queryRunner.query(`CREATE TABLE "EDIT_LEVEL" ("id" uuid NOT NULL, "level" "public"."EDIT_LEVEL_level_enum" NOT NULL, CONSTRAINT "PK_448e7a6946161187040dab592b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."VIDEO_FORMAT_orientation_enum" AS ENUM('vertical', 'horizontal')`);
        await queryRunner.query(`CREATE TYPE "public"."VIDEO_FORMAT_length_enum" AS ENUM('short', 'long')`);
        await queryRunner.query(`CREATE TABLE "VIDEO_FORMAT" ("id" uuid NOT NULL, "orientation" "public"."VIDEO_FORMAT_orientation_enum" NOT NULL, "length" "public"."VIDEO_FORMAT_length_enum" NOT NULL, "technical_format" character varying, CONSTRAINT "PK_a5881982fff39af5136577430e9" PRIMARY KEY ("id"))`);

        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP CONSTRAINT "FK_34ae71e8f852f795322b2bf6bc1"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP CONSTRAINT "CHK_3c0ac79453f2eb5aeb60eb070c"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP COLUMN "type"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD "type" character varying NOT NULL`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "level"`);
        await queryRunner.query(`DROP TYPE "public"."JOB_OFFER_level_enum"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "length"`);
        await queryRunner.query(`DROP TYPE "public"."JOB_OFFER_length_enum"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "orientation"`);
        await queryRunner.query(`DROP TYPE "public"."JOB_OFFER_orientation_enum"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP COLUMN "name"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP COLUMN "quantity"`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP COLUMN "duration"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "edit_level_id" uuid`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "REL_d1030a2a233119100773064e9e" UNIQUE ("edit_level_id")`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD "video_format_id" uuid`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "REL_a07e3f582439278d88cf48de70" UNIQUE ("video_format_id")`);
        await queryRunner.query(`DROP TABLE "MATERIAL_TYPE"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_d1030a2a233119100773064e9ee" FOREIGN KEY ("edit_level_id") REFERENCES "EDIT_LEVEL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_a07e3f582439278d88cf48de70d" FOREIGN KEY ("video_format_id") REFERENCES "VIDEO_FORMAT"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
