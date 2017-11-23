const fs = require('fs-extra');
const path = require('path');
const chalk = require('chalk');
const decompress = require('decompress');
const replace = require('replace-in-file');
const logger = require('../logger');
const config = require('../config');

const unzipIcomoon = (icomoonZipFile, destPath = config.temp) => {
    return decompress(icomoonZipFile, destPath).then(files => {
        logger.info(`${icomoonZipFile} unzipped.`);
    });
};

const moveFonts = () => {
    return fs.copy(
        path.resolve(config.temp, 'fonts'),
        config.fonts
    ).then(() => {
        logger.info('Fonts copied');
    });
};

const moveStyles = () => {
    const files = [
        {
            src: path.resolve(config.temp, 'style.scss'),
            dest: path.resolve(config.styles, 'icons.scss')
        },
        {
            src: path.resolve(config.temp, 'variables.scss'),
            dest: path.resolve(config.styles, '_variables.scss')
        }
    ];

    return Promise
        .all(files.map(item => fs.copy(item.src, item.dest)))
        .then(() => {
            logger.info('Styles copied');
        });
};

const generateDemoFiles = () => {
    const files = [
        {
            src: path.resolve(config.temp, 'demo.html'),
            dest: path.resolve(config.docs, 'demo/index.html')
        },
        {
            src: path.resolve(config.temp, 'demo-files/demo.css'),
            dest: path.resolve(config.docs, 'demo/styles.css')
        },
        {
            src: path.resolve(config.temp, 'demo-files/demo.js'),
            dest: path.resolve(config.docs, 'demo/scripts.js')
        },
        {
            src: path.resolve(config.temp, 'style.css'),
            dest: path.resolve(config.docs, 'demo/icons.css')
        },
        {
            src: path.resolve(config.temp, 'selection.json'),
            dest: path.resolve(config.docs, 'icomoon.json')
        }
    ];

    return Promise
        .all(files.map(item => fs.copy(item.src, item.dest)))
        .then(() => replace({
            files: 'docs/demo/index.html',
            from: [
                'demo-files/demo.css',
                'demo-files/demo.js',
                'style.css'
            ],
            to: [
                'styles.css', 
                'scripts.js', 
                'icons.css'
            ],
        }))
        .then(() => replace({
            files: 'docs/demo/icons.css',
            from: [/url\('fonts\//g],
            to: ['url(\'../../fonts/'],
        }))
        .then(() => {
            logger.info('Files replaced');
        });
};

const removeTempDir = (tempPath = config.temp) => {
    return fs.remove(tempPath).then(err => {
        if (err) {
            logger.error(err);
            return;
        }

        logger.info(`Removed directory ${chalk.white(tempPath)}`);
    });
};

const build = (icomoonZipFile) => {
    unzipIcomoon(icomoonZipFile)
        .then(moveFonts)
        .then(generateDemoFiles)
        .then(moveStyles)
        .then(removeTempDir)
        .then(() => {
            logger.info('All done');
        });
}

module.exports = build;