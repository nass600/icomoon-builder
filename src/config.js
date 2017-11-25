const path = require('path')
const TEMP_DIR = '.tmp'
const DEST_DIR = 'icomoon'

const config = {
  temp: path.resolve(TEMP_DIR),
  dest: path.resolve(DEST_DIR),
  get docs () {
    return path.resolve(this.dest, 'docs')
  },
  get fonts () {
    return path.resolve(this.dest, 'fonts')
  },
  get styles () {
    return path.resolve(this.dest, 'scss')
  }
}

module.exports = config
