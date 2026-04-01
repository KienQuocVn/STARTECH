'use client';
import { useEffect, useRef, useState } from 'react';
import { getProducts, getProductsByCategory, type Product, type ProductCategory } from '@/lib/services/product';
import ProjectsSection from './sections/projects-section';

interface ProjectsPageClientProps {
  initialProducts: Product[];
  initialCategories: Array<ProductCategory & { product_count: number }>;
  initialTotalItems: number;
  initialTotalPages: number;
  totalAllItems: number;
}

export default function ProjectsPageClient({
  initialProducts,
  initialCategories,
  initialTotalItems,
  initialTotalPages,
  totalAllItems,
}: ProjectsPageClientProps) {
  const [activeCategory, setActiveCategory] = useState('all');
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [categories] = useState<(ProductCategory & { product_count: number })[]>(initialCategories);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(initialTotalPages);
  const [totalItems, setTotalItems] = useState(initialTotalItems);
  const isInitialFetch = useRef(true);

  useEffect(() => {
    if (isInitialFetch.current && activeCategory === 'all' && currentPage === 1) {
      isInitialFetch.current = false;
      return;
    }

    let mounted = true;

    const fetchProducts = async () => {
      try {
        setLoading(true);

        let productsResponse;
        if (activeCategory !== 'all') {
          const match = activeCategory.match(/^cat-(\d+)$/);
          const catId = match ? Number(match[1]) : null;

          productsResponse = catId
            ? await getProductsByCategory(catId, { page: currentPage, limit: 12 })
            : await getProducts({ page: currentPage, limit: 12 });
        } else {
          productsResponse = await getProducts({ page: currentPage, limit: 12 });
        }

        if (!mounted) return;

        const total = productsResponse?.data?.total ?? 0;
        setProducts(productsResponse?.data?.items || []);
        setTotalItems(total);
        setTotalPages(Math.max(1, Math.ceil(total / 12)));
      } catch (error) {
        console.error('Loi khi tai danh sach du an:', error);
        if (!mounted) return;
        setProducts([]);
        setTotalItems(0);
        setTotalPages(1);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchProducts();

    return () => {
      mounted = false;
    };
  }, [currentPage, activeCategory]);
  return (
    <div className="flex flex-col">
      <ProjectsSection
        products={products}
        categories={categories}
        activeCategory={activeCategory}
        setActiveCategory={setActiveCategory}
        loading={loading}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
        totalItems={totalItems}
        totalAllItems={totalAllItems}
      />
    </div>
  );
}
