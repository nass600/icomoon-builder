const fs = require('fs-extra');
const chalk = require('chalk');
const logger = require('../logger');
const config = require('../config');

/**
 * Cleans previously generated files.
 */
const clean = () => {
    const files = [
        config.docs,
        config.fonts,
        config.styles
    ];

    return Promise
        .all(files.map(item => fs.remove(item)))
        .then(() => {
            logger.info('Previously generated files removed');
        });
};

module.exports = clean;