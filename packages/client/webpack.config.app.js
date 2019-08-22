const path = require('path');
const APP_PATH = path.resolve(__dirname, 'src');

const base= require('./webpack.config.base');

module.exports = {
    entry: {
        'main': path.join(APP_PATH, 'index.tsx')
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist'),
    },
    ...base
};
