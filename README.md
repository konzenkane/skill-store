# 🦞 AI龙虾技能严选

> **真正的长期记忆管理技能，让AI从聊天机器人变成有记忆的助手**
> 
> **Created by:** 天道桐哥 (Human Creator) & AI龙虾元龙 (AI Creator)

---

## 🚀 快速开始

### 安装依赖

```bash
npm install
```

### 启动服务器

```bash
npm start
# 或
node server-lite/index.js
```

服务器运行在 `http://localhost:3000`

### 访问网站

打开 `client/index.html` 或部署到静态服务器

---

## 📁 目录结构

```
.
├── client/
│   └── index.html          # Vue 3 前端
├── server-lite/
│   ├── index.js           # Express 后端
│   ├── crawler.js         # 技能爬虫
│   ├── data/
│   │   └── skills.json    # 技能数据
│   └── downloads/
│       └── lobster-memory-skill-v1.0.0.tar.gz  # 🦞 可下载技能
├── package.json
└── README.md
```

---

## 🦞 龙虾记忆大师技能

**中文名：** 龙虾记忆大师  
**英文名：** lobster-memory  
**评分：** ⭐ 10/10  
**下载：** 点击网站上的"立即下载"按钮

**功能：**
- ✅ 自动记忆维护
- ✅ 每日学习日志
- ✅ 心跳协议
- ✅ 工作缓冲区管理

**安装方法：**
```bash
# 1. 下载 skill-store-website-complete.tar.gz
# 2. 解压
tar -xzf skill-store-website-complete.tar.gz

# 3. 安装技能到 OpenClaw
tar -xzf server-lite/downloads/lobster-memory-skill-v1.0.0.tar.gz -C ~/.openclaw/skills/

# 4. 重启 OpenClaw
```

---

## 🌐 部署到 GitHub Pages

### 前端部署

```bash
# 1. 创建 GitHub 仓库
# 2. 上传 client/index.html 到仓库根目录
# 3. Settings → Pages → Source: main branch
# 4. 访问 https://你的用户名.github.io/仓库名/
```

### 后端部署（Vercel/Render）

```bash
# Vercel
npm i -g vercel
vercel --prod

# Render
# 连接 GitHub 仓库，自动部署
```

---

## 📊 API 接口

| 接口 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/skills/trending` | GET | 热门榜单 |
| `/api/skills/featured` | GET | 严选推荐 |
| `/api/skills/search?q=关键词` | GET | 搜索技能 |
| `/api/skills/download/:name` | GET | 下载技能 |
| `/api/crawler/run` | POST | 触发爬虫 |

---

## 🕷️ 自动更新

爬虫每小时自动运行，抓取最新技能。

手动触发：
```bash
curl -X POST http://localhost:3000/api/crawler/run
```

---

## 📝 备注

**本网站及龙虾记忆大师技能由天道桐哥（Human Creator）与 AI龙虾元龙（AI Creator）共同完成** 🦞

---

## 📄 License

MIT License
