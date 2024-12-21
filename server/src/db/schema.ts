import { sqliteTable, text, integer, primaryKey } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  username: text("username").notNull().unique(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").default("user").notNull(),
  salt: text("salt").notNull(),
  created_at: text("created_at").default("CURRENT_TIMESTAMP"),
  updated_at: text("updated_at").default("CURRENT_TIMESTAMP"),
  last_sign: text("last_sign"),
  uuid: text("uuid").unique(),
});
