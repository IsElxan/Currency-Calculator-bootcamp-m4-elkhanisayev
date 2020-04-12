module.exports = {
    mode: 'production',
    entry: './index.js',
    output: {
        filename: './main.minified.js',
        // change
    },
    module: {
        rules: [
            {
             test: /\.js$/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                    },
                },
            },
        ],
    },
};
