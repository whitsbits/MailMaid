const path = require('path');

const getSrcPath = (filePath) => {
    const src = path.resolve(__dirname, 'src');
    return path.posix.join(src.replace(/\\/g, '/'), filePath);
  };
  
  const mode = 'development';//or 'production'

module.exports = {
    mode,
    context: __dirname,
    entry: {
      lib: getSrcPath('./src/lib.js'),
      main: getSrcPath('./src/main.js')
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist'),
      clean: true,
    },
    resolve: {
      extensions: ['.js'],
    },
    optimization: {
      minimize: false,
    },
    watchOptions: {
      ignored: ['**/dist', '**/node_modules'],
    },
      module: {
        rules: [
          {
            test: /\.m?js$/,
            exclude: /node_modules/,
            use: {
              loader: "babel-loader",
              options: {
                presets: ['@babel/preset-env']
              }
            }
          }
        ]
      },
      plugins: [
        new CopyPlugin([
            '',
            'appsscript.json',
            '.clasp.json'
          ])
      ]
};



