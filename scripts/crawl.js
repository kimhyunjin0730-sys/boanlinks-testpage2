import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BASE = 'https://jinnhyunsecurity.com';

async function getArticleList() {
  const res = await fetch(`${BASE}/#news`);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  const articles = [];
  // 홍보센터 기사 목록 파싱
  $('.wp-block-post-title a, h2 a, h3 a, h4 a').each((i, el) => {
    const title = $(el).text().trim();
    const url = $(el).attr('href');
    if (url && url.includes('jinnhyunsecurity.com') && title) {
      articles.push({ title, url });
    }
  });
  return articles;
}

async function getArticleDetail(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);
  
  // 본문 텍스트
  const content = $('.wp-block-post-content, .entry-content, article')
    .first().text().trim();
  
  // 대표 이미지
  const img = $('.wp-block-post-content img, article img')
    .first().attr('src') || '';
  
  // 날짜
  const date = $('time').first().attr('datetime') || 
               $('time').first().text().trim() || '';
  
  // 카테고리 추론
  const fullText = $('body').text();
  let cat = '뉴스';
  if (fullText.includes('수상') || fullText.includes('대상')) cat = '수상';
  else if (fullText.includes('보도자료')) cat = '보도자료';

  return { content, img, date, cat };
}

async function main() {
  console.log('크롤링 시작...');
  const articles = await getArticleList();
  console.log(`총 ${articles.length}개 기사 발견`);

  for (const article of articles) {
    const { data: existing } = await supabase
      .from('press')
      .select('id')
      .eq('origin_url', article.url)
      .single();
    
    if (existing) {
      console.log(`스킵: ${article.title}`);
      continue;
    }

    const detail = await getArticleDetail(article.url);
    
    const { error } = await supabase.from('press').insert({
      title: article.title,
      origin_url: article.url,
      cat: detail.cat,
      date: detail.date,
      source: '진앤현시큐리티',
      summary: detail.content.substring(0, 120) + '…',
      img: detail.img,
      content: detail.content,
    });

    if (error) console.error('저장 실패:', error.message);
    else console.log('저장 완료:', article.title);

    // 요청 간격 (서버 부하 방지)
    await new Promise(r => setTimeout(r, 1000));
  }
  console.log('완료!');
}

main();
