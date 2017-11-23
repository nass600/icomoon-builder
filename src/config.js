const path = require('path');
const TEMP_DIR = '.tmp';
const DEST_DIR = '.';

const config = {
    temp: path.resolve(TEMP_DIR),
    dest: path.resolve(DEST_DIR),
    docs: path.resolve(DEST_DIR, 'docs'),
    fonts: path.resolve(DEST_DIR, 'fonts'),
    styles: path.resolve(DEST_DIR, 'scss/icons'),
};

module.exports = config;