/*
  Warnings:

  - You are about to drop the column `log` on the `SBPSGame` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "SBPSGameLog" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "index" INTEGER NOT NULL,
    "gameId" TEXT NOT NULL,
    "timestamp" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "content" TEXT NOT NULL,
    CONSTRAINT "SBPSGameLog_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "SBPSGame" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

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
    "matchId" TEXT NOT NULL,
    CONSTRAINT "SBPSGame_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_SBPSGame" ("id", "matchId", "number", "player1Damage", "player1State", "player1Stocks", "player2Damage", "player2State", "player2Stocks", "steps") SELECT "id", "matchId", "number", "player1Damage", "player1State", "player1Stocks", "player2Damage", "player2State", "player2Stocks", "steps" FROM "SBPSGame";
DROP TABLE "SBPSGame";
ALTER TABLE "new_SBPSGame" RENAME TO "SBPSGame";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
