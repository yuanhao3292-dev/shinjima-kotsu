'use client';

import VehiclesContent from '@/app/vehicles/VehiclesContent';
import type { WhitelabelModuleProps } from './types';

export default function VehiclesModule(props: WhitelabelModuleProps) {
  return <VehiclesContent whitelabel={props} />;
}
