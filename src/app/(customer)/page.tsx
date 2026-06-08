import { categoryService } from '@/services/category.api';
import { productService } from '@/services/product.api';
import type { Category } from '@/types/category.type';
import type { Product } from '@/types/product.type';
import { HomePageClient } from './HomePageClient';

export const dynamic = 'force-dynamic';

async function loadHomeData(): Promise<{ categories: Category[]; products: Product[] }> {
  try {
    const [categories, products] = await Promise.all([
      categoryService.getAll(),
      productService.getAll(),
    ]);
    return { categories, products };
  } catch {
    return { categories: [], products: [] };
  }
}

export default async function HomePage() {
  const { categories, products } = await loadHomeData();
  return <HomePageClient categories={categories} products={products} />;
}
