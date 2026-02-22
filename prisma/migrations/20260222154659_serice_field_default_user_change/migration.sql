/*
  Warnings:

  - Added the required column `docFileId` to the `FileUpload` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "FileUpload" ADD COLUMN     "docFileId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "role" SET DEFAULT 'CLIENT';
