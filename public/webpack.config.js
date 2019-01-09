var config = {
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            }
        ]
    },
    devServer: {
        publicPath: '/dist/'
      }
};

module.exports = (env, argv) => {
    config.devtool = 'source-map';
    
    return config;
};