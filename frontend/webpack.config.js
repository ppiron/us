path = require('path')

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'build'),
        filename: 'bundle.js'
    },
    watch: true,
    module: {
        rules: [
            {test: /\.js$/},
            {exclude: path.resolve(__dirname, './node_modules')},
            {use: 'babel-loader'},
        ]
    }
}

module.exports = config