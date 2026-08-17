/**
 * 全站默认 OG 图（1200×630，构建时静态生成）
 *
 * 此前 metadata 里既没有 og:image 也没有任何图片文件 —— 分享到
 * LINE / 微信 / X 时是一块空白。用文件约定生成，所有路由自动继承。
 *
 * ⚠️ 只用拉丁字形：ImageResponse 默认字体不含 CJK，写中日文会渲染成豆腐块。
 * 品牌 wordmark 本来就是 NIIJIMA，正好一致。
 */
import { ImageResponse } from 'next/og';

export const alt = 'NIIJIMA KOUTSU — Medical Tourism Japan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '0 96px',
          // 与站点主题渐变同值（--grad-brand-solid）
          backgroundImage: 'linear-gradient(100deg, #2a566f 0%, #3a79a2 100%)',
          color: '#ffffff',
        }}
      >
        <div style={{ fontSize: 96, fontWeight: 700, letterSpacing: '0.06em' }}>
          NIIJIMA
        </div>
        <div style={{ fontSize: 34, opacity: 0.85, marginTop: 8 }}>
          NIIJIMA KOUTSU CO., LTD.
        </div>
        <div
          style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid rgba(255,255,255,0.35)',
            fontSize: 40,
            fontWeight: 600,
          }}
        >
          Medical Tourism · Golf · Business Inspection in Japan
        </div>
      </div>
    ),
    size
  );
}
