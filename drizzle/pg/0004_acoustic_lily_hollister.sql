-- 비가역: user_db_role 드랍 (ROLE 인증 모델 제거 완료, 스펙 §8.3). 적용 전 백업 권장 (pg_dump / mysqldump).
ALTER TABLE "users" DROP COLUMN "user_db_role";