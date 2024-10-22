import { MigrationInterface, QueryRunner } from 'typeorm';

export class UserFactor1720190062147 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "username" RENAME TO "name"`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user" ALTER COLUMN "name" RENAME TO "username"`,
    ); // 恢复"up"方法所做的事情
  }
}
