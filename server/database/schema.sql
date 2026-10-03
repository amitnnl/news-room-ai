-- AI Newsroom & Multi-Platform Social Media Automation Platform
-- Relational MySQL Schema (utf8mb4 for Hindi & Multilingual support)

CREATE DATABASE IF NOT EXISTS social_news_agents CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE social_news_agents;

-- 1. Users and RBAC
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('super_admin', 'editor', 'reporter', 'social_manager', 'video_editor', 'designer', 'fact_checker', 'analyst', 'viewer') NOT NULL DEFAULT 'reporter',
  avatar_url VARCHAR(255) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. News Categories
CREATE TABLE IF NOT EXISTS news_categories (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. News Articles (Core Table)
CREATE TABLE IF NOT EXISTS news_articles (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  slug VARCHAR(500) NOT NULL UNIQUE,
  summary TEXT DEFAULT NULL,
  content LONGTEXT DEFAULT NULL,
  category_id INT DEFAULT NULL,
  status ENUM('draft', 'ai_generated', 'under_review', 'fact_check_pending', 'approved', 'scheduled', 'published', 'rejected') NOT NULL DEFAULT 'draft',
  language VARCHAR(10) NOT NULL DEFAULT 'hi',
  is_breaking BOOLEAN NOT NULL DEFAULT FALSE,
  author_id INT DEFAULT NULL,
  featured_image VARCHAR(500) DEFAULT NULL,
  image_caption VARCHAR(500) DEFAULT NULL,
  image_alt VARCHAR(500) DEFAULT NULL,
  seo_title VARCHAR(500) DEFAULT NULL,
  meta_description VARCHAR(500) DEFAULT NULL,
  seo_keywords TEXT DEFAULT NULL,
  breaking_headline VARCHAR(500) DEFAULT NULL,
  short_headline VARCHAR(300) DEFAULT NULL,
  faq_json JSON DEFAULT NULL,
  key_points_json JSON DEFAULT NULL,
  view_count INT NOT NULL DEFAULT 0,
  published_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_status (status),
  INDEX idx_category (category_id),
  INDEX idx_language (language),
  INDEX idx_is_breaking (is_breaking),
  FOREIGN KEY (category_id) REFERENCES news_categories(id) ON DELETE SET NULL,
  FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. News Sources
CREATE TABLE IF NOT EXISTS news_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  url VARCHAR(500) NOT NULL,
  publisher VARCHAR(150) DEFAULT NULL,
  credibility_score INT DEFAULT 85,
  notes TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. News Research (AI Research Agent Output)
CREATE TABLE IF NOT EXISTS news_research (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  topic VARCHAR(255) NOT NULL,
  raw_summary LONGTEXT DEFAULT NULL,
  key_facts_json JSON DEFAULT NULL,
  entities_json JSON DEFAULT NULL,
  timeline_json JSON DEFAULT NULL,
  confidence_score VARCHAR(50) DEFAULT 'High',
  requires_human_verification BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. Fact Checks (AI Fact Check Agent Output)
CREATE TABLE IF NOT EXISTS fact_checks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  verification_status ENUM('verified', 'caution', 'unverified', 'flagged') NOT NULL DEFAULT 'caution',
  score INT NOT NULL DEFAULT 80,
  verified_claims_json JSON DEFAULT NULL,
  unverified_claims_json JSON DEFAULT NULL,
  warnings_json JSON DEFAULT NULL,
  contradictions_json JSON DEFAULT NULL,
  fact_checker_notes TEXT DEFAULT NULL,
  checked_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (checked_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. News Versions (Audit & History)
CREATE TABLE IF NOT EXISTS news_versions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  content LONGTEXT NOT NULL,
  edited_by INT DEFAULT NULL,
  change_summary VARCHAR(255) DEFAULT 'Automated edit or manual update',
  version_number INT NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE,
  FOREIGN KEY (edited_by) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. Social Connected Accounts
CREATE TABLE IF NOT EXISTS social_accounts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform ENUM('facebook', 'instagram', 'whatsapp', 'youtube', 'telegram', 'twitter') NOT NULL,
  account_name VARCHAR(150) NOT NULL,
  account_id VARCHAR(150) NOT NULL,
  access_token TEXT DEFAULT NULL,
  refresh_token TEXT DEFAULT NULL,
  status ENUM('connected', 'expired', 'disconnected') NOT NULL DEFAULT 'connected',
  config_json JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 9. Social Posts
CREATE TABLE IF NOT EXISTS social_posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT DEFAULT NULL,
  platform ENUM('facebook', 'instagram', 'whatsapp', 'youtube', 'telegram', 'twitter') NOT NULL,
  post_type ENUM('post', 'carousel', 'reel', 'story', 'short', 'broadcast') NOT NULL DEFAULT 'post',
  headline VARCHAR(300) DEFAULT NULL,
  body LONGTEXT NOT NULL,
  media_url VARCHAR(500) DEFAULT NULL,
  hashtags VARCHAR(300) DEFAULT NULL,
  cta VARCHAR(200) DEFAULT NULL,
  status ENUM('draft', 'approved', 'scheduled', 'published', 'failed') NOT NULL DEFAULT 'draft',
  scheduled_at DATETIME DEFAULT NULL,
  published_at DATETIME DEFAULT NULL,
  external_post_id VARCHAR(255) DEFAULT NULL,
  error_log TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  INDEX idx_social_platform (platform),
  INDEX idx_social_status (status),
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 10. Social Post Variants
CREATE TABLE IF NOT EXISTS social_post_variants (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  variant_label VARCHAR(100) NOT NULL,
  content LONGTEXT NOT NULL,
  is_selected BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 11. Social Publish Logs
CREATE TABLE IF NOT EXISTS social_publish_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  post_id INT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  status ENUM('success', 'failed', 'retry') NOT NULL,
  response_payload LONGTEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 12. WhatsApp Campaigns & Broadcasts
CREATE TABLE IF NOT EXISTS whatsapp_campaigns (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  message_type ENUM('breaking', 'daily_digest', 'headline_alert') NOT NULL DEFAULT 'breaking',
  message_text TEXT NOT NULL,
  media_url VARCHAR(500) DEFAULT NULL,
  target_audience VARCHAR(100) DEFAULT 'All Subscribers',
  recipient_count INT DEFAULT 0,
  status ENUM('draft', 'scheduled', 'sent', 'failed') NOT NULL DEFAULT 'draft',
  sent_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 13. YouTube Videos & Scripts
CREATE TABLE IF NOT EXISTS youtube_videos (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT DEFAULT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT DEFAULT NULL,
  tags TEXT DEFAULT NULL,
  script LONGTEXT DEFAULT NULL,
  voiceover_text LONGTEXT DEFAULT NULL,
  scene_list_json JSON DEFAULT NULL,
  format ENUM('short_9_16', 'standard_16_9') NOT NULL DEFAULT 'short_9_16',
  duration_seconds INT DEFAULT 45,
  thumbnail_url VARCHAR(500) DEFAULT NULL,
  video_url VARCHAR(500) DEFAULT NULL,
  status ENUM('scripted', 'rendering', 'ready', 'published', 'failed') NOT NULL DEFAULT 'scripted',
  published_at DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 14. Content Calendar
CREATE TABLE IF NOT EXISTS content_calendar (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  event_type ENUM('article', 'social_post', 'video', 'whatsapp_campaign') NOT NULL,
  platform VARCHAR(50) NOT NULL,
  reference_id INT NOT NULL,
  scheduled_time DATETIME NOT NULL,
  status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 15. AI Agents Configuration
CREATE TABLE IF NOT EXISTS ai_agents (
  id INT AUTO_INCREMENT PRIMARY KEY,
  code VARCHAR(50) NOT NULL UNIQUE,
  name VARCHAR(100) NOT NULL,
  role VARCHAR(100) NOT NULL,
  system_prompt TEXT NOT NULL,
  default_model VARCHAR(50) NOT NULL DEFAULT 'gemini-2.5-flash',
  temperature DECIMAL(3,2) NOT NULL DEFAULT 0.70,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 16. AI Tasks & Runs
CREATE TABLE IF NOT EXISTS ai_tasks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  task_id VARCHAR(64) NOT NULL UNIQUE,
  agent_code VARCHAR(50) NOT NULL,
  input_payload LONGTEXT DEFAULT NULL,
  output_payload LONGTEXT DEFAULT NULL,
  status ENUM('pending', 'running', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  tokens_used INT NOT NULL DEFAULT 0,
  cost_usd DECIMAL(10,5) NOT NULL DEFAULT 0.00000,
  error_message TEXT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  completed_at DATETIME DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 17. RSS Sources & Ingestion
CREATE TABLE IF NOT EXISTS rss_sources (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(100) DEFAULT 'General',
  language VARCHAR(10) DEFAULT 'hi',
  active BOOLEAN NOT NULL DEFAULT TRUE,
  last_checked DATETIME DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 18. RSS Items
CREATE TABLE IF NOT EXISTS rss_items (
  id INT AUTO_INCREMENT PRIMARY KEY,
  source_id INT NOT NULL,
  title VARCHAR(300) NOT NULL,
  link VARCHAR(500) NOT NULL UNIQUE,
  summary TEXT DEFAULT NULL,
  published_date DATETIME DEFAULT NULL,
  is_processed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (source_id) REFERENCES rss_sources(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 19. Trending Topics
CREATE TABLE IF NOT EXISTS trending_topics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  topic VARCHAR(255) NOT NULL,
  trend_score INT NOT NULL DEFAULT 75,
  category VARCHAR(100) DEFAULT 'General',
  source_count INT DEFAULT 1,
  potential_audience VARCHAR(50) DEFAULT '500K+',
  status ENUM('new', 'reviewing', 'in_progress', 'published', 'ignored') NOT NULL DEFAULT 'new',
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 20. Analytics
CREATE TABLE IF NOT EXISTS article_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  article_id INT NOT NULL,
  page_views INT NOT NULL DEFAULT 0,
  unique_visitors INT NOT NULL DEFAULT 0,
  avg_time_seconds INT NOT NULL DEFAULT 60,
  bounce_rate DECIMAL(5,2) NOT NULL DEFAULT 42.50,
  recorded_date DATE NOT NULL,
  FOREIGN KEY (article_id) REFERENCES news_articles(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE IF NOT EXISTS social_analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  platform VARCHAR(50) NOT NULL,
  post_id INT DEFAULT NULL,
  impressions INT NOT NULL DEFAULT 0,
  reach INT NOT NULL DEFAULT 0,
  likes INT NOT NULL DEFAULT 0,
  shares INT NOT NULL DEFAULT 0,
  comments INT NOT NULL DEFAULT 0,
  clicks INT NOT NULL DEFAULT 0,
  recorded_date DATE NOT NULL,
  FOREIGN KEY (post_id) REFERENCES social_posts(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 21. Audit Logs
CREATE TABLE IF NOT EXISTS audit_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT DEFAULT NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50) NOT NULL,
  entity_id INT DEFAULT NULL,
  details TEXT DEFAULT NULL,
  ip_address VARCHAR(45) DEFAULT '127.0.0.1',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 22. System Settings & AI Budgets
CREATE TABLE IF NOT EXISTS system_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  setting_key VARCHAR(100) NOT NULL UNIQUE,
  setting_value TEXT NOT NULL,
  description VARCHAR(255) DEFAULT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
