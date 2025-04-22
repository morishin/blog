/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blog.morishin.me',
  generateRobotsTxt: true,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  exclude: [],
  // 言語別バージョンの対応（jaとenは同じコンテンツの翻訳版）
  additionalPaths: async (config) => {
    return []
  },
  // 各ページの優先度を調整
  transform: async (config, path) => {
    // URLから日付を抽出する関数
    const extractDateFromPath = (path) => {
      const match = path.match(/\/posts\/(\d{4})\/(\d{2})\/(\d{2})/);
      if (match) {
        const [_, year, month, day] = match;
        // 日付を作成（時刻は12:00に設定）
        const postDate = new Date(Date.UTC(parseInt(year), parseInt(month) - 1, parseInt(day), 12, 0, 0));
        // 有効な日付ならそれを返す
        if (!isNaN(postDate.getTime())) {
          return postDate;
        }
      }
      return null;
    };

    // 全ページのパスリスト（予め用意される）の中から、記事ページをフィルタし、日付でソート
    // すべてのパスを走査すると重いので記事ページのみの日付を抽出
    const allPostDates = [];

    // トップページには高い優先度を設定し、最新の記事の日付を使用
    if (path === '/') {
      // この時点で完全な記事リストは取得できないため、将来的な機能拡張として記述
      // 現在は現在時刻を使用（ビルド時刻）
      const currentDate = new Date();

      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: currentDate.toISOString(),
      }
    }

    // 記事ページには優先度0.8を設定し、URLから日付を抽出
    if (path.startsWith('/posts/')) {
      const postDate = extractDateFromPath(path);
      const lastmod = postDate ? postDate.toISOString() : new Date().toISOString();

      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod: lastmod,
      }
    }

    // キーワードページやその他のページは週単位の更新頻度
    return {
      loc: path,
      changefreq: config.changefreq,
      priority: config.priority,
      lastmod: new Date().toISOString(),
    }
  },
}