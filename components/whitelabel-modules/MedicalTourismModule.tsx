'use client';

import MedicalTourismContent from '@/app/business/medical/MedicalTourismContent';
import type { WhitelabelModuleProps } from './types';

export default function MedicalTourismModule(props: WhitelabelModuleProps) {
  return <MedicalTourismContent whitelabel={props} />;
}
