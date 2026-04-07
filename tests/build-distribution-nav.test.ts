import { describe, it, expect } from 'vitest';
import { buildDistributionNavItems } from '@/lib/utils/build-distribution-nav';
import type { SelectedModuleWithDetails } from '@/lib/types/whitelabel';

// Helper to create a mock module
function mockModule(
  componentKey: string | null,
  name = 'Test Module',
): SelectedModuleWithDetails {
  return {
    id: 'mod-' + (componentKey || 'null'),
    sortOrder: 0,
    isEnabled: true,
    customTitle: null,
    customDescription: null,
    module: {
      id: 'mod-' + (componentKey || 'null'),
      category: 'medical',
      name,
      nameJa: null,
      slug: null,
      description: null,
      thumbnailUrl: null,
      commissionRate: 10,
      isRequired: false,
      sortOrder: 0,
      isActive: true,
      componentKey,
      displayConfig: null,
      createdAt: '2024-01-01',
      updatedAt: '2024-01-01',
    },
  };
}

describe('buildDistributionNavItems', () => {
  it('always includes home as the first item', () => {
    const nav = buildDistributionNavItems('test-guide', []);
    expect(nav).toHaveLength(1);
    expect(nav[0].id).toBe('home');
    expect(nav[0].href).toBe('/g/test-guide');
  });

  it('adds modules that are in the DETAIL_MODULES whitelist', () => {
    const modules = [mockModule('medical_packages'), mockModule('cancer_treatment')];
    const nav = buildDistributionNavItems('my-slug', modules);
    expect(nav).toHaveLength(3); // home + 2 modules
    expect(nav[1].id).toBe('medical_packages');
    expect(nav[2].id).toBe('cancer_treatment');
  });

  it('skips modules not in DETAIL_MODULES', () => {
    const modules = [mockModule('unknown_module'), mockModule('medical_packages')];
    const nav = buildDistributionNavItems('slug', modules);
    expect(nav).toHaveLength(2); // home + medical_packages only
    expect(nav[1].id).toBe('medical_packages');
  });

  it('skips modules with null componentKey', () => {
    const modules = [mockModule(null)];
    const nav = buildDistributionNavItems('slug', modules);
    expect(nav).toHaveLength(1); // only home
  });

  it('generates correct href with URL slug format', () => {
    const modules = [mockModule('medical_packages')];
    const nav = buildDistributionNavItems('my-guide', modules);
    expect(nav[1].href).toBe('/g/my-guide/medical-packages');
  });

  it('uses MODULE_LABELS for known module labels', () => {
    const modules = [mockModule('medical_packages')];
    const nav = buildDistributionNavItems('slug', modules);
    const label = nav[1].label as Record<string, string>;
    expect(label['ja']).toBe('精密健康診断');
    expect(label['zh-CN']).toBe('精密体检');
    expect(label['en']).toBe('Health Screening');
  });

  it('home label has all 4 languages', () => {
    const nav = buildDistributionNavItems('slug', []);
    const label = nav[0].label as Record<string, string>;
    expect(label['ja']).toBe('ホーム');
    expect(label['zh-CN']).toBe('首页');
    expect(label['zh-TW']).toBe('首頁');
    expect(label['en']).toBe('Home');
  });

  it('processes all DETAIL_MODULES correctly', () => {
    const detailKeys = [
      'medical_packages', 'hyogo_medical', 'kindai_hospital', 'cancer_treatment',
      'sai_clinic', 'wclinic_mens', 'helene_clinic', 'ginza_phoenix',
      'cell_medicine', 'ac_plus', 'igtc', 'osaka_himak',
    ];
    const modules = detailKeys.map(k => mockModule(k));
    const nav = buildDistributionNavItems('slug', modules);
    expect(nav).toHaveLength(detailKeys.length + 1); // +1 for home
  });
});
