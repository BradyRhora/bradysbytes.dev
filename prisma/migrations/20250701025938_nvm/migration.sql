/*
  Warnings:

  - You are about to drop the column `totalDays` on the `PaFConfig` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaFConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT DEFAULT 0,
    "currentDate" DATETIME,
    "songIndex" INTEGER NOT NULL DEFAULT -1,
    "todaysStartTime" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_PaFConfig" ("currentDate", "id", "songIndex", "todaysStartTime") SELECT "currentDate", "id", "songIndex", "todaysStartTime" FROM "PaFConfig";
DROP TABLE "PaFConfig";
ALTER TABLE "new_PaFConfig" RENAME TO "PaFConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
