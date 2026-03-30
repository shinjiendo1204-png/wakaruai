'use server';
import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function postReview(formData: FormData) {
  const toolId = formData.get('toolId') as string;
  const userName = formData.get('userName') as string;
  const rating = parseInt(formData.get('rating') as string);
  const comment = formData.get('comment') as string;

  const { error } = await supabase.from('reviews').insert([
    { tool_id: toolId, user_name: userName, rating, comment }
  ]);

  if (error) throw new Error(error.message);

  // ページを更新して最新のクチコミを表示させる
  revalidatePath(`/tools/${toolId}`);
}