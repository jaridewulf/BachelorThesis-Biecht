/*
  Warnings:

  - Added the required column `color` to the `Department` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Department" ADD COLUMN     "color" TEXT NOT NULL;
