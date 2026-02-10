'use client';

import HyogoMedicalContent from '@/app/hyogo-medical/HyogoMedicalContent';
import type { WhitelabelModuleProps } from './types';

export default function HyogoMedicalModule(props: WhitelabelModuleProps) {
  return <HyogoMedicalContent whitelabel={props} />;
}
