import restaurants, { type Restaurant } from "@/data/restaurants";

export function getRestaurant(slug: string): Restaurant | undefined {
  return restaurants.find((r) => r.slug === slug);
}

export function getAllSlugs(): string[] {
  return restaurants.map((r) => r.slug);
}
