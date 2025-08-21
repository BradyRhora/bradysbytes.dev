/*
  Warnings:

  - Added the required column `round` to the `SBPSTournamentMatch` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_SBPSTournamentMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "round" INTEGER NOT NULL,
    "player1Id" TEXT,
    "player2Id" TEXT,
    "winnerId" TEXT,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "previousMatch1Id" TEXT,
    "previousMatch2Id" TEXT,
    "nextMatchId" TEXT,
    CONSTRAINT "SBPSTournamentMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "SBPSTournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "SBPSPlayer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "SBPSPlayer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "SBPSPlayer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_previousMatch1Id_fkey" FOREIGN KEY ("previousMatch1Id") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_previousMatch2Id_fkey" FOREIGN KEY ("previousMatch2Id") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_SBPSTournamentMatch" ("id", "nextMatchId", "player1Id", "player2Id", "previousMatch1Id", "previousMatch2Id", "score1", "score2", "tournamentId", "winnerId") SELECT "id", "nextMatchId", "player1Id", "player2Id", "previousMatch1Id", "previousMatch2Id", "score1", "score2", "tournamentId", "winnerId" FROM "SBPSTournamentMatch";
DROP TABLE "SBPSTournamentMatch";
ALTER TABLE "new_SBPSTournamentMatch" RENAME TO "SBPSTournamentMatch";
CREATE UNIQUE INDEX "SBPSTournamentMatch_previousMatch1Id_key" ON "SBPSTournamentMatch"("previousMatch1Id");
CREATE UNIQUE INDEX "SBPSTournamentMatch_previousMatch2Id_key" ON "SBPSTournamentMatch"("previousMatch2Id");
CREATE UNIQUE INDEX "SBPSTournamentMatch_nextMatchId_key" ON "SBPSTournamentMatch"("nextMatchId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
