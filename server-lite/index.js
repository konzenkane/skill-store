// 轻量级服务器 - 无数据库依赖
const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');
const cheerio = require('cheerio');

const app = express();
const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'skills.json');

// 内存数据
let skillsData = [];

// 中间件
app.use(cors());
app.use(express.json());

// 加载数据
async function loadData() {
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    const data = await fs.readFile(DATA_FILE, 'utf8');
    skillsData = JSON.parse(data);
    console.log(`✅ 加载 ${skillsData.length} 个技能`);
  } catch {
    console.log('📝 使用初始数据');
    skillsData = getInitialData();
    await saveData();
  }
}

// 保存数据
async function saveData() {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(skillsData, null, 2));
}

// 初始数据
function getInitialData() {
  return [
    {
      name: 'brochure-design-generation',
      nameCn: '宣传册设计生成器',
      icon: '🎨',
      author: 'eachlabs',
      stars: 67,
      downloads: 1200,
      desc: '自动生成专业宣传册设计图，适合营销物料',
      url: 'https://skills.sh/eachlabs/skills/brochure-design-generation',
      source: 'clawhub',
      category: 'design',
      isFeatured: true,
      featuredBy: '桐哥严选',
      reviewScore: 9.5
    },
    {
      name: 'flyer-design-generation',
      nameCn: '海报传单设计器',
      icon: '📄',
      author: 'eachlabs',
      stars: 59,
      downloads: 980,
      desc: '营销海报一键生成，多模板可选',
      url: 'https://skills.sh/eachlabs/skills/flyer-design-generation',
      source: 'clawhub',
      category: 'design'
    },
    {
      name: 'promotion-doc-designer',
      nameCn: '推广文档设计师',
      icon: '🎯',
      author: 'huyansheng3',
      stars: 31,
      downloads: 450,
      desc: 'PPT风格的营销文档设计',
      url: 'https://skills.sh/huyansheng3/ppt-skills/promotion-doc-designer',
      source: 'clawhub',
      category: 'marketing'
    },
    {
      name: 'wechat-red-envelope-cover-designer',
      nameCn: '微信红包封面设计',
      icon: '🧧',
      author: 'wuchubuzai2018',
      stars: 18,
      downloads: 890,
      desc: '定制微信红包封面图',
      url: 'https://skills.sh/wuchubuzai2018/expert-skills-hub/wechat-red-envelope-cover-designer',
      source: 'clawhub',
      category: 'design'
    },
    {
      name: 'xiaohongshu-skills',
      nameCn: '小红书创作工具集',
      icon: '📱',
      author: 'vivy-yi',
      stars: 45,
      downloads: 2100,
      desc: '小红书内容创作工具合集',
      url: 'https://skills.sh/vivy-yi/xiaohongshu-skills',
      source: 'clawhub',
      category: 'marketing'
    },
    {
      name: 'stable-design',
      nameCn: 'Stable Diffusion设计',
      icon: '🖼️',
      author: 'vivy-yi',
      stars: 17,
      downloads: 320,
      desc: 'AI图像生成设计工具',
      url: 'https://skills.sh/vivy-yi/xiaohongshu-skills/stable-design',
      source: 'clawhub',
      category: 'ai'
    }
  ];
}

// 简单爬虫
async function crawlClawHub() {
  console.log('🦞 开始抓取 ClawHub...');
  
  try {
    // 模拟抓取（实际抓取需要处理反爬）
    const newSkills = [
      {
        name: 'canva-design',
        nameCn: 'Canva设计助手',
        icon: '✨',
        author: 'canva-team',
        stars: 89,
        downloads: 3400,
        desc: 'Canva设计模板快速生成',
        url: 'https://skills.sh/canva/canva-design',
        source: 'clawhub',
        category: 'design'
      }
    ];
    
    // 合并去重
    for (const skill of newSkills) {
      const exists = skillsData.find(s => s.name === skill.name);
      if (!exists) {
        skillsData.push(skill);
        console.log(`➕ 新增技能: ${skill.nameCn}`);
      }
    }
    
    await saveData();
    console.log(`✅ 抓取完成，共 ${skillsData.length} 个技能`);
    return newSkills;
    
  } catch (err) {
    console.error('❌ 抓取失败:', err.message);
    throw err;
  }
}

// API路由

// 获取热榜
app.get('/api/skills/trending', async (req, res) => {
  const { limit = 10, category } = req.query;
  
  let result = skillsData;
  if (category && category !== 'all') {
    result = result.filter(s => s.category === category);
  }
  
  result = result
    .sort((a, b) => b.stars - a.stars)
    .slice(0, parseInt(limit));
  
  res.json({
    success: true,
    data: result,
    count: result.length
  });
});

// 获取严选
app.get('/api/skills/featured', async (req, res) => {
  const featured = skillsData
    .filter(s => s.isFeatured)
    .sort((a, b) => b.reviewScore - a.reviewScore);
  
  res.json({
    success: true,
    data: featured
  });
});

// 搜索
app.get('/api/skills/search', async (req, res) => {
  const { q } = req.query;
  if (!q) {
    return res.status(400).json({ success: false, error: '请输入搜索关键词' });
  }
  
  const results = skillsData.filter(s => 
    s.name.includes(q) ||
    s.nameCn?.includes(q) ||
    s.desc?.includes(q)
  );
  
  res.json({
    success: true,
    data: results
  });
});

// 触发爬虫
app.post('/api/crawler/run', async (req, res) => {
  try {
    const newSkills = await crawlClawHub();
    res.json({
      success: true,
      message: '抓取完成',
      data: {
        newCount: newSkills.length,
        totalCount: skillsData.length
      }
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// 健康检查
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    skillsCount: skillsData.length,
    time: new Date().toISOString()
  });
});

// 下载技能文件
app.get('/api/skills/download/:name', async (req, res) => {
  const { name } = req.params;
  const skill = skillsData.find(s => s.name === name);
  
  if (!skill) {
    return res.status(404).json({ success: false, error: '技能不存在' });
  }
  
  // 只有龙虾记忆大师提供本地下载
  if (name === 'lobster-memory') {
    const filePath = path.join(__dirname, 'downloads', 'lobster-memory-skill-v1.0.0.tar.gz');
    
    try {
      await fs.access(filePath);
      res.setHeader('Content-Disposition', 'attachment; filename="lobster-memory-skill-v1.0.0.tar.gz"');
      res.setHeader('Content-Type', 'application/gzip');
      res.sendFile(filePath);
      
      // 增加下载计数
      skill.downloads = (skill.downloads || 0) + 1;
      await saveData();
    } catch {
      res.status(404).json({ success: false, error: '文件不存在' });
    }
  } else {
    // 其他技能返回原始链接
    res.json({
      success: true,
      redirect: skill.url
    });
  }
});

// 启动
async function start() {
  await loadData();
  
  app.listen(PORT, () => {
    console.log(`🦞 AI龙虾技能严选服务器运行中`);
    console.log(`📊 API: http://localhost:${PORT}/api`);
    console.log(`💾 数据文件: ${DATA_FILE}`);
  });
}

start().catch(console.error);
