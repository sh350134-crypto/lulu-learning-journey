/* global window */
(() => {
  window.AlphaTrackerChapters = {
    project: {
      id: "alphatracker",
      title: "AlphaTracker AI",
      subtitle: "動能交易 AI 決策中台",
    },
    chapters: [
      {
        id: "CH 01",
        title: "專案起點",
        modules: [
          {
            title: "為什麼做這個專案",
            coreConcept: "短線交易的決策成敗，取決於[[數據即時性]]與[[邏輯紀律性]]。",
            paragraphs: [
              "同時為對接年底 AI 架構師職位，需要一個能實踐 [[MCP]]、[[Agentic Workflow]] 與[[時序型 RAG]] 的實戰專案。",
            ],
          },
          {
            title: "原始企劃書核心",
            coreConcept: "建立[[純數據驅動]]的 AI 決策支援系統，並用協定把 AI 與即時金融指標接上。",
            paragraphs: [
              "透過 MCP 協定打通 AI 與即時金融指標的屏障，利用 [[Multi-Agent 對審]] 機制抑制交易偏誤。",
              "目標：優化短線交易勝率，產出高技術門檻的 AI 架構師履歷作品。",
            ],
          },
          {
            title: "可行性評估",
            coreConcept: "整體可行，但複雜度分層明顯；風險集中在[[數據來源]]與[[勝率驗證]]。",
            paragraphs: [
              "最大風險：數據來源（籌碼面）、RAG 勝率驗證的統計限制。",
              "最終決策：以舊專案為基礎擴充，而非新建專案。",
            ],
          },
        ],
      },
      {
        id: "CH 02",
        title: "架構設計",
        modules: [
          {
            title: "從手繪到正式架構",
            coreConcept: "從 4 層手繪圖演化為 5 層正式架構，讓責任邊界更清楚。",
            paragraphs: [
              "初版手繪圖定義四層架構，經過討論後演化為五層架構：",
              "[[數據整合層]] → [[策略情境層]] → [[決策層]] → [[生成層]] → [[前台層]]",
            ],
          },
          {
            title: "五層架構說明",
            coreConcept: "把「拿數據、選情境、做決策、生成解讀、呈現」拆成可獨立演進的五層。",
            paragraphs: [
              "數據整合層：MCP Server + 三個工具（scan_market / get_technicals / get_chip_data）",
              "策略情境層：7 個情境 + 情境偵測 Agent + 策略路由器",
              "決策層：時序型 RAG + Multi-Agent 對審",
              "生成層：交易決策建議 + 今日局勢解讀",
              "前台層：三個頁面（策略總覽 / RAG相似度分析 / 架構師儀表板）",
            ],
          },
          {
            title: "關鍵設計決策",
            coreConcept: "優先做「可驗證」與「可擴充」的決策，避免過早優化。",
            paragraphs: [
              "決策一：Cursor 而非 Claude Code → 省 token 費用，開發期約 $20/月",
              "決策二：yfinance 而非 Fugle → 先驗證邏輯，後升級數據源",
              "決策三：Supabase pgvector 而非 ChromaDB → 現有 DB 直接擴充",
              "決策四：EOD 快照模式 → 解決數據時間點不一致問題",
            ],
          },
        ],
      },
      {
        id: "CH 03",
        title: "Phase 1：MCP Server",
        modules: [
          {
            title: "MCP 是什麼（白話文）",
            coreConcept: "MCP 讓 AI 從[[被動回答]]變成[[主動行動]]：先拿到真實數字，再做判斷。",
            paragraphs: [
              "以前：你問 AI，AI 用訓練資料回答。",
              "有了 MCP：AI 自己去抓即時數據，拿到真實數字後才給建議。",
              "就像給 AI 裝了眼睛和手。",
            ],
          },
          {
            title: "三個工具的設計",
            coreConcept: "把常用任務封裝成三個工具，讓上層 Agent 只要做策略與推理。",
            paragraphs: [
              "scan_market()：掃描全市場，找符合條件的標的",
              "get_technicals()：取得單一股票技術指標（RSI/MA/Bias）",
              "get_chip_data()：取得籌碼數據（法人買賣超/融資）",
            ],
            code:
              "Tools:\n- scan_market()\n- get_technicals(ticker)\n- get_chip_data(ticker)\n",
          },
          {
            title: "遇到的問題與解法",
            coreConcept: "把「資料格式」與「計算流程」的坑一次踩完，建立穩定輸出。",
            paragraphs: [
              "問題一：JSONDecodeError → Claude 回傳 markdown 格式，需先去掉 backtick 再解析",
              "問題二：scan_market RSI 全部 null → 沒有對每支股票跑 calculate_indicators()",
              "問題三：chip_score 全部 50 → FinMind token 無效，fallback 到預設值",
              "問題四：輸出格式多段 part → 改成單一 JSON array",
            ],
          },
        ],
      },
      {
        id: "CH 04",
        title: "Phase 2：策略情境層",
        modules: [
          {
            title: "為什麼需要策略層",
            coreConcept: "先判斷[[市場情境]]再選策略，避免「一套條件打天下」。",
            paragraphs: [
              "以前 scan_market 是固定邏輯，不管市場狀況都用同一套篩選條件。",
              "策略層讓系統先判斷市場情境，再選對應的篩選邏輯。",
              "就像給系統裝了一個「市場判斷大腦」。",
            ],
          },
          {
            title: "7 個情境",
            coreConcept: "用一組可擴充的情境字典，把策略決策變成可管理的路由問題。",
            paragraphs: [
              "趨勢動能：大盤多頭，找強勢股",
              "突破新高：長期盤整後突破",
              "二次突破：強勢股整理後再突破",
              "除息佈局：除息日前法人持續買",
              "極端爆量：RVOL ≥ 2，籌碼鎖死",
              "回檔進場：強勢股回測均線",
              "防禦避險：大盤跌破季線",
            ],
          },
          {
            title: "做法 C 的設計",
            coreConcept: "固定邏輯 + 自動偵測 + 手動覆寫：同時兼顧[[穩定]]與[[智能]]。",
            paragraphs: [
              "情境庫（固定邏輯）+ 動態偵測（自動選）+ 手動 Override（使用者切換）",
              "三者結合，既穩定又智能。",
            ],
          },
        ],
      },
      {
        id: "CH 05",
        title: "Phase 3：時序型 RAG",
        modules: [
          {
            title: "RAG 是什麼（白話文）",
            coreConcept: "RAG = 給 AI 裝[[記憶]]：先查歷史相似情境，再生成建議。",
            paragraphs: [
              "不是讓 AI 憑空說「這支股票不錯」，而是先查歷史：",
              "「過去出現相同技術型態時，後來漲超過 5% 的比例是多少」",
              "用歷史數據說話，而不是感覺。",
            ],
          },
          {
            title: "向量化設計",
            coreConcept: "把每個時間點轉成 7 維向量，讓系統可做[[相似度搜尋]]與統計回測。",
            paragraphs: [
              "每個歷史時間點轉成 7 維向量：RSI / Bias / 量能 / MACD / MA排列 / smart_money / 籌碼信心",
              "帶標註：後 10 日最高漲幅 + 是否達到 5% 目標",
            ],
          },
          {
            title: "遇到的問題與解法",
            coreConcept: "資料量與環境載入是兩大坑；先解[[覆蓋率]]與[[可重現性]]。",
            paragraphs: [
              "問題一：backfill 全部 skip → tracked_stocks 只有 11 支，改用台股前 50 大",
              "問題二：找不到 .env → 加入明確的路徑載入邏輯",
              "問題三：chip_score 全部 50 → FinMind token 問題，修正後正常",
            ],
          },
        ],
      },
      {
        id: "CH 06",
        title: "Phase 4：Multi-Agent 對審",
        modules: [
          {
            title: "為什麼要對審",
            coreConcept: "用正反辯論抑制偏誤：[[Pro-Bullish]] 找理由、[[Risk Contrarian]] 找風險、[[Arbitrator]] 做裁決。",
            paragraphs: [
              "單一 AI 給答案容易有偏誤，就像只聽一個人的意見。",
              "對審機制讓兩個 AI 角色辯論，最後由仲裁者整合，給出最終建議。",
            ],
          },
          {
            title: "遇到的問題與解法",
            coreConcept: "對審要能穩定輸出：先解決[[token 截斷]]、[[評分公式]]、[[編碼]]三個點。",
            paragraphs: [
              "問題一：Risk Contrarian JSON 被截斷 → max_tokens 從 320 提高到 1000",
              "問題二：final_score 公式偏向負面 → 改用 bull × 0.6 + (100-risk) × 0.4",
              "問題三：UnicodeEncodeError → 改用 UTF-8 bytes 輸出",
            ],
            code:
              "Old: final_score = bull * 0.6 - risk * 0.4\nNew: final_score = bull * 0.6 + (100 - risk) * 0.4\n",
          },
        ],
      },
      {
        id: "CH 07",
        title: "Phase 5：前台層",
        modules: [
          {
            title: "三個核心頁面",
            coreConcept: "用前台把複雜系統拆成 3 個可理解的入口：[[策略]]、[[相似度]]、[[儀表板]]。",
            paragraphs: [
              "策略總覽（/strategy）：7 個情境掃描 + 推薦排名",
              "RAG相似度分析（/similar）：輸入大漲股，找相似潛力股",
              "架構師儀表板（/architect）：MCP 流程圖 + 五層架構圖（履歷用）",
            ],
          },
          {
            title: "DecisionModal 設計",
            coreConcept: "把交易決策濃縮成一個 Modal：即時資訊 + AI 結論 + 劇本 + 指標標籤。",
            paragraphs: [
              "點擊「交易劇本」彈出 Modal，顯示：即時股價 + 漲跌幅、AI 交易導師結論（最終決策 + 三區塊分析）、交易劇本 A/B（進場/停損/目標/風報比）、指標標籤（ATR / RVOL / 支撐壓力 / 財報倒數）。",
            ],
          },
          {
            title: "資料一致性問題的根本解法",
            coreConcept: "用[[EOD 快照模式]]統一計算性數值的時間點，避免「目標價 < 現價」矛盾。",
            paragraphs: [
              "問題：多個 API 數據時間點不同，導致「目標價 < 現價」矛盾",
              "解法：EOD 快照模式（decision-snapshot 端點）",
              "所有計算性數值統一用同一交易日的數據；即時股價另外顯示，標示「即時參考價」",
            ],
          },
        ],
      },
      {
        id: "CH 08",
        title: "部署挑戰",
        modules: [
          {
            title: "Railway Root Directory 問題",
            coreConcept: "部署設定要跟 repo 結構一致；Root Directory 設錯會讓 import 直接失效。",
            paragraphs: [
              "原設定：Root Directory = backend/",
              "問題：mcp/ 目錄不在部署範圍，import 失敗",
              "解法：Root Directory 改為空白，用 Procfile 指定 cd backend 再啟動",
            ],
          },
          {
            title: "Railpack 找不到進入點",
            coreConcept: "平台需要明確判斷專案型態；根目錄缺少 requirements.txt 會導致偵測失敗。",
            paragraphs: [
              "問題：根目錄沒有 requirements.txt，Railpack 不認識這是 Python 專案",
              "解法：在根目錄建立 requirements.txt（內容複製自 backend/requirements.txt）和 Procfile（指定啟動指令）",
            ],
          },
          {
            title: "sys.path 問題",
            coreConcept: "部署後工作目錄不同，必須手動修正 module search path。",
            paragraphs: [
              "問題：Railway 工作目錄是 /app/backend/，但 mcp/ 在 /app/",
              "解法：在 main.py 最頂部加入 sys.path.insert(...)",
            ],
            code:
              'import os, sys\nsys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))\n',
          },
        ],
      },
      {
        id: "CH 09",
        title: "學習曲線記錄",
        modules: [
          {
            title: "認知轉變時間軸",
            coreConcept: "用時間軸記錄「從不知道到掌握」的關鍵跳點，讓成長可被驗證。",
            paragraphs: [
              "第 1 天：不知道 MCP 是什麼 → 理解 MCP 讓 AI 主動調用工具",
              "第 3 天：不知道 RAG 怎麼做 → 理解向量化 + 相似度搜尋",
              "第 5 天：不知道 Multi-Agent 怎麼設計 → 理解正反辯論 + 仲裁",
              "第 2 週：不知道怎麼部署 → 解決 Railway 路徑問題",
            ],
          },
          {
            title: "關鍵決策點",
            coreConcept: "把 CH 02 的決策延伸成「為什麼」：取捨邏輯比結果更重要。",
            paragraphs: ["（同 CH 02 模組三，這裡可以更詳細說明每個決策的思考過程）"],
          },
          {
            title: "失敗案例集",
            coreConcept: "重複出現的錯誤是系統性問題訊號：要把它固化成檢查清單。",
            paragraphs: [
              "chip_score 全部 50（三次出現同樣問題）",
              "風報比 0.00（公式邏輯錯誤）",
              "Railway Root Directory 設錯（花了最多時間 debug）",
              "數據時間點不一致（需要架構層面的根本解法）",
            ],
          },
        ],
      },
      {
        id: "CH 10",
        title: "AI 協作方式",
        modules: [
          {
            title: "分工原則",
            coreConcept: "把 AI 當成工程加速器：[[代碼/文件/除錯]]交給 AI，[[交易判斷/決策]]由人拍板。",
            paragraphs: [
              "AI 負責：寫程式碼、生成初版邏輯、debug、文件",
              "你負責：交易邏輯判斷、拍板決策、測試結果、方向調整",
            ],
          },
          {
            title: "如何下 Prompt",
            coreConcept: "高品質輸入 = 高品質輸出：先描述問題，再描述期望結果，遇到 bug 就貼完整錯誤。",
            paragraphs: [
              "先描述問題，再描述期望結果",
              "遇到 bug 把完整錯誤訊息貼上",
              "重大修改前先請 AI 說明計畫，確認後再動工",
            ],
          },
          {
            title: "成本追蹤",
            coreConcept: "用數字管理成本：工具選型直接影響 token 與開發期花費。",
            paragraphs: [
              "預估：開發期 USD $85-112",
              "實際：Cursor Pro $20/月 × 開發月數 + Claude API 少量",
              "結論：比預估省，因為 Cursor 大幅減少了 API 呼叫",
            ],
          },
        ],
      },
      {
        id: "CH 11",
        title: "技術名詞白話文",
        modules: [
          {
            title: "MCP（Model Context Protocol）",
            coreConcept: "讓 AI 可以[[主動去外部拿數據]]的協定，就像給 AI 裝上一支手。",
            paragraphs: ["讓 AI 可以自己去查資料，而不是只靠訓練資料回答。"],
          },
          {
            title: "RAG（Retrieval-Augmented Generation）",
            coreConcept: "先查歷史記憶，再生成答案；像考試前先翻筆記。",
            paragraphs: ["重點是「先取回」再「生成」，避免憑空作答。"],
          },
          {
            title: "Multi-Agent",
            coreConcept: "多個角色各司其職、互相制衡；像公司正反方辯論。",
            paragraphs: ["最後由仲裁者（或主管）整合，輸出可落地的結論。"],
          },
          {
            title: "向量資料庫",
            coreConcept: "把複雜特徵轉成數字陣列，才能計算[[相似度]]。",
            paragraphs: [
              "把股票指標轉成向量，就能找「型態最像」的歷史情境。",
              "就像把每首歌轉成頻率圖，找最相似的歌。",
            ],
          },
        ],
      },
      {
        id: "CH 12",
        title: "成果展示",
        modules: [
          {
            title: "系統架構圖（截圖）",
            coreConcept: "用視覺化把系統複雜度降維，讓讀者一眼理解全貌。",
            paragraphs: ["（此處可放你的架構圖截圖與說明）"],
          },
          {
            title: "網站截圖（各頁面）",
            coreConcept: "用截圖呈現「能跑起來」的證據，對履歷與面試特別有效。",
            paragraphs: ["（此處可放策略總覽 / similar / architect 的頁面截圖）"],
          },
          {
            title: "網站連結",
            coreConcept: "把成果做成可點擊連結，讓展示更直接。",
            paragraphs: ["https://trading-system-beta-bice.vercel.app"],
          },
        ],
      },
    ],
  };
})();

