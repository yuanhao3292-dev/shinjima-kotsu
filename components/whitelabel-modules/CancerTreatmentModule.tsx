'use client';

import CancerTreatmentContent from '@/app/cancer-treatment/CancerTreatmentContent';
import type { WhitelabelModuleProps } from './types';

export default function CancerTreatmentModule(props: WhitelabelModuleProps) {
  return <CancerTreatmentContent whitelabel={props} />;
}
