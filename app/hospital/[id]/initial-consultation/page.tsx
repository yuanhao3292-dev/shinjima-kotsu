import { notFound } from 'next/navigation';
import { getSupabaseAdmin } from '@/lib/supabase/api';
import JTBConsultationClient from './JTBConsultationClient';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function JTBConsultationPage({ params }: PageProps) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();
  const { data: hospital, error } = await supabase
    .from('jtb_hospitals')
    .select('id, jtb_id, name_ja, name_en, name_zh_cn, name_zh_tw, prefecture, address, departments, specialties, features_ja, features_en, features_zh_cn, features_zh_tw, website_url')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error || !hospital) {
    notFound();
  }

  return <JTBConsultationClient hospital={hospital} />;
}

export async function generateMetadata({ params }: PageProps) {
  const { id } = await params;

  const supabase = getSupabaseAdmin();
  const { data: hospital } = await supabase
    .from('jtb_hospitals')
    .select('name_ja, name_zh_cn')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (!hospital) {
    return { title: 'Not Found' };
  }

  return {
    title: `${hospital.name_zh_cn || hospital.name_ja} - 前期咨询服务`,
    description: `${hospital.name_zh_cn || hospital.name_ja}的前期咨询服务。资料翻译、医院咨询、治疗方案初步评估。`,
  };
}
