/* global expect, test, afterEach */
const path = require('path')
const fs = require('fs-extra')
const build = require('../src/commands/build')

afterEach(() => {
  fs.remove(path.resolve('test/target'))
})

test('Icomoon zip file doesn\'t exist', () => {
  const icoomonZipPath = 'not/found'
  const paths = {
    docs: 'test/target/docs',
    styles: 'test/target/scss/icons',
    fonts: 'test/target/fonts'
  }
  expect.assertions(1)
  return build.cmd(icoomonZipPath, paths).catch(err => {
    expect(err.message).toEqual('ENOENT: no such file or directory, open \'not/found\'')
  })
})

test('Successful building for SASS', () => {
  const icoomonZipPath = 'test/fixtures/sass/fa-sass.zip'
  const paths = {
    docs: 'test/target/docs',
    styles: 'test/target/scss/icons',
    fonts: 'test/target/fonts'
  }
  expect.assertions(16)
  return build.cmd(icoomonZipPath, paths).then(() => {
    expect(fs.existsSync(path.resolve('test/.tmp'))).toBe(false)

    const expectedFiles = [
      'test/target/docs/demo/icons.css',
      'test/target/docs/demo/index.html',
      'test/target/docs/demo/scripts.js',
      'test/target/docs/demo/styles.css',
      'test/target/docs/icomoon.json',
      'test/target/fonts/fa.svg',
      'test/target/fonts/fa.ttf',
      'test/target/fonts/fa.woff',
      'test/target/scss/icons/icons.scss',
      'test/target/scss/icons/_variables.scss'
    ]
    expect(fs.existsSync(path.resolve('test/.tmp'))).toBe(false)

    expectedFiles.forEach((expectedFile) => {
      expect(fs.existsSync(path.resolve(expectedFile))).toBe(true)
    })
    expect(fs.readdirSync(path.resolve('test/target/docs/demo')).length).toBe(4)
    expect(fs.readdirSync(path.resolve('test/target/docs')).length).toBe(2)
    expect(fs.readdirSync(path.resolve('test/target/fonts')).length).toBe(3)
    expect(fs.readdirSync(path.resolve('test/target/scss/icons')).length).toBe(2)
  })
})
