/* global expect, test, afterEach */
const path = require('path')
const fs = require('fs-extra')
const exportCmd = require('../src/commands/export')

afterEach(() => {
  fs.remove(path.resolve('test/target'))
})

test('Icomoon zip file doesn\'t exist', () => {
  const fontName = 'custom-font'
  const icoomonZipPath = 'not/found'
  const paths = {
    docs: 'test/target/docs',
    preProcessor: 'test/target/scss/icons',
    css: 'test/target/css',
    fonts: 'test/target/fonts'
  }
  expect.assertions(1)
  return exportCmd.cmd(fontName, icoomonZipPath, paths).catch(err => {
    expect(err.message).toContain('ENOENT: no such file or directory')
  })
})

test('Successful exporting for SASS', () => {
  const fontName = 'custom-font'
  const icoomonZipPath = 'test/fixtures/sass/fa-sass.zip'
  const minify = true
  const paths = {
    css: 'test/target/css',
    docs: 'test/target/docs',
    fonts: 'test/target/fonts',
    json: 'test/target/json',
    preProcessor: 'test/target/scss/icons'
  }
  expect.assertions(19)
  return exportCmd.cmd(fontName, icoomonZipPath, paths, minify).then(() => {
    expect(fs.existsSync(path.resolve('test/.tmp'))).toBe(false)

    const expectedFiles = [
      'test/target/docs/index.html',
      'test/target/docs/scripts.js',
      'test/target/docs/styles.css',
      'test/target/json/icomoon.json',
      `test/target/fonts/${fontName}.svg`,
      `test/target/fonts/${fontName}.ttf`,
      `test/target/fonts/${fontName}.woff`,
      `test/target/scss/icons/${fontName}.scss`,
      'test/target/scss/icons/_variables.scss',
      'test/target/scss/icons/_icons.scss',
      `test/target/css/${fontName}.css`,
      `test/target/css/${fontName}.min.css`
    ]
    expect(fs.existsSync(path.resolve('test/.tmp'))).toBe(false)

    expectedFiles.forEach((expectedFile) => {
      expect(fs.existsSync(path.resolve(expectedFile))).toBe(true)
    })
    expect(fs.readdirSync(path.resolve('test/target/css')).length).toBe(2)
    expect(fs.readdirSync(path.resolve('test/target/docs')).length).toBe(3)
    expect(fs.readdirSync(path.resolve('test/target/fonts')).length).toBe(3)
    expect(fs.readdirSync(path.resolve('test/target/json')).length).toBe(1)
    expect(fs.readdirSync(path.resolve('test/target/scss/icons')).length).toBe(3)
  })
})
