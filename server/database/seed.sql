-- Seed Data for social_news_agents
USE social_news_agents;

-- Users (BCrypt hash for 'password123': $2a$10$wB5Wf6Fh2w9c9sOqfQJ9u.k0qZ6uX01Zg1M9VdZgLd3H1Jt/1zWym or simple hash for development)
INSERT INTO users (id, name, email, password_hash, role, avatar_url) VALUES
(1, 'Dev Sharma', 'admin@newsroom.ai', '$2b$10$K9p1B0iKx6Y7uP8.bZzR1O3jC0xV6Z3iWz2gD8k1hF5g9b6uY4z2W', 'super_admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'),
(2, 'Priya Verma', 'editor@newsroom.ai', '$2b$10$K9p1B0iKx6Y7uP8.bZzR1O3jC0xV6Z3iWz2gD8k1hF5g9b6uY4z2W', 'editor', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=150&q=80'),
(3, 'Rajesh Patel', 'checker@newsroom.ai', '$2b$10$K9p1B0iKx6Y7uP8.bZzR1O3jC0xV6Z3iWz2gD8k1hF5g9b6uY4z2W', 'fact_checker', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80'),
(4, 'Ananya Roy', 'reporter@newsroom.ai', '$2b$10$K9p1B0iKx6Y7uP8.bZzR1O3jC0xV6Z3iWz2gD8k1hF5g9b6uY4z2W', 'reporter', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Categories
INSERT INTO news_categories (id, name, slug, description) VALUES
(1, 'देश (National)', 'national', 'भारत और राज्यों से जुड़ी प्रमुख राष्ट्रीय खबरें'),
(2, 'राजनीति (Politics)', 'politics', 'संसद, चुनाव और राजनीतिक दलों की नवीनतम गतिविधियां'),
(3, 'तकनीक व AI (Technology)', 'technology', 'आर्टिफिशियल इंटेलिजेंस, मोबाइल और साइंस टेक्नोलॉजी'),
(4, 'व्यापार (Business)', 'business', 'शेयर बाजार, स्टार्टअप्स, अर्थव्यवस्था और उद्योग'),
(5, 'खेल (Sports)', 'sports', 'क्रिकेट, हॉकी, ओलंपिक और वैश्विक खेल प्रतियोगिताएं'),
(6, 'दुनिया (World)', 'world', 'अंतर्राष्ट्रीय संबंध, भू-राजनीति और विश्व समाचार'),
(7, 'हरियाणा स्पेशल (Haryana)', 'haryana', 'हरियाणा राज्य, विकास, कृषि और स्थानीय नीतियां')
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- AI Agents Definitions
INSERT INTO ai_agents (id, code, name, role, system_prompt, default_model, temperature, is_active) VALUES
(1, 'research_agent', 'News Research Agent', 'Information Gathering & Synthesis', 'You are a veteran investigative news researcher. Collect primary facts, verify timelines, identify named entities, extract source URLs, and summarize core developments objectively without bias.', 'gemini-2.5-flash', 0.40, 1),
(2, 'fact_check_agent', 'Fact Checking Agent', 'Claim Verification & Anomaly Detection', 'You are a strict editorial fact checker. Cross-examine claims, identify unsupported statistics or manufactured quotes, highlight source conflicts, and grade confidence level.', 'gemini-2.5-flash', 0.20, 1),
(3, 'writer_agent', 'News Writer Agent', 'Article & Editorial Composition', 'You are an award-winning bilingual digital journalist fluent in Hindi and English. Write compelling, accurate, and structured news stories with clear introductions, body paragraphs, and FAQs.', 'gemini-2.5-flash', 0.70, 1),
(4, 'seo_agent', 'Headline & SEO Agent', 'Metadata & Multi-Variant Headlines', 'Generate 5 distinct headline types (Breaking, Mobile, SEO, Social, WhatsApp), optimal slugs, meta tags, and structured schema markup without sensationalist clickbait.', 'gemini-2.5-flash', 0.60, 1),
(5, 'social_agent', 'Social Media Content Agent', 'Platform-Specific Content Strategy', 'Create specialized post drafts for Facebook, Instagram Carousel, WhatsApp Broadcast, YouTube Community, Twitter/X, and Telegram adhering to platform-specific length and tone guidelines.', 'gemini-2.5-flash', 0.75, 1),
(6, 'visual_agent', 'Visual Design Agent', 'Graphics & Image Generation Prompts', 'Produce image generation prompts, social banner layouts, YouTube thumbnail text badges, breaking news overlays, and ensure clear labels on AI-generated imagery.', 'gemini-2.5-flash', 0.65, 1),
(7, 'video_agent', 'Video Producer Agent', 'Shorts & Reels Scripting Engine', 'Draft high-retention 60-second 9:16 vertical video scripts with second-by-second timestamps (0-3s hook, 3-15s key fact, 15-45s context, 45-60s CTA), visual cues, and voiceover text.', 'gemini-2.5-flash', 0.70, 1),
(8, 'publishing_agent', 'Publishing & Distribution Agent', 'Multi-Platform Gateway', 'Manage distribution pipelines across CMS, Meta Graph API, WhatsApp Cloud API, and YouTube Data API with automatic retries and logging.', 'gemini-2.5-flash', 0.10, 1),
(9, 'analytics_agent', 'Newsroom Analytics Agent', 'Audience Insights & Optimization', 'Evaluate article and social post performance, detect trending reader interest, and suggest factual improvements to editorial teams.', 'gemini-2.5-flash', 0.30, 1)
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Social Accounts (Ready with mock/live placeholders)
INSERT INTO social_accounts (id, platform, account_name, account_id, status, config_json) VALUES
(1, 'facebook', 'Bharat Pulse Official (FB Page)', 'act_fb_882910', 'connected', '{"page_id": "104928172910", "followers": "128,400", "access_mode": "Meta Graph API v19.0"}'),
(2, 'instagram', '@bharatpulse_news (Instagram Pro)', 'act_ig_491028', 'connected', '{"account_id": "17841400291", "followers": "84,200", "access_mode": "Instagram Graph API"}'),
(3, 'whatsapp', 'Bharat Pulse News Alert (Cloud API)', 'act_wa_019283', 'connected', '{"phone_number_id": "10982736451", "subscribers": "45,000+", "verified_badge": true}'),
(4, 'youtube', 'Bharat Pulse Media (YouTube)', 'act_yt_918237', 'connected', '{"channel_id": "UC_bharatpulse991", "subscribers": "210,000", "verified": true}'),
(5, 'telegram', 'Bharat Pulse Breaking Channel', 'act_tg_382910', 'connected', '{"channel_username": "@bharatpulsenews", "members": "32,500"}'),
(6, 'twitter', '@BharatPulseNews (X/Twitter)', 'act_tw_551928', 'connected', '{"handle": "BharatPulseNews", "followers": "67,800"}')
ON DUPLICATE KEY UPDATE account_name=VALUES(account_name);

-- RSS Sources
INSERT INTO rss_sources (id, name, url, category, language, active, last_checked) VALUES
(1, 'PIB India (Press Information Bureau)', 'https://pib.gov.in/RssMain.aspx?ModId=6&LangId=2', 'National', 'hi', 1, NOW()),
(2, 'NDTV India Top Stories', 'https://feeds.feedburner.com/ndtvkhabar', 'National', 'hi', 1, NOW()),
(3, 'Dainik Bhaskar National', 'https://www.bhaskar.com/rss-v1--category-1061.xml', 'National', 'hi', 1, NOW()),
(4, 'The Hindu National News', 'https://www.thehindu.com/news/national/feeder/default.rss', 'National', 'en', 1, NOW()),
(5, 'TechCrunch AI & DeepTech', 'https://techcrunch.com/category/artificial-intelligence/feed/', 'Technology', 'en', 1, NOW())
ON DUPLICATE KEY UPDATE name=VALUES(name);

-- Trending Topics
INSERT INTO trending_topics (id, topic, trend_score, category, source_count, potential_audience, status) VALUES
(1, 'ISRO Agnikul Sub-Orbital Launch Mission', 96, 'Technology', 18, '2.4M', 'in_progress'),
(2, 'Haryana New High-Speed Metro Corridor Approval', 91, 'Haryana', 14, '1.1M', 'published'),
(3, 'AI Regulation & National Data Governance Framework 2026', 88, 'Technology', 22, '3.2M', 'new'),
(4, 'India Forex Reserves Hit Record All-Time High', 84, 'Business', 12, '950K', 'reviewing'),
(5, 'ICC Champions Trophy Squad Final Declaration', 82, 'Sports', 29, '5.6M', 'new')
ON DUPLICATE KEY UPDATE topic=VALUES(topic);

-- Sample Articles with Full Agents Output
INSERT INTO news_articles (
  id, title, slug, summary, content, category_id, status, language, is_breaking, author_id, featured_image,
  image_caption, image_alt, seo_title, meta_description, seo_keywords, breaking_headline, short_headline,
  faq_json, key_points_json, view_count, published_at
) VALUES
(
  1,
  'हरियाणा में नई हाई-स्पीड रैपिड रेल और मेट्रो कॉरिडोर को मिली मंजूरी: गुरुग्राम से फरीदाबाद का सफर अब सिर्फ 25 मिनट में',
  'haryana-rapid-rail-metro-corridor-gurugram-faridabad-approval',
  'हरियाणा सरकार और केंद्र ने गुरुग्राम से फरीदाबाद के बीच नए आधुनिक रैपिड रेल व मेट्रो लिंक को हरी झंडी दे दी है। इससे एनसीआर के लाखों यात्रियों को भारी जाम से राहत मिलेगी।',
  '<h2>एनसीआर में सार्वजनिक परिवहन का नया अध्याय</h2><p>हरियाणा सरकार और केंद्रीय शहरी विकास मंत्रालय ने मंगलवार को गुरुग्राम-फरीदाबाद हाई-स्पीड मेट्रो एवं रैपिड ट्रांजिट कॉरिडोर के निर्माण प्रस्ताव को अंतिम स्वीकृति प्रदान कर दी है। इस 32 किलोमीटर लंबे अत्याधुनिक एलिवेटेड कॉरिडोर के निर्माण से दोनों औद्योगिक शहरों के बीच का यात्रा समय घटकर मात्र 25 मिनट रह जाएगा।</p><h3>परियोजना की मुख्य विशेषताएं</h3><p>इस परियोजना की कुल अनुमानित लागत 6,800 करोड़ रुपये है, जिसे संयुक्त उपक्रम मॉडल के तहत पूरा किया जाएगा। कॉरिडोर पर कुल 8 प्रमुख स्टेशन बनाए जाएंगे, जिनमें साइबर सिटी, गोल्फ कोर्स एक्सटेंशन और बाटा चौक फरीदाबाद इंटरचेंज शामिल हैं।</p><h3>प्रदूषण और जाम में भारी कमी</h3><p>परिवहन विशेषज्ञों के अनुसार, प्रतिदिन लगभग 2.5 लाख दैनिक यात्री इस मार्ग का उपयोग करेंगे, जिससे गुरुग्राम-फरीदाबाद रोड पर निजी वाहनों का दबाव 40% तक कम होने का अनुमान है। निर्माण कार्य अगले 6 महीनों में शुरू होकर 2029 तक पूरा करने का लक्ष्य निर्धारित किया गया है।</p>',
  7,
  'published',
  'hi',
  1,
  1,
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80',
  'गुरुग्राम-फरीदाबाद मेट्रो और रैपिड ट्रांजिट का प्रस्तावित मॉडल',
  'Haryana Rapid Metro Corridor',
  'Haryana Metro Corridor Approval: Gurugram to Faridabad in 25 Minutes',
  'गुरुग्राम और फरीदाबाद के बीच नए 32 किमी हाई-स्पीड मेट्रो कॉरिडोर को मिली मंजूरी। 6800 करोड़ की लागत से बनेगा आधुनिक लिंक।',
  'Haryana Metro, Gurugram Faridabad Metro, Rapid Rail, NCR Transport, Breaking News',
  'बड़ी खबर: गुरुग्राम-फरीदाबाद हाई-स्पीड मेट्रो को मंजूरी, 25 मिनट में पूरा होगा सफर!',
  'गुरुग्राम-फरीदाबाद मेट्रो कॉरिडोर मंजूर',
  '[{"q": "कॉरिडोर की कुल लंबाई कितनी है?", "a": "यह नया कॉरिडोर लगभग 32 किलोमीटर लंबा होगा जिसमें 8 स्टेशन होंगे।"}, {"q": "यात्रा समय कितना कम होगा?", "a": "वर्तमान में लगने वाले 70-80 मिनट की तुलना में अब केवल 25 मिनट लगेंगे।"}]',
  '["हरियाणा और केंद्र ने 6800 करोड़ रुपये की मेट्रो परियोजना मंजूर की", "32 किमी लंबाई और 8 आधुनिक एलिवेटेड स्टेशंस", "गुरुग्राम और फरीदाबाद का सफर केवल 25 मिनट में पूरा होगा", "2029 तक परियोजना पूरी करने का आधिकारिक लक्ष्य"]',
  14280,
  NOW()
),
(
  2,
  'ISRO ने स्वदेशी सेमी-क्रायोजेनिक रॉकेट इंजन का सफल हॉट-टेस्ट किया: गगनयान और भारी सैटेलाइट लॉन्च में मील का पत्थर',
  'isro-semi-cryogenic-engine-hot-test-success-gaganyaan',
  'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने महेंद्रगिरि स्थित प्रोपल्शन कॉम्प्लेक्स में अपने सेमी-क्रायोजेनिक 2000 किलोन्यूटन थ्रस्ट इंजन का सफल परीक्षण पूरा किया।',
  '<h2>अंतरिक्ष विज्ञान में भारत की एक और ऐतिहासिक छलांग</h2><p>भारतीय अंतरिक्ष अनुसंधान संगठन (इसरो) ने तमिलनाडु के महेंद्रगिरि स्थित इसरो प्रोपल्शन कॉम्प्लेक्स (IPRC) में अगली पीढ़ी के सेमी-क्रायोजेनिक इंजन का सफल हॉट-टेस्ट किया है। यह इंजन केरोसिन और तरल ऑक्सीजन के मिश्रण पर संचालित होता है, जो भविष्य के भारी उपग्रह प्रक्षेपण यानों की रीढ़ बनेगा।</p><h3>गगनयान और भविष्य के मिशनों को मिलेगी नई शक्ति</h3><p>वर्तमान विकास इंजन की तुलना में यह सेमी-क्रायोजेनिक तकनीक कहीं अधिक पेलोड क्षमता प्रदान करती है। इसरो वैज्ञानिकों ने पुष्टि की है कि परीक्षण के दौरान सभी मापदंड सामान्य और संतोषजनक रहे।</p>',
  3,
  'approved',
  'hi',
  0,
  2,
  'https://images.unsplash.com/photo-1516849841032-87cbac4d88f7?auto=format&fit=crop&w=1200&q=80',
  'महेंद्रगिरि टेस्ट फैसिलिटी में इसरो सेमी-क्रायोजेनिक इंजन',
  'ISRO Rocket Engine Hot Test',
  'ISRO Semi-Cryogenic Rocket Engine Hot Test Successful',
  'ISRO conducts successful hot test of high-thrust semi-cryogenic engine at Mahendragiri Propulsion Complex.',
  'ISRO, Semi Cryogenic Engine, Gaganyaan, Space Technology, Mahendragiri',
  'इसरो की नई कामयाबी: स्वदेशी सेमी-क्रायोजेनिक रॉकेट इंजन का सफल परीक्षण संपन्न!',
  'ISRO सेमी-क्रायोजेनिक इंजन सफल',
  '[{"q": "सेमी-क्रायोजेनिक इंजन किस ईंधन पर चलता है?", "a": "यह रिफाइंड केरोसिन (Isrosene) और लिक्विड ऑक्सीजन (LOX) पर संचालित होता है।"}]',
  '["महेंद्रगिरि कॉम्प्लेक्स में 2000 kN थ्रस्ट इंजन का सफल परीक्षण", "भविष्य के LVM3 और भारी पेलोड मिशनों के लिए निर्णायक", "गगनयान मानव मिशन हेतु अत्यधिक विश्वसनीय तकनीक"]',
  8920,
  NOW()
)
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- Sources for Article 1
INSERT INTO news_sources (article_id, title, url, publisher, credibility_score, notes) VALUES
(1, 'Haryana Urban Development Authority Press Release', 'https://haryana.gov.in/press/metro-corridor-2026', 'Govt of Haryana', 98, 'Official cabinet meeting decision note and corridor map'),
(1, 'Ministry of Housing and Urban Affairs Gazette', 'https://mohua.gov.in/notifications/gurugram-faridabad-metro', 'Govt of India', 95, 'Budget allocation and alignment clearance')
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- AI Research for Article 1
INSERT INTO news_research (article_id, topic, raw_summary, key_facts_json, entities_json, timeline_json, confidence_score, requires_human_verification) VALUES
(1, 'Haryana Rapid Metro Gurugram-Faridabad Approval', 'Joint approval given by state and central ministries for 32km high speed transit corridor connecting Gurugram Cyber City to Bata Chowk Faridabad with 8 stations and Rs 6,800 crore budget.', '["Project Length: 32 km", "Estimated Budget: 6,800 Crores", "Travel Duration: 25 minutes", "Daily ridership forecast: 250,000"]', '["Gurugram", "Faridabad", "Haryana Govt", "MoHUA", "Cyber City", "Bata Chowk"]', '[{"time": "Tuesday 11:00 AM", "event": "Cabinet clearance approved"}, {"time": "2026 Q3", "event": "Tender allocation scheduled"}, {"time": "2029", "event": "Commercial operations launch target"}]', 'High', 0)
ON DUPLICATE KEY UPDATE topic=VALUES(topic);

-- Fact Check for Article 1
INSERT INTO fact_checks (article_id, verification_status, score, verified_claims_json, unverified_claims_json, warnings_json, contradictions_json, fact_checker_notes) VALUES
(1, 'verified', 96, '["Cabinet approval confirmed from Haryana official press release", "Rs 6,800 crore project budget matches gazette notification", "Route alignment between Gurugram and Faridabad verified by DMRC technical report"]', '[]', '["Note: Timeline completion by 2029 is a target and dependent on right-of-way clearances"]', '[]', 'All claims verified against official state press releases and urban transport ministry records. Safe for distribution.')
ON DUPLICATE KEY UPDATE verification_status=VALUES(verification_status);

-- Social Posts for Article 1
INSERT INTO social_posts (article_id, platform, post_type, headline, body, media_url, hashtags, cta, status, published_at, external_post_id) VALUES
(1, 'facebook', 'post', 'बड़ी खुशखबरी: गुरुग्राम से फरीदाबाद अब सिर्फ 25 मिनट में!', 'हरियाणा सरकार और केंद्र ने 6800 करोड़ रुपये की लागत से बनने वाले 32 किमी हाई-स्पीड मेट्रो कॉरिडोर को हरी झंडी दे दी है।\n\nइस कॉरिडोर पर 8 स्टेशन होंगे और रोजाना करीब 2.5 लाख यात्रियों को जाम से राहत मिलेगी।\n\nपूरी खबर और स्टेशनों की सूची देखने के लिए नीचे दिए गए लिंक पर क्लिक करें👇', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '#HaryanaNews #Gurugram #Faridabad #Metro #NCRTraffic #BharatPulse', 'वेबसाइट पर पूरी रिपोर्ट पढ़ें', 'published', NOW(), 'fb_post_891023812'),
(1, 'instagram', 'carousel', 'Gurugram-Faridabad in 25 mins! 🚇⚡', 'एनसीआर के यात्रियों के लिए सबसे बड़ी खबर! 32 किमी नया हाई-स्पीड मेट्रो कॉरिडोर मंजूर।\n\nSlide 1: मुख्य घोषणा\nSlide 2: स्टेशनों की सूची और रूट मैप\nSlide 3: बजट और 2029 का लक्ष्य\n\nअपने दोस्तों के साथ शेयर करें जो रोज इस रूट पर ट्रैफिक में फंसते हैं!', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '#Haryana #GurugramFaridabad #Metro #NCR #InstaNews #BreakingNews', 'Save this post & share with daily commuters!', 'published', NOW(), 'ig_post_771920311'),
(1, 'whatsapp', 'broadcast', '🚨 भारत पल्स ब्रेकिंग न्यूज़ अलर्ट', '🔴 *गुरुग्राम-फरीदाबाद मेट्रो कॉरिडोर को मिली मंजूरी!*\n\n• सफर का समय: 80 मिनट से घटकर सिर्फ 25 मिनट\n• कुल लंबाई: 32 किलोमीटर, 8 प्रमुख स्टेशन\n• कुल लागत: ₹6,800 करोड़\n• काम शुरू: अगले 6 महीने में\n\nविस्तृत रिपोर्ट और रूट मैप देखने के लिए क्लिक करें: https://bharatpulse.news/a/1', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '', 'विस्तार से पढ़ें 👉', 'published', NOW(), 'wa_msg_901928301'),
(1, 'youtube', 'short', 'Gurugram to Faridabad in 25 Mins! Haryana Metro Approved 🚀', 'गुरुग्राम और फरीदाबाद के बीच 32 किमी हाई-स्पीड मेट्रो को मिली मंजूरी। 6800 करोड़ की लागत और 25 मिनट का सफर। जानिए पूरी डिटेल।', 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1200&q=80', '#Shorts #Haryana #Metro #Gurugram #Faridabad #IndianRailways', 'चैनल को सब्सक्राइब करें', 'published', NOW(), 'yt_vid_991823102')
ON DUPLICATE KEY UPDATE headline=VALUES(headline);

-- YouTube Video Project for Article 1
INSERT INTO youtube_videos (article_id, title, description, tags, script, voiceover_text, format, duration_seconds, status, published_at) VALUES
(1, 'Haryana Metro Approval: Gurugram to Faridabad in 25 Mins | YouTube Short', 'Haryana government approves 32km Gurugram-Faridabad high-speed rapid metro corridor worth Rs 6,800 crore.', 'Haryana Metro, Gurugram, Faridabad, NCR Transport, YouTube Shorts', '00:00-00:03 [HOOK]: क्या गुरुग्राम से फरीदाबाद सिर्फ 25 मिनट में पहुंचा जा सकता है? जी हां!\n00:03-00:15 [FACT]: हरियाणा सरकार और केंद्र ने 6800 करोड़ रुपये के 32 किमी नए रैपिड मेट्रो कॉरिडोर को हरी झंडी दे दी है।\n00:15-00:35 [DETAILS]: इस रूट पर साइबर सिटी से बाटा चौक तक 8 एलिवेटेड स्टेशंस बनेंगे जिससे 2.5 लाख यात्रियों को ट्रैफिक जाम से मुक्ति मिलेगी।\n00:35-00:50 [TIMELINE]: यह प्रोजेक्ट 2029 तक पूरा होगा।\n00:50-00:60 [CTA]: ऐसी ही बड़ी खबरों के लिए भारत पल्स को अभी सब्सक्राइब करें!', 'क्या गुरुग्राम से फरीदाबाद सिर्फ 25 मिनट में पहुंचा जा सकता है? जी हां! हरियाणा सरकार और केंद्र ने 6800 करोड़ रुपये के 32 किमी नए रैपिड मेट्रो कॉरिडोर को हरी झंडी दे दी है।', 'short_9_16', 58, 'published', NOW())
ON DUPLICATE KEY UPDATE title=VALUES(title);

-- System Settings
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('default_ai_provider', 'gemini', 'Primary active AI provider (gemini, openai, anthropic, mock)'),
('gemini_api_key', '', 'Google Gemini API key for fast newsroom reasoning'),
('openai_api_key', '', 'OpenAI API Key for GPT-4o / GPT-4o-mini fallback'),
('gemini_model', 'gemini-2.5-flash', 'Gemini model variant'),
('openai_model', 'gpt-4o-mini', 'OpenAI model variant'),
('daily_budget_usd', '15.00', 'Maximum permitted daily AI spending limit in USD'),
('cost_usd_spent_today', '0.42', 'Total AI spend recorded for the current UTC day'),
('auto_publish_approved', 'false', 'Automatically trigger social adapters upon editorial approval'),
('breaking_news_confirmation_required', 'true', 'Require explicit dual-confirmation before publishing breaking alerts'),
('brand_name', 'Bharat Pulse AI Newsroom', 'Editorial brand name'),
('brand_tagline', 'Real-Time Fact-Checked Newsroom Engine', 'Platform sub-header')
ON DUPLICATE KEY UPDATE setting_value=VALUES(setting_value);

-- Audit Logs
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details) VALUES
(1, 'DATABASE_SEED', 'system', 1, 'Initial newsroom seed executed successfully with sample categories and articles.'),
(2, 'ARTICLE_APPROVED', 'news_articles', 1, 'Editor Priya Verma approved article and triggered social media generation pipeline.')
ON DUPLICATE KEY UPDATE action=VALUES(action);
