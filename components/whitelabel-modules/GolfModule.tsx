'use client';

import GolfContent from '@/app/business/golf/GolfContent';
import type { WhitelabelModuleProps } from './types';

export default function GolfModule(props: WhitelabelModuleProps) {
  return <GolfContent whitelabel={props} />;
}
