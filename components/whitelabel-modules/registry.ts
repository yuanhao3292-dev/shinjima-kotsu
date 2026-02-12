import dynamic from 'next/dynamic';
import type { ComponentType } from 'react';
import type { WhitelabelModuleProps } from './types';

/**
 * 模块组件注册表
 * 使用 next/dynamic 按需加载，未选择的模块不会加载 JS
 */
const MODULE_REGISTRY: Record<string, ComponentType<WhitelabelModuleProps>> = {
  health_screening: dynamic(() => import('./HealthScreeningModule')),
  cancer_treatment: dynamic(() => import('./CancerTreatmentModule')),
  golf: dynamic(() => import('./GolfModule')),
  medical_tourism: dynamic(() => import('./MedicalTourismModule')),
  medical_packages: dynamic(() => import('./MedicalPackagesModule')),
  hyogo_medical: dynamic(() => import('./HyogoMedicalModule')),
};

export function getModuleComponent(componentKey: string): ComponentType<WhitelabelModuleProps> | null {
  return MODULE_REGISTRY[componentKey] || null;
}

export const AVAILABLE_MODULE_KEYS = Object.keys(MODULE_REGISTRY);
