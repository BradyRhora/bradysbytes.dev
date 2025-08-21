-- CreateTable
CREATE TABLE "SBPSTournament" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "SBPSTournamentEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "playerId" TEXT NOT NULL,
    "rank" INTEGER,
    CONSTRAINT "SBPSTournamentEntry_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "SBPSTournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentEntry_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "SBPSPlayer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SBPSTournamentMatch" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tournamentId" TEXT NOT NULL,
    "player1Id" TEXT,
    "player2Id" TEXT,
    "winnerId" TEXT NOT NULL,
    "score1" INTEGER NOT NULL DEFAULT 0,
    "score2" INTEGER NOT NULL DEFAULT 0,
    "previousMatch1Id" TEXT,
    "previousMatch2Id" TEXT,
    "nextMatchId" TEXT,
    CONSTRAINT "SBPSTournamentMatch_tournamentId_fkey" FOREIGN KEY ("tournamentId") REFERENCES "SBPSTournament" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_player1Id_fkey" FOREIGN KEY ("player1Id") REFERENCES "SBPSPlayer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_player2Id_fkey" FOREIGN KEY ("player2Id") REFERENCES "SBPSPlayer" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "SBPSPlayer" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_previousMatch1Id_fkey" FOREIGN KEY ("previousMatch1Id") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_previousMatch2Id_fkey" FOREIGN KEY ("previousMatch2Id") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "SBPSTournamentMatch_nextMatchId_fkey" FOREIGN KEY ("nextMatchId") REFERENCES "SBPSTournamentMatch" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "SBPSTournamentMatch_previousMatch1Id_key" ON "SBPSTournamentMatch"("previousMatch1Id");

-- CreateIndex
CREATE UNIQUE INDEX "SBPSTournamentMatch_previousMatch2Id_key" ON "SBPSTournamentMatch"("previousMatch2Id");

-- CreateIndex
CREATE UNIQUE INDEX "SBPSTournamentMatch_nextMatchId_key" ON "SBPSTournamentMatch"("nextMatchId");
