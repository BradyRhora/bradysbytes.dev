-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SBPSTournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true
);
INSERT INTO "new_SBPSTournament" ("id", "name", "startDate") SELECT "id", "name", "startDate" FROM "SBPSTournament";
DROP TABLE "SBPSTournament";
ALTER TABLE "new_SBPSTournament" RENAME TO "SBPSTournament";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
