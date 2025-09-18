/*
  Warnings:

  - A unique constraint covering the columns `[id,ownerId]` on the table `projects` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "projects_id_ownerId_key" ON "public"."projects"("id", "ownerId");
