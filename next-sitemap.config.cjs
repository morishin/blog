const { execSync } = require('child_process');

/**
 * 指定ファイルの最終更新日時を git log から取得する。
 * git 管理下にない / 取得に失敗した場合は null を返す。
 */
const getGitLastModifiedISO = (filePath) => {
  try {
    const iso = execSync(`git log -1 --format=%cI -- "${filePath}"`, {
      encoding: 'utf-8',
      stdio: ['pipe', 'pipe', 'ignore'],
    }).trim();
    return iso || null;
  } catch {
    return null;
  }
};

/**
 * 記事パスから該当の markdown ファイルパスを算出し、
 * その git 最終更新日時を返す。見つからなければ null。
 */
const getPostLastModifiedISO = (path) => {
  const match = path.match(/^\/posts\/(\d{4})\/(\d{2})\/(\d{2})\/([^/]+?)(\/en)?$/);
  if (!match) {
    return null;
  }
  const [, year, month, day, slug, enSegment] = match;
  const filePath = enSegment
    ? `data/posts/${year}/${month}/${day}/${slug}/en.md`
    : `data/posts/${year}/${month}/${day}/${slug}.md`;
  return getGitLastModifiedISO(filePath);
};

/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://blog.morishin.me',
  generateRobotsTxt: true,
  generateIndexSitemap: false,
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' }
    ],
  },
  changefreq: 'weekly',
  priority: 0.7,
  sitemapSize: 5000,
  // 各ページの優先度と lastmod を調整
  transform: async (config, path) => {
    // トップページには高い優先度を設定
    if (path === '/') {
      return {
        loc: path,
        changefreq: 'weekly',
        priority: 1.0,
        lastmod: new Date().toISOString(),
      }
    }

    // 記事ページには優先度0.8を設定し、lastmod は git の最終更新日時を使用
    if (path.startsWith('/posts/')) {
      const gitLastmod = getPostLastModifiedISO(path);
      const lastmod = gitLastmod ?? new Date().toISOString();

      return {
        loc: path,
        changefreq: 'monthly',
        priority: 0.8,
        lastmod,
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
