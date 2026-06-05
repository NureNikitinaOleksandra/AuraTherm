-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "acknowledged_at" TIMESTAMP(3),
ADD COLUMN     "resolved_at" TIMESTAMP(3);
