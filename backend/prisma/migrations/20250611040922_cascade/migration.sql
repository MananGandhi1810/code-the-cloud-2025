-- DropForeignKey
ALTER TABLE "Endpoint" DROP CONSTRAINT "Endpoint_projectId_fkey";

-- AddForeignKey
ALTER TABLE "Endpoint" ADD CONSTRAINT "Endpoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE CASCADE ON UPDATE CASCADE;
