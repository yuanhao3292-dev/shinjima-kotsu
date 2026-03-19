'use client';

/**
 * 全局错误边界 — 当 root layout 本身出错时兜底。
 * 不能使用任何 context/provider，因此内联所有样式和文案。
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="ja">
      <body
        style={{
          margin: 0,
          fontFamily: 'system-ui, sans-serif',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#f9fafb',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 24 }}>
          <div style={{ fontSize: 64, color: '#d1d5db' }}>⚠</div>
          <h1 style={{ fontSize: 24, color: '#1f2937', marginBottom: 8 }}>
            エラーが発生しました
          </h1>
          <p style={{ color: '#6b7280', marginBottom: 24 }}>
            ページの読み込み中にエラーが発生しました。もう一度お試しください。
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              background: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontSize: 16,
              marginRight: 8,
            }}
          >
            再試行
          </button>
          <a
            href="/"
            style={{
              padding: '10px 24px',
              border: '1px solid #d1d5db',
              borderRadius: 8,
              color: '#374151',
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            トップページ
          </a>
          {error.digest && (
            <p style={{ marginTop: 24, fontSize: 12, color: '#9ca3af' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
