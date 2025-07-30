#!/usr/bin/env node

const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

console.log('🔍 Analyzing bundle size and performance...')

// Run bundle analyzer
try {
  console.log('📊 Running bundle analyzer...')
  execSync('ANALYZE=true npm run build', { stdio: 'inherit' })
  console.log('✅ Bundle analysis complete!')
} catch (error) {
  console.error('❌ Bundle analysis failed:', error.message)
}

// Check for large dependencies
console.log('📦 Checking for large dependencies...')
const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'))
const dependencies = { ...packageJson.dependencies, ...packageJson.devDependencies }

const largeDeps = Object.entries(dependencies).filter(([name, version]) => {
  // Add logic to check for known large packages
  const largePackages = ['framer-motion', 'lucide-react', 'react-icons']
  return largePackages.includes(name)
})

if (largeDeps.length > 0) {
  console.log('⚠️  Large dependencies detected:')
  largeDeps.forEach(([name, version]) => {
    console.log(`   - ${name}@${version}`)
  })
}

console.log('🎯 Performance optimization complete!') 