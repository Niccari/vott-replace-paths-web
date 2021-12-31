const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      minify: {
        collapseWhitespace: true,
        minifyCSS: true,
      },
      meta: {
        'description': { name: 'description', content: 'VoTTプロジェクトファイル 保存パス変更ツール'},
        'keyword': { name: 'keywords', content: 'VoTT,保存パス変更,Replace paths'},
        'og:title': { property: 'og:title', content: 'VoTTプロジェクトファイル 保存パス変更ツール' },
        'og:description': { property: 'og:description', content: 'VoTTプロジェクトファイルを、別の場所に移しても開けるように変換するツール' },
        'og:site_name': { property: 'og:site_name', content: 'niccari.net' },
        'og:type': { property: 'og:type', content: 'website' },
        'og:url': { property: 'og:url', content: 'https://niccari.net/vott-replace-paths/' },
        'og:image': { property: 'og:image', content: 'https://niccari.net/vott-replace-paths/ogp.jpg' },
        'twitter:card': { name: 'twitter:card', content: 'summary_large_image' },
        'twitter:title': { name: 'twitter:title', content: 'VoTTプロジェクトファイル 保存パス変更ツール' },
        'twitter:description': { name: 'twitter:description', content: 'VoTTプロジェクトファイルを、別の場所に移しても開けるように変換するツール' },
        'twitter:image': { name: 'twitter:image', content: 'https://niccari.net/vott-replace-paths/ogp.jpg' },
        'twitter:site': { name: 'twitter:site', content: 'niccari1' }
      }
    })
  ]
};
