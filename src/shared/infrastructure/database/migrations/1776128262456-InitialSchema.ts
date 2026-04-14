import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1776128262456 implements MigrationInterface {
    name = 'InitialSchema1776128262456'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."USER_role_enum" AS ENUM('creator', 'editor')`);
        await queryRunner.query(`CREATE TABLE "USER" ("id" uuid NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."USER_role_enum" NOT NULL, "name" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_c090db0477be7a25259805e37c2" UNIQUE ("email"), CONSTRAINT "PK_480564dbef3c7391661ce3b9d5c" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."VIDEO_FORMAT_orientation_enum" AS ENUM('vertical', 'horizontal')`);
        await queryRunner.query(`CREATE TYPE "public"."VIDEO_FORMAT_length_enum" AS ENUM('short', 'long')`);
        await queryRunner.query(`CREATE TABLE "VIDEO_FORMAT" ("id" uuid NOT NULL, "orientation" "public"."VIDEO_FORMAT_orientation_enum" NOT NULL, "length" "public"."VIDEO_FORMAT_length_enum" NOT NULL, "technical_format" character varying, CONSTRAINT "PK_a5881982fff39af5136577430e9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."EDIT_LEVEL_level_enum" AS ENUM('basic', 'intermediate', 'advanced')`);
        await queryRunner.query(`CREATE TABLE "EDIT_LEVEL" ("id" uuid NOT NULL, "level" "public"."EDIT_LEVEL_level_enum" NOT NULL, CONSTRAINT "PK_448e7a6946161187040dab592b7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."COMPENSATION_type_enum" AS ENUM('negotiable', 'per_minute', 'per_video')`);
        await queryRunner.query(`CREATE TABLE "COMPENSATION" ("id" uuid NOT NULL, "type" "public"."COMPENSATION_type_enum" NOT NULL, "duration_in_minutes" integer, "amount" numeric, "currency" character varying, CONSTRAINT "PK_18c184a3204f208cadffc09ab12" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "JOB_OFFER" ("id" uuid NOT NULL, "creator_id" uuid NOT NULL, "description" character varying, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "video_format_id" uuid, "edit_level_id" uuid, "compensation_id" uuid, CONSTRAINT "REL_a07e3f582439278d88cf48de70" UNIQUE ("video_format_id"), CONSTRAINT "REL_d1030a2a233119100773064e9e" UNIQUE ("edit_level_id"), CONSTRAINT "REL_5a6411cee8f549d19087ececfc" UNIQUE ("compensation_id"), CONSTRAINT "PK_013d334cc87be0f797b33e602c5" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "MATERIAL" ("id" uuid NOT NULL, "url" character varying NOT NULL, "type" character varying NOT NULL, "description" character varying, "job_offer_id" uuid, CONSTRAINT "PK_f4c87100161cf76d6252895b772" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_ddc28212be437ec573b5ded6c37" FOREIGN KEY ("creator_id") REFERENCES "USER"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_a07e3f582439278d88cf48de70d" FOREIGN KEY ("video_format_id") REFERENCES "VIDEO_FORMAT"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_d1030a2a233119100773064e9ee" FOREIGN KEY ("edit_level_id") REFERENCES "EDIT_LEVEL"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" ADD CONSTRAINT "FK_5a6411cee8f549d19087ececfc5" FOREIGN KEY ("compensation_id") REFERENCES "COMPENSATION"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "MATERIAL" ADD CONSTRAINT "FK_34a07d3c142696c600486001bc3" FOREIGN KEY ("job_offer_id") REFERENCES "JOB_OFFER"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "MATERIAL" DROP CONSTRAINT "FK_34a07d3c142696c600486001bc3"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_5a6411cee8f549d19087ececfc5"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_d1030a2a233119100773064e9ee"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_a07e3f582439278d88cf48de70d"`);
        await queryRunner.query(`ALTER TABLE "JOB_OFFER" DROP CONSTRAINT "FK_ddc28212be437ec573b5ded6c37"`);
        await queryRunner.query(`DROP TABLE "MATERIAL"`);
        await queryRunner.query(`DROP TABLE "JOB_OFFER"`);
        await queryRunner.query(`DROP TABLE "COMPENSATION"`);
        await queryRunner.query(`DROP TYPE "public"."COMPENSATION_type_enum"`);
        await queryRunner.query(`DROP TABLE "EDIT_LEVEL"`);
        await queryRunner.query(`DROP TYPE "public"."EDIT_LEVEL_level_enum"`);
        await queryRunner.query(`DROP TABLE "VIDEO_FORMAT"`);
        await queryRunner.query(`DROP TYPE "public"."VIDEO_FORMAT_length_enum"`);
        await queryRunner.query(`DROP TYPE "public"."VIDEO_FORMAT_orientation_enum"`);
        await queryRunner.query(`DROP TABLE "USER"`);
        await queryRunner.query(`DROP TYPE "public"."USER_role_enum"`);
    }

}
