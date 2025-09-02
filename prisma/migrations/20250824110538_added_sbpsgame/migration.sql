-- CreateTable
CREATE TABLE "SBPSGame" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "number" INTEGER NOT NULL,
    "player1Damage" INTEGER NOT NULL,
    "player2Damage" INTEGER NOT NULL,
    "player1State" TEXT NOT NULL,
    "player2State" TEXT NOT NULL,
    "steps" INTEGER NOT NULL,
    "log" TEXT NOT NULL,
    "matchId" TEXT NOT NULL,
    CONSTRAINT "SBPSGame_matchId_fkey" FOREIGN KEY ("matchId") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
