CREATE TABLE "categories" (
	"id" text PRIMARY KEY NOT NULL,
	"label" text NOT NULL,
	CONSTRAINT "categories_label_unique" UNIQUE("label")
);
--> statement-breakpoint
CREATE TABLE "rooms" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sounds" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"url" text NOT NULL,
	"playCount" integer DEFAULT 0 NOT NULL,
	"createdAt" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "sounds_to_categories" (
	"soundId" text NOT NULL,
	"categoryId" text NOT NULL,
	CONSTRAINT "sounds_to_categories_soundId_categoryId_pk" PRIMARY KEY("soundId","categoryId")
);
--> statement-breakpoint
CREATE TABLE "version" (
	"id" serial PRIMARY KEY NOT NULL
);
--> statement-breakpoint
ALTER TABLE "sounds_to_categories" ADD CONSTRAINT "sounds_to_categories_soundId_sounds_id_fk" FOREIGN KEY ("soundId") REFERENCES "public"."sounds"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sounds_to_categories" ADD CONSTRAINT "sounds_to_categories_categoryId_categories_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."categories"("id") ON DELETE cascade ON UPDATE no action;