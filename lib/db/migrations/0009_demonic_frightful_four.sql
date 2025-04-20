ALTER TABLE "Vendor" DROP CONSTRAINT "Vendor_id_pk";--> statement-breakpoint
ALTER TABLE "Vendor" ADD PRIMARY KEY ("id");
ALTER TABLE "Document" RENAME COLUMN "text" TO "kind";