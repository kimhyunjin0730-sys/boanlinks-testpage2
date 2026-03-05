import fetch from 'node-fetch';
import * as cheerio from 'cheerio';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_KEY
);

const BASE = 'https://jinnhyunsecurity.com';

async function getArticleList(page = 1) {
  const url = page === 1 ? `${BASE}/` : `${BASE}/?_page=${page}`;
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const articles = [];
  $('h4 a').each((i, el) => {
    const title = $(el).text().trim();
    const href = $(el).attr('href');
    if (href && href.includes('jinnhyunsecurity.com') && title) {
      articles.push({ title, url: href });
    }
  });

  // 다음 페이지 존재 여부
  const hasNext = $(`a[href*="_page=${page + 1}"]`).length > 0;

  return { articles, hasNext };
}

async function getArticleDetail(url) {
  const res = await fetch(url);
  const html = await res.text();
  const $ = cheerio.load(html);

  const content = $('.entry-content, article .wp-block-post-content')
    .first().text().trim();

  const img = $('.entry-content img, article img')
    .first().attr('src') || '';

  const date = $('time').first().text().trim() || '';

  const fullText = $('body').text();
  let cat = '뉴스';
  if (fullText.includes('수상') || fullText.includes('대상')) cat = '수상';
  else if (fullText.includes('보도자료')) cat = '보도자료';

  return { content, img, date, cat };
}

async function main() {
  console.log('크롤링 시작...');
  let page = 1;
  let totalSaved = 0;

  while (true) {
    console.log(`${page}페이지 크롤링 중...`);
    const { articles, hasNext } = await getArticleList(page);
    console.log(`${articles.length}개 기사 발견`);

    for (const article of articles) {
      const { data: existing } = await supabase
        .from('press')
        .select('id')
        .eq('origin_url', article.url)
        .single();

      if (existing) {
        console.log(`스킵 (이미 존재): ${article.title}`);
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
      else {
        console.log(`저장 완료: ${article.title}`);
        totalSaved++;
      }

      await new Promise(r => setTimeout(r, 1000));
    }

    if (!hasNext) {
      console.log('마지막 페이지 완료');
      break;
    }
    page++;
    await new Promise(r => setTimeout(r, 1500));
  }

  console.log(`총 ${totalSaved}개 기사 저장 완료`);
}

main();
