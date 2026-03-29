import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { absoluteUrl } from '@/lib/seo';
import { getProductById, getProductBySlug, getProductCategories } from '@/lib/services/product';
import ProjectDetailPageClient from './project-detail-page-client';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const projectResponse = await getProductBySlug(slug).catch(async () => {
    if (/^\d+$/.test(slug)) {
      return getProductById(Number(slug)).catch(() => ({ data: null }));
    }
    return { data: null };
  });

  const project = projectResponse?.data;
  if (!project) {
    return {
      title: 'Khong tim thay du an',
      alternates: {
        canonical: absoluteUrl(`/du-an/${slug}`),
      },
    };
  }

  return {
    title: `${project.name} | Du an STARTECH`,
    description: project.description || `Chi tiet du an ${project.name} tai STARTECH.`,
    alternates: {
      canonical: absoluteUrl(`/du-an/${project.slug || slug}`),
    },
    openGraph: {
      title: `${project.name} | Du an STARTECH`,
      description: project.description || `Chi tiet du an ${project.name} tai STARTECH.`,
      images: project.image_url ? [{ url: absoluteUrl(project.image_url), alt: project.name }] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${project.name} | Du an STARTECH`,
      description: project.description || `Chi tiet du an ${project.name} tai STARTECH.`,
      images: project.image_url ? [absoluteUrl(project.image_url)] : undefined,
    },
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const [categoriesResponse, projectResponse] = await Promise.all([
    getProductCategories().catch(() => ({ data: [] })),
    getProductBySlug(slug).catch(async () => {
      if (/^\d+$/.test(slug)) {
        return getProductById(Number(slug)).catch(() => ({ data: null }));
      }
      return { data: null };
    }),
  ]);

  if (!projectResponse?.data) {
    notFound();
  }

  return (
    <ProjectDetailPageClient
      project={projectResponse.data}
      categories={categoriesResponse.data ?? []}
    />
  );
}
