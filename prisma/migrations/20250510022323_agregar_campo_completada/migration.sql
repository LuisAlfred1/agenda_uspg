-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Tarea" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "texto" TEXT NOT NULL,
    "categoria" TEXT NOT NULL,
    "fecha" DATETIME,
    "creadaEn" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completada" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_Tarea" ("categoria", "creadaEn", "fecha", "id", "texto") SELECT "categoria", "creadaEn", "fecha", "id", "texto" FROM "Tarea";
DROP TABLE "Tarea";
ALTER TABLE "new_Tarea" RENAME TO "Tarea";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
