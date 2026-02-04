/**
 * 白标模块共享 Props 接口
 * All whitelabel module components share this interface
 */
export interface WhitelabelModuleProps {
  /** 导游主题色 e.g. '#2563eb' */
  brandColor: string;
  /** 导游品牌名 */
  brandName: string;
  /** 导游联系方式 */
  contactInfo: {
    wechat: string | null;
    line: string | null;
    phone: string | null;
    email: string | null;
  };
  /** 模块 ID */
  moduleId: string;
  /** 模块名称 */
  moduleName: string;
  /** 是否在模块底部显示联系区块（默认 true，在 /g/[slug] 页面中设为 false 以避免重复） */
  showContact?: boolean;
}
