import { MigrationInterface, QueryRunner } from "typeorm";

export class InitUserSchema1791128327461 implements MigrationInterface {
    name = 'InitUserSchema1791128327461'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("user_id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "phone" character varying(20) NOT NULL, "firstName" character varying NOT NULL, "lastName" character varying NOT NULL, "passwordHash" character varying NOT NULL, "passwordSalt" character varying NOT NULL, "balance" character varying NOT NULL DEFAULT '0', "isDeleted" boolean DEFAULT false, CONSTRAINT "PK_758b8ce7c18b9d347461b30228d" PRIMARY KEY ("user_id")); COMMENT ON COLUMN "user"."user_id" IS 'Идентификатор пользователя'; COMMENT ON COLUMN "user"."login" IS 'Логин пользователя'; COMMENT ON COLUMN "user"."phone" IS 'Номер телефона пользователя'; COMMENT ON COLUMN "user"."firstName" IS 'Имя'; COMMENT ON COLUMN "user"."lastName" IS 'Фамилия'; COMMENT ON COLUMN "user"."passwordHash" IS 'Хеш пароля'; COMMENT ON COLUMN "user"."passwordSalt" IS 'Соль пароля'; COMMENT ON COLUMN "user"."balance" IS 'Баланс'; COMMENT ON COLUMN "user"."isDeleted" IS 'Был ли удален аккаунт'`);
        await queryRunner.query(`CREATE INDEX "IDX_a62473490b3e4578fd683235c5" ON "user"  ("login") `);
        await queryRunner.query(`CREATE INDEX "IDX_207dec28c1b5028d8658d9a6f1" ON "user"  ("login", "phone") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_207dec28c1b5028d8658d9a6f1"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a62473490b3e4578fd683235c5"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
