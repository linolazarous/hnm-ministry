export default defineConfig({
  base: '/',  // Ensure this is set to root
  build: {
    outDir: '../dist',  // Should match netlify.toml publish dir
    emptyOutDir: true
  }
})
