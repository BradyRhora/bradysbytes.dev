-- CreateTable
CREATE TABLE "SBPSCharacter" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "range" REAL NOT NULL,
    "weight" REAL NOT NULL,
    "power" REAL NOT NULL,
    "speed" REAL NOT NULL,
    "weapon_size" REAL,
    "sex_appeal" REAL NOT NULL,
    "style" REAL NOT NULL,
    "colour" TEXT NOT NULL,
    "blurb" TEXT NOT NULL,
    "seriesId" TEXT NOT NULL,
    CONSTRAINT "SBPSCharacter_seriesId_fkey" FOREIGN KEY ("seriesId") REFERENCES "SBPSSeries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "SBPSSeries" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "releaseYear" INTEGER NOT NULL,
    "genre" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "SBPSPlayer" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "tag" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "mainId" TEXT NOT NULL,
    "secondaryId" TEXT,
    "weight" REAL NOT NULL,
    "charm" REAL NOT NULL,
    "anger" REAL NOT NULL,
    "depression" REAL NOT NULL,
    "intoxication" REAL NOT NULL,
    "fingerCount" INTEGER NOT NULL DEFAULT 10,
    "coordination" REAL NOT NULL,
    "intelligence" REAL NOT NULL,
    "techSkill" REAL NOT NULL,
    "stink" REAL NOT NULL,
    CONSTRAINT "SBPSPlayer_mainId_fkey" FOREIGN KEY ("mainId") REFERENCES "SBPSCharacter" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "SBPSPlayer_secondaryId_fkey" FOREIGN KEY ("secondaryId") REFERENCES "SBPSCharacter" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
