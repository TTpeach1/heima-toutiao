module.exports = {
  plugins: {
    autoprefixer: {
      browsers: ['Android >= 4.0', 'iOS >= 8']
    },
    'postcss-pxtorem': {
      rootValue: (module) => (/vant/gi.test(module.file) ? 37.5 : 75),
      // rootValue: (module) => (/(vant|markdown)/gi.test(module.file) ? 37.5 : 75),
      // *号表示全部
      propList: ['*']
    }
  }
}
