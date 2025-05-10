module.exports = {
  plugins: [
    require('postcss-preset-env')({
      stage: 3,
      features: {
        'nesting-rules': true
      },
      autoprefixer: { grid: true }
    }),
    require('cssnano')({
      preset: 'default'
    })
  ]
};
