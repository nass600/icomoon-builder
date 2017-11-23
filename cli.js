const fs = require('fs-extra');
const path = require('path');
const bunyan = require('bunyan');
const chalk = require('chalk');
const decompress = require('decompress');
const PrettyStream = require('bunyan-prettystream');
const replace = require('replace-in-file');
const scssToJson = require('scss-to-json');

const stream = new PrettyStream();
stream.pipe(process.stdout);

var logger = bunyan.createLogger({
    name: 'artemis',
    streams: [{stream}]
});

const TEMP_DIR = '.tmp';
const DEST_DIR = '.';

const files = [
    {
        src: path.resolve(TEMP_DIR, 'demo.html'),
        dest: path.resolve(DEST_DIR, 'docs/demo/index.html')
    },
    {
        src: path.resolve(TEMP_DIR, 'demo-files/demo.css'),
        dest: path.resolve(DEST_DIR, 'docs/demo/styles.css')
    },
    {
        src: path.resolve(TEMP_DIR, 'demo-files/demo.js'),
        dest: path.resolve(DEST_DIR, 'docs/demo/scripts.js')
    },
    {
        src: path.resolve(TEMP_DIR, 'style.css'),
        dest: path.resolve(DEST_DIR, 'docs/demo/icons.css')
    },
    {
        src: path.resolve(TEMP_DIR, 'selection.json'),
        dest: path.resolve(DEST_DIR, 'docs/icomoon.json')
    }
];

const unzipIcomoon = (icomoonZipFile, destPath = TEMP_DIR) => {
    return decompress(icomoonZipFile, destPath).then(files => {
        logger.info(`${icomoonZipFile} unzipped.`);
    });
};

const moveFonts = () => {
    return fs.copy(path.resolve(TEMP_DIR, 'fonts'), path.resolve(DEST_DIR, 'fonts')).then(() => {
        logger.info('Fonts copied');
    });
};

const generateScss = () => {
    var icons = scssToJson(path.resolve(TEMP_DIR, 'variables.scss'));

    let iconsText = Object.entries(icons).map(([key, value]) => `  ${key}: ${value},\n`).join('');

    console.log(icons);

    var buffer = `
$icons: (
${iconsText}
);
    `;

    return fs.outputFile(path.resolve(DEST_DIR, 'scss/_variables.scss'), buffer);
};

const generateDemoFiles = () => {
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

const removeTempDir = (tempPath = TEMP_DIR) => {
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
        // .then(generateScss)
        // .then(removeTempDir)
        .then(() => {
            logger.info('All done');
            
            generateScss();
        });
}

module.exports = build;