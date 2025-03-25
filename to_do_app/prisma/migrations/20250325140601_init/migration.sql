/*
  Warnings:

  - You are about to alter the column `description` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(1000)`.

*/
-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "description" SET DATA TYPE VARCHAR(1000);
