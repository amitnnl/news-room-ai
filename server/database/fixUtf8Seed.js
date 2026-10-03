import { query } from '../config/db.js';

async function fixSeed() {
  console.log('Fixing UTF-8 strings in news_articles and categories...');
  
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 1`,
    ['देश (National)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 2`,
    ['राजनीति (Politics)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 3`,
    ['तकनीक व AI (Technology)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 4`,
    ['व्यापार (Business)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 5`,
    ['खेल (Sports)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 6`,
    ['दुनिया (World)']
  );
  await query(
    `UPDATE news_categories SET name = ? WHERE id = 7`,
    ['हरियाणा स्पेशल (Haryana)']
  );

  await query(
    `UPDATE news_articles SET 
      title = ?,
      summary = ?,
      breaking_headline = ?,
      short_headline = ?
     WHERE id = 1`,
    [
      'हरियाणा में नई हाई-स्पीड रैपिड रेल और मेट्रो कॉरिडोर को मिली मंजूरी: गुरुग्राम से फरीदाबाद का सफर अब सिर्फ 25 मिनट में',
      'हरियाणा सरकार और केंद्र ने गुरुग्राम से फरीदाबाद के बीच नए आधुनिक रैपिड रेल व मेट्रो लिंक को हरी झंडी दे दी है। इससे एनसीआर के लाखों यात्रियों को भारी जाम से राहत मिलेगी।',
      'बड़ी खबर: गुरुग्राम-फरीदाबाद हाई-स्पीड मेट्रो को मंजूरी, 25 मिनट में पूरा होगा सफर!',
      'गुरुग्राम-फरीदाबाद मेट्रो कॉरिडोर मंजूर'
    ]
  );

  await query(
    `UPDATE news_articles SET 
      title = ?,
      summary = ?,
      breaking_headline = ?,
      short_headline = ?
     WHERE id = 2`,
    [
      'ISRO ने स्वदेशी सेमी-क्रायोजेनिक रॉकेट इंजन का सफल हॉट-टेस्ट किया: गगनयान और भारी सैटेलाइट लॉन्च में मील का पत्थर',
      'भारतीय अंतरिक्ष अनुसंधान संगठन (ISRO) ने महेंद्रगिरि स्थित प्रोपल्शन कॉम्प्लेक्स में अपने सेमी-क्रायोजेनिक 2000 किलोन्यूटन थ्रस्ट इंजन का सफल परीक्षण पूरा किया।',
      'इसरो की नई कामयाबी: स्वदेशी सेमी-क्रायोजेनिक रॉकेट इंजन का सफल परीक्षण संपन्न!',
      'ISRO सेमी-क्रायोजेनिक इंजन सफल'
    ]
  );

  console.log('✅ UTF-8 seed strings fixed successfully!');
  process.exit(0);
}

fixSeed().catch(err => {
  console.error(err);
  process.exit(1);
});
