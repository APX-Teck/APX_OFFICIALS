-- AlterTable
ALTER TABLE "BlogLike" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "BlogPost" ADD COLUMN     "fieldId" TEXT,
ALTER COLUMN "slug" DROP NOT NULL;

-- AlterTable
ALTER TABLE "FileUpload" ALTER COLUMN "docFileId" DROP NOT NULL;
