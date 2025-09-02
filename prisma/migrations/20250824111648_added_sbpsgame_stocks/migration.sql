-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SBPSGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "player1Damage" INTEGER NOT NULL DEFAULT 0,
    "player2Damage" INTEGER NOT NULL DEFAULT 0,
    "player1Stocks" INTEGER NOT NULL DEFAULT 3,
    "player2Stocks" INTEGER NOT NULL DEFAULT 3,
    "player1State" TEXT NOT NULL DEFAULT 'spawning',
    "player2State" TEXT NOT NULL DEFAULT 'spawning',
    "steps" INTEGER NOT NULL DEFAULT 0,
    "log" TEXT NOT NULL DEFAULT '',
    "matchId" TEXT NOT NULL,
    CONSTRAINT "SBPSGame_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SBPSGame" ("id", "log", "matchId", "number", "player1Damage", "player1State", "player2Damage", "player2State", "steps") SELECT "id", "log", "matchId", "number", "player1Damage", "player1State", "player2Damage", "player2State", "steps" FROM "SBPSGame";
DROP TABLE "SBPSGame";
ALTER TABLE "new_SBPSGame" RENAME TO "SBPSGame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
