import { db } from "./db";
import {
  users,
  artisans,
  categories,
  products,
  reviews,
} from "./schema";
import bcrypt from "bcrypt";

async function seed() {
  console.log("🌱 Starting seed...");

  // -----------------------------
  // 1. USERS
  // -----------------------------
  console.log("Creating users...");

  const passwordHash = await bcrypt.hash("password123", 10);

  // Admin + 3 regular users
  const insertedUsers = await db
    .insert(users)
    .values([
      {
        email: "admin@example.com",
        password: passwordHash,
        role: "admin",
      },
      {
        email: "user1@example.com",
        password: passwordHash,
        role: "Member",
      },
      {
        email: "user2@example.com",
        password: passwordHash,
        role: "Member",
      },
      {
        email: "user3@example.com",
        password: passwordHash,
        role: "Member",
      },
    ])
    .returning();

  const admin = insertedUsers[0];
  const user1 = insertedUsers[1];
  const user2 = insertedUsers[2];
  const user3 = insertedUsers[3];

  console.log("Users created.");

  // -----------------------------
  // 2. ARTISANS (2)
  // -----------------------------
  console.log("Creating artisans...");

  const insertedArtisans = await db
    .insert(artisans)
    .values([
      {
        userId: user1.id,
        shopName: "Handcrafted Wonders",
        bio: "Artisan specializing in handmade wooden crafts.",
        profileImageUrl:
          "https://images.unsplash.com/photo-1520808663317-647b476a81b1",
      },
      {
        userId: user2.id,
        shopName: "Creative Clay Studio",
        bio: "Ceramic artist making unique pottery and clay art.",
        profileImageUrl:
          "https://images.unsplash.com/photo-1532298229144-0ec0c57515c7",
      },
    ])
    .returning();

  const artisan1 = insertedArtisans[1]; // artisan for user1
  const artisan2 = insertedArtisans[2]; // artisan for user2

  console.log("Artisans created.");

  // -----------------------------
  // 3. CATEGORIES (4)
  // -----------------------------
  console.log("Creating categories...");

  const insertedCategories = await db
    .insert(categories)
    .values([
      {
        name: "Woodwork",
        slug: "woodwork",
        description: "Handmade wooden creations and carvings.",
      },
      {
        name: "Ceramics",
        slug: "ceramics",
        description: "Clay pottery, dishes, and artistic ceramics.",
      },
      {
        name: "Jewelry",
        slug: "jewelry",
        description: "Hand-crafted jewelry pieces.",
      },
      {
        name: "Home Decor",
        slug: "home-decor",
        description: "Decorative items for home styling.",
      },
    ])
    .returning();

  const catWood = insertedCategories[0];
  const catCeramics = insertedCategories[1];
  const catJewelry = insertedCategories[2];
  const catHome = insertedCategories[3];

  console.log("Categories created.");

  // -----------------------------
  // 4. PRODUCTS (8 total)
  // -----------------------------
  console.log("Creating products...");

  const insertedProducts = await db
    .insert(products)
    .values([
      // ---------------- Artisan 1 (4 products)
      {
        artisanId: artisan1.id,
        categoryId: catWood.id,
        title: "Carved Wooden Bowl",
        description: "Hand-carved bowl made from sustainable oak.",
        price: "29.99",
        stockQuantity: 10,
        imageUrls: [
          "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        ],
      },
      {
        artisanId: artisan1.id,
        categoryId: catWood.id,
        title: "Rustic Cutting Board",
        description: "Perfect for kitchens. Durable and beautifully finished.",
        price: "39.99",
        stockQuantity: 8,
        imageUrls: [
          "https://images.unsplash.com/photo-1556911220-e15b29be8c75",
        ],
      },
      {
        artisanId: artisan1.id,
        categoryId: catHome.id,
        title: "Decorative Wooden Wall Art",
        description: "Handmade geometric wall piece.",
        price: "49.99",
        stockQuantity: 6,
        imageUrls: [
          "https://images.unsplash.com/photo-1503602642458-232111445657",
        ],
      },
      {
        artisanId: artisan1.id,
        categoryId: catJewelry.id,
        title: "Wooden Pendant Necklace",
        description: "Minimalist handcrafted necklace.",
        price: "19.99",
        stockQuantity: 12,
        imageUrls: [
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
        ],
      },

      // ---------------- Artisan 2 (4 products)
      {
        artisanId: artisan2.id,
        categoryId: catCeramics.id,
        title: "Clay Coffee Mug",
        description: "Hand-thrown mug with glazed finish.",
        price: "24.99",
        stockQuantity: 15,
        imageUrls: [
          "https://images.unsplash.com/photo-1526948128573-703ee1aeb6fa",
        ],
      },
      {
        artisanId: artisan2.id,
        categoryId: catCeramics.id,
        title: "Decorative Flower Vase",
        description: "Beautiful clay vase with unique glazing.",
        price: "34.99",
        stockQuantity: 7,
        imageUrls: [
          "https://images.unsplash.com/photo-1528825871115-3581a5387919",
        ],
      },
      {
        artisanId: artisan2.id,
        categoryId: catHome.id,
        title: "Ceramic Candle Holder",
        description: "Modern design candle holder.",
        price: "14.99",
        stockQuantity: 20,
        imageUrls: [
          "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
        ],
      },
      {
        artisanId: artisan2.id,
        categoryId: catJewelry.id,
        title: "Clay Bead Bracelet",
        description: "Lightweight clay bead bracelet.",
        price: "12.99",
        stockQuantity: 25,
        imageUrls: [
          "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9",
        ],
      },
    ])
    .returning();

  console.log("Products created.");

  // -----------------------------
  // 5. REVIEWS (3 users reviewing multiple products)
  // -----------------------------
  console.log("Creating reviews...");

  const allProducts = insertedProducts;

  await db.insert(reviews).values([
    // user1 reviews product 1 & 5
    {
      userId: user1.id,
      productId: allProducts[0].id,
      rating: 5,
      reviewText: "Amazing quality—highly recommend!",
    },
    {
      userId: user1.id,
      productId: allProducts[4].id,
      rating: 4,
      reviewText: "Great mug, perfect handle feel!",
    },

    // user2 reviews product 2 & 6
    {
      userId: user2.id,
      productId: allProducts[1].id,
      rating: 5,
      reviewText: "Very sturdy cutting board.",
    },
    {
      userId: user2.id,
      productId: allProducts[5].id,
      rating: 4,
      reviewText: "Vase looks amazing on my shelf.",
    },

    // user3 reviews product 3 & 7
    {
      userId: user3.id,
      productId: allProducts[2].id,
      rating: 4,
      reviewText: "Looks fantastic on the wall!",
    },
    {
      userId: user3.id,
      productId: allProducts[6].id,
      rating: 5,
      reviewText: "Excellent craftsmanship.",
    },
  ]);

  console.log("Reviews created.");

  console.log("🌱 Seed complete!");
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
