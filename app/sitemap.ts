// app/sitemap.ts
import { MetadataRoute } from 'next';
import { supabase } from '@/lib/supabase';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://wakaruai.net';

  // 1. ニュース記事の全URLを取得
  const { data: news } = await supabase
    .from('ai_news')
    .select('id, created_at')
    .eq('is_published', true);

  const newsUrls = (news || []).map((item) => ({
    url: `${baseUrl}/news/${item.id}`,
    lastModified: new Date(item.created_at),
  }));

  // 2. 用語辞典の全URLを取得
  const { data: glossary } = await supabase
    .from('ai_glossary')
    .select('slug');

  const glossaryUrls = (glossary || []).map((item) => ({
    url: `${baseUrl}/glossary/${item.slug}`,
    lastModified: new Date(),
  }));

  // 3. 固定ページのURL
  const staticUrls = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/news`, lastModified: new Date() },
    { url: `${baseUrl}/glossary`, lastModified: new Date() },
  ];

  return [...staticUrls, ...newsUrls, ...glossaryUrls];
}