-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "image_url" VARCHAR (2000),
    "fullname" VARCHAR (80) NOT NULL,
    "user_title" VARCHAR (80) NOT NULL,
    "skill" VARCHAR (80) NOT NULL,
    "zipcode" INTEGER NOT NULL,
    "created_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP DEFAULT CURRENT_TIMESTAMP

);

---hi. testing.