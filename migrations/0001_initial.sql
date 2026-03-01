-- TrainHub 初始数据库 Schema
-- Migration: 0001_initial.sql
-- Created: 2026-03-01

-- Categories
CREATE TABLE IF NOT EXISTS categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,
  description TEXT
);

-- Trainers
CREATE TABLE IF NOT EXISTS trainers (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  title TEXT,
  bio TEXT,
  avatar_url TEXT,
  years_experience INTEGER,
  specialties TEXT,
  city TEXT,
  rating REAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  contact_email TEXT,
  contact_phone TEXT,
  wechat_id TEXT,
  featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now'))
);

-- Courses
CREATE TABLE IF NOT EXISTS courses (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  trainer_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  outline TEXT,
  duration TEXT,
  target_audience TEXT,
  max_participants INTEGER,
  price_range TEXT,
  category_id INTEGER,
  featured INTEGER DEFAULT 0,
  status TEXT DEFAULT 'active',
  created_at TEXT DEFAULT (datetime('now')),
  updated_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id),
  FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Inquiries
CREATE TABLE IF NOT EXISTS inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  course_id INTEGER,
  trainer_id INTEGER,
  company_name TEXT NOT NULL,
  contact_name TEXT NOT NULL,
  contact_email TEXT,
  contact_phone TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending',
  created_at TEXT DEFAULT (datetime('now')),
  FOREIGN KEY (course_id) REFERENCES courses(id),
  FOREIGN KEY (trainer_id) REFERENCES trainers(id)
);

-- Seed categories
INSERT INTO categories (name, slug, icon, description) VALUES
  ('领导力', 'leadership', '👑', '管理者领导力提升、团队管理、决策能力'),
  ('销售技巧', 'sales', '💼', '销售谈判、客户关系管理、成交技巧'),
  ('数字化转型', 'digital', '🚀', '企业数字化、AI应用、数据驱动决策'),
  ('人力资源', 'hr', '👥', '招聘面试、绩效管理、组织发展'),
  ('财务管理', 'finance', '📊', '财务分析、预算管理、风险控制'),
  ('沟通表达', 'communication', '🎤', '演讲技巧、商务沟通、跨部门协作');

-- Seed trainers
INSERT INTO trainers (name, title, bio, years_experience, specialties, city, rating, review_count, featured, contact_email) VALUES
  ('张明远', '领导力发展专家', '前世界500强企业大学院长，20年企业培训经验。专注于中高层管理者领导力提升，曾为超过200家企业提供内训服务。', 20, '["领导力","团队管理","战略思维"]', '上海', 4.9, 156, 1, 'zhang@example.com'),
  ('李静雯', '销售实战教练', '连续10年销售冠军，从一线销售到销售总监的实战派。擅长将复杂的销售理论转化为可落地的行动方案。', 15, '["销售技巧","客户管理","谈判策略"]', '北京', 4.8, 203, 1, 'li@example.com'),
  ('王思远', '数字化转型顾问', '前阿里巴巴技术总监，专注企业数字化转型咨询与培训。帮助传统企业理解和应用AI、大数据等新技术。', 12, '["数字化转型","AI应用","数据分析"]', '杭州', 4.7, 89, 1, 'wang@example.com'),
  ('陈晓华', '人力资源管理专家', '国家一级人力资源管理师，曾任多家上市公司HRD。擅长组织诊断、人才发展体系建设。', 18, '["人力资源","组织发展","人才盘点"]', '深圳', 4.8, 134, 0, 'chen@example.com'),
  ('刘建国', '财务管理培训师', '注册会计师、注册税务师，前四大会计师事务所合伙人。专注非财务人员的财务管理培训。', 16, '["财务管理","税务筹划","风险控制"]', '广州', 4.6, 78, 0, 'liu@example.com'),
  ('赵雅琴', '职场沟通专家', '国际认证引导师(CPF)，即兴戏剧培训师。将戏剧技巧融入职场沟通培训，风格生动有趣。', 10, '["沟通表达","演讲技巧","团队协作"]', '成都', 4.9, 167, 1, 'zhao@example.com');

-- Seed courses
INSERT INTO courses (trainer_id, title, description, outline, duration, target_audience, max_participants, price_range, category_id, featured) VALUES
  (1, '卓越领导力修炼营', '为期两天的沉浸式领导力培训，帮助中层管理者完成从"管事"到"管人"的转变。', '["Day 1: 领导力自我认知与诊断", "模块1: 领导力风格测评", "模块2: 情境领导力模型", "模块3: 团队诊断工具", "Day 2: 领导力实践与提升", "模块4: 教练式辅导技巧", "模块5: 高效授权与反馈", "模块6: 个人领导力发展计划"]', '2天(12小时)', '中层管理者、新晋经理', 30, '30000-50000', 1, 1),
  (2, '顾问式销售实战训练', '从产品推销到价值顾问的转型课程，大量实战案例和角色扮演练习。', '["模块1: 顾问式销售的底层逻辑", "模块2: 客户需求深度挖掘(SPIN)", "模块3: 价值主张设计与呈现", "模块4: 异议处理与成交技巧", "模块5: 大客户关系管理", "模块6: 实战模拟与复盘"]', '2天(12小时)', 'B2B销售团队、销售经理', 25, '25000-40000', 2, 1),
  (3, 'AI时代企业数字化转型路线图', '帮助企业管理层理解AI技术趋势，制定切实可行的数字化转型策略。', '["模块1: AI技术全景与企业应用", "模块2: 数字化转型成熟度评估", "模块3: 数据驱动决策框架", "模块4: AI落地场景识别与优先级", "模块5: 转型路线图制定工作坊", "模块6: 变革管理与组织能力建设"]', '1天(6小时)', '企业高管、CTO、数字化负责人', 40, '40000-60000', 3, 1),
  (4, '战略性人才盘点与继任计划', '系统化的人才盘点方法论，帮助HR建立科学的人才管理体系。', '["模块1: 人才盘点的战略价值", "模块2: 胜任力模型构建", "模块3: 360度评估实施", "模块4: 九宫格人才地图", "模块5: 继任计划设计", "模块6: 人才发展IDP制定"]', '1天(6小时)', 'HR总监、HRBP、人才发展经理', 35, '20000-35000', 4, 0),
  (5, '非财务经理的财务管理', '用通俗易懂的语言让业务经理掌握必备的财务知识和工具。', '["模块1: 读懂三张财务报表", "模块2: 成本分析与利润管理", "模块3: 预算编制与执行", "模块4: 经营数据分析", "模块5: 投资决策基础", "模块6: 税务风险防范"]', '1天(6小时)', '业务部门经理、项目负责人', 40, '15000-25000', 5, 0),
  (6, '高效职场沟通与影响力', '融合即兴戏剧和心理学的创新沟通课程，在体验中提升沟通能力。', '["模块1: 沟通风格自我诊断", "模块2: 深度倾听与共情回应", "模块3: 即兴表达训练", "模块4: 跨部门协作沟通", "模块5: 向上管理与汇报技巧", "模块6: 冲突管理与化解"]', '1天(6小时)', '全员（尤其适合跨部门协作频繁的团队）', 30, '18000-30000', 6, 1),
  (1, '新任经理90天成长计划', '专为新晋管理者设计的实战课程，帮助顺利完成角色转型。', '["模块1: 从专家到管理者的思维转变", "模块2: 团队组建与人员配置", "模块3: 目标设定与绩效管理", "模块4: 向上管理与资源获取", "模块5: 90天行动计划制定"]', '1天(6小时)', '新任经理、高潜人才', 25, '20000-35000', 1, 0),
  (3, '企业AI应用实战工作坊', '动手实操的AI应用工作坊，让团队真正学会使用AI工具提升效率。', '["模块1: AI工具全景图", "模块2: ChatGPT/Claude高级提示工程", "模块3: AI辅助文档与报告写作", "模块4: AI辅助数据分析", "模块5: 团队AI应用场景设计", "模块6: AI使用规范与安全"]', '1天(6小时)', '全员', 30, '25000-40000', 3, 1);
