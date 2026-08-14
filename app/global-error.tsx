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
          background: '#fafaf8',
        }}
      >
        <div style={{ textAlign: 'center', maxWidth: 420, padding: 24 }}>
          <div style={{ fontSize: 64, color: '#d5d1c8' }}>⚠</div>
          <h1 style={{ fontSize: 24, color: '#22455a', marginBottom: 8 }}>
            エラーが発生しました
          </h1>
          <p style={{ color: '#336a8d', marginBottom: 24 }}>
            ページの読み込み中にエラーが発生しました。もう一度お試しください。
          </p>
          <button
            onClick={reset}
            style={{
              padding: '10px 24px',
              background: '#336a8d',
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
              border: '1px solid #d5d1c8',
              borderRadius: 8,
              color: '#22455a',
              textDecoration: 'none',
              fontSize: 16,
            }}
          >
            トップページ
          </a>
          {error.digest && (
            <p style={{ marginTop: 24, fontSize: 12, color: '#6fb4da' }}>
              Error ID: {error.digest}
            </p>
          )}
        </div>
      </body>
    </html>
  );
}
