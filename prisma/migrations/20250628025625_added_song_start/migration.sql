-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_PaFConfig" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "currentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "songIndex" INTEGER NOT NULL DEFAULT 0,
    "todaysStartTime" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_PaFConfig" ("currentDate", "id", "songIndex") SELECT "currentDate", "id", "songIndex" FROM "PaFConfig";
DROP TABLE "PaFConfig";
ALTER TABLE "new_PaFConfig" RENAME TO "PaFConfig";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
