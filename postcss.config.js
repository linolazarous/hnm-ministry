module.exports = {
  plugins: [
    require('autoprefixer'),
    require('cssnano')({
      preset: 'default'
    })
    // Add other PostCSS plugins as needed
  ]
}
