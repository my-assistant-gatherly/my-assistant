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
CREATE TABLE "events" (
    "id" SERIAL PRIMARY KEY,
    "owner_id" INT REFERENCES "user" (id), 
    "event_title" VARCHAR (255) NOT NULL, 
    "date" DATE NOT NULL,                 
    "start_time" TIME NOT NULL,           
    "duration" NUMERIC (5, 2),
    "location" VARCHAR (1000),                   
    "description" VARCHAR (1000),
    "is_public" BOOLEAN DEFAULT FALSE,    
    "total_likes" INTEGER DEFAULT 0,      
    "created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "tasks_events" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INTEGER,
	"task" VARCHAR (1000),
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "notes_events" (
	"id" SERIAL PRIMARY KEY,
	"event_id" INTEGER,
	"note" VARCHAR (1000),
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE "private_events_attendees" (
	"id" SERIAL PRIMARY KEY,
	"user_id" INTEGER,
	"event_id" INTEGER,
	"created_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
	"updated_at" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);


---hi. testing.