import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';
export const records = sqliteTable('records', {
 id: text('id').primaryKey(), kind: text('kind').notNull(), clientId: text('client_id').notNull(),
 payload: text('payload').notNull(), version: integer('version').notNull().default(1),
 updatedAt: text('updated_at').notNull(), updatedBy: text('updated_by').notNull(),
});
export const files = sqliteTable('files', {
 id: text('id').primaryKey(), recordId: text('record_id').notNull(), name: text('name').notNull(),
 type: text('type').notNull(), size: integer('size').notNull(), createdAt: text('created_at').notNull(),
});
