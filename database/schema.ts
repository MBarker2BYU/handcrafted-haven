// db/schema.ts

import {
  pgTable,
  integer,
  varchar,
  text,
  timestamp,
  boolean,
  numeric,
  PgArray,
  unique,
  index,
  pgEnum,
} from "drizzle-orm/pg-core";

// Existing users table - EXACTLY as provided, NO CHANGES
export const users = pgTable("users", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  role: varchar("role", { length: 50 }).default("Member"),
  createdAt: timestamp("created_at").defaultNow(),
});

// New tables

export const artisans = pgTable(
  "artisans",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    bio: text("bio"),
    shopName: varchar("shop_name", { length: 255 }).notNull(),
    profileImageUrl: varchar("profile_image_url", { length: 1024 }),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdKey: unique("artisans_user_id_key").on(table.userId),
    shopNameUnique: unique("artisans_shop_name_key").on(table.shopName),
    userIdIdx: index("artisans_user_id_idx").on(table.userId),
  })
);

export const categories = pgTable(
  "categories",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description"),
    slug: varchar("slug", { length: 255 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    nameUnique: unique("categories_name_key").on(table.name),
    slugUnique: unique("categories_slug_key").on(table.slug),
  })
);

export const products = pgTable(
  "products",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    artisanId: integer("artisan_id")
      .notNull()
      .references(() => artisans.id, { onDelete: "cascade" }),
    categoryId: integer("category_id")
      .notNull()
      .references(() => categories.id, { onDelete: "restrict" }),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    price: numeric("price", { precision: 10, scale: 2 }).notNull(),
    imageUrls: text("image_urls").array().notNull().default([]),
    stockQuantity: integer("stock_quantity").notNull().default(0),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    artisanIdIdx: index("products_artisan_id_idx").on(table.artisanId),
    categoryIdIdx: index("products_category_id_idx").on(table.categoryId),
    isActiveIdx: index("products_is_active_idx").on(table.isActive),
  })
);

export const reviews = pgTable(
  "reviews",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    rating: integer("rating").notNull(), // Check constraint added in migration if needed (1-5)
    reviewText: text("review_text"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    productIdIdx: index("reviews_product_id_idx").on(table.productId),
    userIdIdx: index("reviews_user_id_idx").on(table.userId),
    productUserUnique: unique("reviews_product_user_unique").on(
      table.productId,
      table.userId
    ), // One review per user per product
  })
);

export const cartItems = pgTable(
  "cart_items",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
    userId: integer("user_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    productId: integer("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    quantity: integer("quantity").notNull().default(1),
    addedAt: timestamp("added_at").defaultNow().notNull(),
  },
  (table) => ({
    userProductUnique: unique("cart_items_user_product_key").on(
      table.userId,
      table.productId
    ),
    userIdIdx: index("cart_items_user_id_idx").on(table.userId),
    productIdIdx: index("cart_items_product_id_idx").on(table.productId),
  })
);