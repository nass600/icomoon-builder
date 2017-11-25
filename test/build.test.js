/* global expect, test */
const path = require('path')
const fs = require('fs-extra')

test('Uncompress icomoon zip file', () => {
  const build = require('../src/commands/build')

  const options = {
    dest: 'target',
    docs: 'docs',
    styles: 'scss/styles',
    fonts: 'fonts'
  }
  build('sass/fa-sass.zip', options)
  expect(fs.existsSync(path.resolve(''))).toBe(3)
})
