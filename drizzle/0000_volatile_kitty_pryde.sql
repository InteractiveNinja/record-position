CREATE TABLE "position" (
	"id" serial PRIMARY KEY NOT NULL,
	"description" text NOT NULL,
	"latitude" double precision NOT NULL,
	"longitude" double precision NOT NULL,
	"accuracy" double precision NOT NULL,
	"altitude" double precision NOT NULL,
	"altitudeAccuracy" double precision NOT NULL,
	"heading" double precision DEFAULT 1 NOT NULL
);
