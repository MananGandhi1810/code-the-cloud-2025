-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('Created', 'SchemaGenerating', 'GeneratingCode', 'BuildingImage', 'ImagePublished');

-- CreateEnum
CREATE TYPE "HttpMethod" AS ENUM ('GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS', 'HEAD');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "ghUsername" TEXT NOT NULL,
    "ghAccessToken" TEXT NOT NULL,
    "ghId" INTEGER NOT NULL,
    "avatarUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "githubUrl" TEXT,
    "openAPISpec" JSONB NOT NULL,
    "prompt" TEXT NOT NULL,
    "generatedCode" TEXT[],
    "dockerImageName" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'Created',
    "dbSchema" JSONB,
    "seedData" JSONB,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Endpoint" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "method" "HttpMethod" NOT NULL,
    "bodyParams" JSONB,
    "queryParams" JSONB,
    "expectedStatusCode" INTEGER,
    "returnSchema" JSONB,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Endpoint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_ghUsername_key" ON "User"("ghUsername");

-- CreateIndex
CREATE UNIQUE INDEX "User_ghId_key" ON "User"("ghId");

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Endpoint" ADD CONSTRAINT "Endpoint_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
