-- USER is a reserved keyword with Postgres
-- You must use double quotes in every query that user is in:
-- ex. SELECT * FROM "user";
-- Otherwise you will have errors!
-- CREATE TABLE "user" (
--     "id" SERIAL PRIMARY KEY,
--     "username" VARCHAR (80) UNIQUE NOT NULL,
--     "password" VARCHAR (1000) NOT NULL
-- );
CREATE TABLE "user" (
    "id" SERIAL PRIMARY KEY,
    "username" VARCHAR (80) UNIQUE NOT NULL,
    "password" VARCHAR (1000) NOT NULL,
    "image_url" VARCHAR,
	"fullname" VARCHAR (1000) NOT NULL,
	"user_title" VARCHAR (1000),
	"skills" VARCHAR (1000),
	"zip_code" INTEGER,
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

---hi. testing.