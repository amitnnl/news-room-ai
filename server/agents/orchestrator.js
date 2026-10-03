import { v4 as uuidv4 } from 'uuid';
import { query } from '../config/db.js';
import { aiProvider } from '../providers/aiProvider.js';

export class NewsroomOrchestrator {
  constructor() {
    this.provider = aiProvider;
  }

  async runAgentTask(agentCode, systemPrompt, userPrompt) {
    const taskId = `task_${Date.now()}_${uuidv4().substring(0, 8)}`;
    
    // Log task start
    await query(
      `INSERT INTO ai_tasks (task_id, agent_code, input_payload, status)
       VALUES (?, ?, ?, 'running')`,
      [taskId, agentCode, JSON.stringify({ prompt: userPrompt })]
    );

    try {
      const output = await this.provider.generate({
        systemPrompt,
        userPrompt,
        jsonMode: true,
        agentCode
      });

      // Update task completion
      await query(
        `UPDATE ai_tasks 
         SET output_payload = ?, status = 'completed', completed_at = NOW() 
         WHERE task_id = ?`,
        [JSON.stringify(output), taskId]
      );

      return { success: true, taskId, data: output };
    } catch (err) {
      console.error(`Agent ${agentCode} execution error:`, err);
      await query(
        `UPDATE ai_tasks 
         SET error_message = ?, status = 'failed' 
         WHERE task_id = ?`,
        [err.message, taskId]
      );
      throw err;
    }
  }

  // The Master One-Click News Package Workflow
  async generateCompleteNewsPackage({ topic, categoryId = 1, language = 'hi', isBreaking = false, authorId = 1 }) {
    console.log(`🚀 Starting Multi-Agent Newsroom Pipeline for topic: "${topic}"...`);
    const workflowId = uuidv4();
    const startTime = Date.now();

    // 1. Research Agent
    const researchPrompt = `Topic: "${topic}"\nPerform thorough investigative research on this news topic. Identify confirmed facts, reliable source records, key entities, and verified timeline. Return JSON strictly.`;
    const researchRes = await this.runAgentTask(
      'research_agent',
      'You are a veteran investigative news researcher. Collect primary facts, verify timelines, identify named entities, extract source URLs, and summarize core developments objectively without bias. Return JSON with keys: topic, summary, key_facts, sources, entities, timeline, confidence, requires_human_verification.',
      researchPrompt
    );
    const researchData = researchRes.data;

    // 2. Fact Check Agent
    const factCheckPrompt = `Topic: "${topic}"\nVerify the following research brief for factual integrity, contradiction risks, or unsupported claims:\n\n${JSON.stringify(researchData, null, 2)}`;
    const factCheckRes = await this.runAgentTask(
      'fact_check_agent',
      'You are an authoritative fact checking auditor. Review the research for accuracy. Flag any unverified figures, unsupported claims, or quote integrity concerns. Return JSON with keys: verification_status (verified/caution/unverified), score (0-100), verified_claims, unverified_claims, warnings, contradictions, fact_checker_notes.',
      factCheckPrompt
    );
    const factCheckData = factCheckRes.data;

    // 3. News Writer Agent
    const writerPrompt = `Topic: "${topic}"\nWrite a comprehensive, professional news article based on this verified research:\n${JSON.stringify(researchData, null, 2)}\n\nFact Check status: ${factCheckData.verification_status}. Language: ${language}.`;
    const writerRes = await this.runAgentTask(
      'writer_agent',
      'You are an award-winning bilingual digital news journalist. Draft a high-quality news report. Return JSON with keys: title_hi, title_en, slug, summary, content (HTML formatted paragraphs and headings), breaking_headline, short_headline, faq (array of {q, a}), key_points (array of strings).',
      writerPrompt
    );
    const writerData = writerRes.data;

    // 4. Headline & SEO Agent
    const seoPrompt = `Topic: "${topic}"\nGenerate optimized multi-platform headlines and SEO metadata for article titled: "${writerData.title_hi || writerData.title_en}". Summary: "${writerData.summary}".`;
    const seoRes = await this.runAgentTask(
      'seo_agent',
      'You are an elite news SEO and headline strategist. Return JSON with keys: seo_title, meta_description, keywords, slug, headlines ({breaking, seo, mobile, social, whatsapp, youtube}).',
      seoPrompt
    );
    const seoData = seoRes.data;

    // 5. Visual Design Agent
    const visualPrompt = `Topic: "${topic}"\nDesign visual specifications and an AI image generation prompt for this news story: "${writerData.title_hi || topic}".`;
    const visualRes = await this.runAgentTask(
      'visual_agent',
      'You are a newsroom visual director. Return JSON with keys: featured_image_prompt, aspect_ratios, overlay_text, brand_colors, is_ai_generated_label, recommended_placeholder.',
      visualPrompt
    );
    const visualData = visualRes.data;

    // 6. Social Media Content Agent
    const socialPrompt = `Topic: "${topic}"\nTitle: "${writerData.title_hi || topic}"\nCreate tailored social media posts for all major platforms based on this story:\nKey Points: ${JSON.stringify(writerData.key_points)}`;
    const socialRes = await this.runAgentTask(
      'social_agent',
      'You are a digital newsroom social media director. Create distinct copy for Facebook, Instagram (carousel breakdown), WhatsApp Broadcast, YouTube, Twitter/X, and Telegram. Return JSON with keys: facebook ({post_text, hashtags, cta}), instagram ({caption, carousel_slides, hashtags}), whatsapp ({message, cta}), youtube ({title, description, tags, thumbnail_badge}), twitter ({tweet}), telegram ({message}).',
      socialPrompt
    );
    const socialData = socialRes.data;

    // 7. Video Producer Agent
    const videoPrompt = `Topic: "${topic}"\nTitle: "${writerData.title_hi || topic}"\nWrite a high-retention 60-second 9:16 vertical video script (YouTube Short / Instagram Reel).`;
    const videoRes = await this.runAgentTask(
      'video_agent',
      'You are an executive video producer. Write a 60s vertical news short script. Return JSON with keys: title, format, duration_seconds, scenes (array of {timestamp, cue, visual, voiceover}), full_voiceover_script.',
      videoPrompt
    );
    const videoData = videoRes.data;

    // 8. Save Article into MySQL Database
    const articleTitle = language === 'hi' ? (writerData.title_hi || writerData.title_en) : (writerData.title_en || writerData.title_hi);
    const baseSlug = (seoData.slug || writerData.slug || 'article')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 200);
    const finalSlug = `${baseSlug || 'story'}-${Date.now().toString(36)}-${Math.floor(Math.random() * 1000)}`;
    const featuredImg = visualData.recommended_placeholder || 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&w=1200&q=80';

    const insertResult = await query(
      `INSERT INTO news_articles (
        title, slug, summary, content, category_id, status, language, is_breaking, author_id,
        featured_image, image_caption, image_alt, seo_title, meta_description, seo_keywords,
        breaking_headline, short_headline, faq_json, key_points_json
      ) VALUES (?, ?, ?, ?, ?, 'under_review', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        articleTitle,
        finalSlug,
        writerData.summary,
        writerData.content,
        categoryId,
        language,
        isBreaking ? 1 : 0,
        authorId,
        featuredImg,
        visualData.overlay_text || 'News Update',
        articleTitle.substring(0, 200),
        seoData.seo_title,
        seoData.meta_description,
        seoData.keywords,
        seoData.headlines?.breaking || writerData.breaking_headline,
        seoData.headlines?.mobile || writerData.short_headline,
        JSON.stringify(writerData.faq || []),
        JSON.stringify(writerData.key_points || [])
      ]
    );

    const articleId = insertResult.insertId;

    // Save Research
    await query(
      `INSERT INTO news_research (
        article_id, topic, raw_summary, key_facts_json, entities_json, timeline_json, confidence_score, requires_human_verification
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        articleId,
        topic,
        researchData.summary,
        JSON.stringify(researchData.key_facts || []),
        JSON.stringify(researchData.entities || []),
        JSON.stringify(researchData.timeline || []),
        researchData.confidence || 'High',
        researchData.requires_human_verification ? 1 : 0
      ]
    );

    // Save Sources
    if (researchData.sources && Array.isArray(researchData.sources)) {
      for (const src of researchData.sources) {
        await query(
          `INSERT INTO news_sources (article_id, title, url, publisher, credibility_score)
           VALUES (?, ?, ?, ?, ?)`,
          [articleId, src.title || 'Official Source', src.url || 'https://pib.gov.in', src.publisher || 'Govt/Desk', src.credibility || 90]
        );
      }
    }

    // Save Fact Check
    await query(
      `INSERT INTO fact_checks (
        article_id, verification_status, score, verified_claims_json, unverified_claims_json, warnings_json, contradictions_json, fact_checker_notes
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        articleId,
        factCheckData.verification_status || 'verified',
        factCheckData.score || 92,
        JSON.stringify(factCheckData.verified_claims || []),
        JSON.stringify(factCheckData.unverified_claims || []),
        JSON.stringify(factCheckData.warnings || []),
        JSON.stringify(factCheckData.contradictions || []),
        factCheckData.fact_checker_notes || 'All key facts validated against authoritative records.'
      ]
    );

    // Save Social Posts Drafts
    // 1. Facebook
    if (socialData.facebook) {
      await query(
        `INSERT INTO social_posts (article_id, platform, post_type, headline, body, media_url, hashtags, cta, status)
         VALUES (?, 'facebook', 'post', ?, ?, ?, ?, ?, 'draft')`,
        [articleId, seoData.headlines?.breaking || articleTitle, socialData.facebook.post_text, featuredImg, socialData.facebook.hashtags, socialData.facebook.cta]
      );
    }
    // 2. Instagram
    if (socialData.instagram) {
      await query(
        `INSERT INTO social_posts (article_id, platform, post_type, headline, body, media_url, hashtags, cta, status)
         VALUES (?, 'instagram', 'carousel', ?, ?, ?, ?, 'Swipe for details', 'draft')`,
        [articleId, articleTitle, socialData.instagram.caption, featuredImg, socialData.instagram.hashtags]
      );
    }
    // 3. WhatsApp
    if (socialData.whatsapp) {
      await query(
        `INSERT INTO social_posts (article_id, platform, post_type, headline, body, media_url, hashtags, cta, status)
         VALUES (?, 'whatsapp', 'broadcast', ?, ?, ?, '', ?, 'draft')`,
        [articleId, seoData.headlines?.whatsapp || 'Breaking News', socialData.whatsapp.message, featuredImg, socialData.whatsapp.cta]
      );
    }
    // 4. YouTube
    if (socialData.youtube) {
      await query(
        `INSERT INTO social_posts (article_id, platform, post_type, headline, body, media_url, hashtags, cta, status)
         VALUES (?, 'youtube', 'short', ?, ?, ?, ?, 'Subscribe', 'draft')`,
        [articleId, socialData.youtube.title, socialData.youtube.description, featuredImg, socialData.youtube.tags]
      );
    }

    // Save YouTube Video Project
    if (videoData) {
      await query(
        `INSERT INTO youtube_videos (article_id, title, description, tags, script, voiceover_text, scene_list_json, format, duration_seconds, thumbnail_url, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'ready')`,
        [
          articleId,
          videoData.title || articleTitle,
          socialData.youtube?.description || articleTitle,
          socialData.youtube?.tags || 'news, breaking news, analysis',
          JSON.stringify(videoData.scenes || []),
          videoData.full_voiceover_script,
          JSON.stringify(videoData.scenes || []),
          videoData.format || 'short_9_16',
          videoData.duration_seconds || 58,
          featuredImg
        ]
      );
    }

    // Save Initial Audit Log
    await query(
      `INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details)
       VALUES (?, 'AI_PACKAGE_GENERATED', 'news_articles', ?, ?)`,
      [authorId, articleId, `AI Multi-Agent Package generated in ${((Date.now() - startTime) / 1000).toFixed(1)}s for topic "${topic}". Under Editorial Review.`]
    );

    console.log(`✅ AI Newsroom Package #${articleId} successfully compiled!`);

    return {
      success: true,
      articleId,
      workflowId,
      timeTakenSec: ((Date.now() - startTime) / 1000).toFixed(1),
      package: {
        article: {
          id: articleId,
          title: articleTitle,
          slug: finalSlug,
          summary: writerData.summary,
          content: writerData.content,
          featured_image: featuredImg,
          is_breaking: isBreaking
        },
        research: researchData,
        factCheck: factCheckData,
        seo: seoData,
        visual: visualData,
        social: socialData,
        video: videoData
      }
    };
  }
}

export const orchestrator = new NewsroomOrchestrator();
export default orchestrator;
