const path = require('path');
const APP_PATH = path.resolve(__dirname, 'src');
const base= require('./webpack.config.base');

module.exports = {
    entry: {
        'stats': path.join(APP_PATH, 'stats.ts'),
    },
    output: {
        filename: '[name].js',
        libraryTarget:'amd',
        path: path.resolve(__dirname, 'dist'),
    },
    ...base
};
