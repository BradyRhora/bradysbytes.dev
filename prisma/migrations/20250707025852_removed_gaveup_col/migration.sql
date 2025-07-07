/*
  Warnings:

  - You are about to drop the column `gaveUp` on the `UserPerformance` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_UserPerformance" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "userId" TEXT NOT NULL,
    "scheduleIndex" INTEGER NOT NULL,
    "skipsUsed" INTEGER NOT NULL DEFAULT 0,
    "success" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "UserPerformance_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "UserPerformance_scheduleIndex_fkey" FOREIGN KEY ("scheduleIndex") REFERENCES "Schedule" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_UserPerformance" ("createdAt", "id", "scheduleIndex", "skipsUsed", "success", "userId") SELECT "createdAt", "id", "scheduleIndex", "skipsUsed", "success", "userId" FROM "UserPerformance";
DROP TABLE "UserPerformance";
ALTER TABLE "new_UserPerformance" RENAME TO "UserPerformance";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
