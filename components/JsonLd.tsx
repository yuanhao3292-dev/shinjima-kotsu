/**
 * 渲染一段 JSON-LD。
 *
 * 用 JSON.stringify 而不是手写字符串：结构化数据里含中文与引号，
 * 手写模板极易产出非法 JSON，而 Google 对解析失败的块是整块丢弃。
 * 再把 `<` 转义掉，防止数据里出现 </script> 提前闭合标签。
 */
export default function JsonLd({ data }: { data: object | object[] }) {
  const json = JSON.stringify(data).replace(/</g, '\\u003c');
  return (
    <script
      type="application/ld+json"
      // 内容由本仓库构造，非用户输入
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
