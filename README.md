# 新島交通 B2B Portal (SHINJIMA)

## 📸 图片素材设置指南 (Image Assets)

本项目支持本地图片加载，若图片缺失将自动降级显示 Unsplash 网络图。
为了在 GitHub 或生产环境中显示定制化品牌图片，请在项目根目录创建 `images/` 文件夹，并上传以下文件：

### 必须上传的文件清单 (文件名区分大小写)

| 文件名 | 用途 | 建议尺寸 |
|--------|------|----------|
| `timc_lobby.jpg` | TIMC 医疗页面的顶部大图 (Hero) | 1920x1080px |
| `timc_building.jpg` | JP Tower / KITTE 外观图 | 1000x800px |
| `timc_room.jpg` | VIP 贵宾室内部图 | 1000x800px |
| `timc_petct.jpg` | PET-CT 或 MRI 设备图 | 800x600px |

### 📂 目录结构示例

```text
/ (项目根目录)
├── index.html
├── index.tsx
├── ...
└── images/          <-- 请创建此文件夹
    ├── timc_lobby.jpg
    ├── timc_building.jpg
    ├── timc_room.jpg
    └── timc_petct.jpg
```

## 🚀 部署说明 (GitHub Pages)

由于代码中使用了相对路径 (`src="images/..."`)，本网站完全兼容 GitHub Pages。
只要 `images` 文件夹与 `index.html` 位于同一层级，上传后即可直接访问。
