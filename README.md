# Lulu 自學旅程（GitHub Pages 靜態站）

純 HTML + CSS + JavaScript 的靜態網站，包含登入頁、主題清單頁，以及 `AlphaTracker AI` 主題內頁（章節導覽 + 可收合模組）。

## 檔案結構

```
/
├── index.html              # 登入頁（密碼：LULU2024，可自行改）
├── topics.html             # 主題清單頁
├── alphatracker/
│   ├── index.html          # AlphaTracker AI 內頁
│   └── chapters.js         # 12 章內容（JS 物件）
└── assets/
    ├── style.css           # 全站樣式（含 RWD）
    └── auth.js             # localStorage 登入驗證（12 小時有效）
```

## 本機預覽

- 直接用瀏覽器開 `index.html` 也可運作（純前端）。
- 若你希望更像部署環境，可用任意靜態伺服器（例如 VSCode Live Server）。

## GitHub Pages 部署

1. 建立 GitHub repo：`lulu-learning-journey`
2. 把本專案所有檔案推到 repo 根目錄（root）
3. 到 GitHub 專案頁：
   - `Settings` → `Pages`
   - `Build and deployment`
   - `Source`: `Deploy from a branch`
   - `Branch`: `main` / `(root)`
4. 等待部署完成後即可用 GitHub Pages 網址開啟

## 說明

- 登入狀態記錄在 `localStorage`，同裝置 12 小時內免登入
- `topics.html` 的進度條會讀取 `alphatracker:completed:CH 01` 這類 key 計算完成章節數
- 在 `alphatracker/index.html` 內可「標記本章完成 / 取消完成」

