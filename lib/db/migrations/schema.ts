import { pgTable, uuid, varchar, foreignKey, timestamp, text, json, boolean, bigint, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"




export const user = pgTable("User", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	email: varchar({ length: 64 }).notNull(),
	password: varchar({ length: 64 }),
});

export const chat = pgTable("Chat", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	userId: uuid().notNull(),
	visibility: varchar().default('private').notNull(),
},
(table) => {
	return {
		chatUserIdUserIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [user.id],
			name: "Chat_userId_User_id_fk"
		}),
	}
});

export const messageV2 = pgTable("Message_v2", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	parts: json().notNull(),
	attachments: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
});

export const suggestion = pgTable("Suggestion", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	documentId: uuid().notNull(),
	documentCreatedAt: timestamp({ mode: 'string' }).notNull(),
	originalText: text().notNull(),
	suggestedText: text().notNull(),
	description: text(),
	isResolved: boolean().default(false).notNull(),
	userId: uuid().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
});

export const message = pgTable("Message", {
	id: uuid().defaultRandom().primaryKey().notNull(),
	chatId: uuid().notNull(),
	role: varchar().notNull(),
	content: json().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
});

export const vendor = pgTable("Vendor", {
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	internalId: bigint({ mode: "number" }),
	vendorName: text("VENDOR NAME"),
	factoryName: text("FACTORY NAME"),
	productRange: text("Product Range"),
	category: text("Category"),
	vendorType: text("Vendor Type"),
	ytdPurchases: text("YTD Purchases"),
	purchasesLy: text("Purchases LY"),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	openPos: bigint({ mode: "number" }),
	terms: text("Terms"),
	certificates: text("Certificates"),
	name: text("Name"),
	email: text("Email"),
	phone: text("Phone"),
	country: text("Country"),
	audits: text("Audits"),
	city: text("City"),
	certificationDocuments: text("Certification documents"),
	factories: text("Factories"),
	relevant3RdPartySocialAudit: text("Relevant 3rd party social audit"),
	id: uuid().defaultRandom().primaryKey().notNull(),
});

export const voteV2 = pgTable("Vote_v2", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
},
(table) => {
	return {
		voteV2ChatIdMessageIdPk: primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_v2_chatId_messageId_pk"}),
	}
});

export const vote = pgTable("Vote", {
	chatId: uuid().notNull(),
	messageId: uuid().notNull(),
	isUpvoted: boolean().notNull(),
},
(table) => {
	return {
		voteChatIdMessageIdPk: primaryKey({ columns: [table.chatId, table.messageId], name: "Vote_chatId_messageId_pk"}),
	}
});

export const document = pgTable("Document", {
	id: uuid().defaultRandom().notNull(),
	createdAt: timestamp({ mode: 'string' }).notNull(),
	title: text().notNull(),
	content: text(),
	userId: uuid().notNull(),
	kind: varchar().default('text').notNull(),
},
(table) => {
	return {
		documentIdCreatedAtPk: primaryKey({ columns: [table.id, table.createdAt], name: "Document_id_createdAt_pk"}),
	}
});