/*
  Warnings:

  - You are about to drop the column `firebase_uid` on the `users` table. All the data in the column will be lost.
  - You are about to drop the column `stripe_customer_id` on the `users` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'USER',
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "api_key" TEXT NOT NULL,
    "password" TEXT NOT NULL
);
INSERT INTO "new_users" ("api_key", "created_at", "email", "id", "name", "password", "role", "updated_at", "username") SELECT "api_key", "created_at", "email", "id", "name", "password", "role", "updated_at", "username" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
CREATE UNIQUE INDEX "users_api_key_key" ON "users"("api_key");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
