var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require("extract-text-webpack-plugin");
var path = require('path');
var merge = require('webpack-merge');
var CleanWebpackPlugin = require('clean-webpack-plugin');

var cssLoaders = function(options) {
  options = options || {}
    // generate loader string to be used with extract text plugin
  function generateLoaders(loaders) {
    var sourceLoader = loaders.map(function(loader) {
      var extraParamChar
      if (/\?/.test(loader)) {
        loader = loader.replace(/\?/, '-loader?')
        extraParamChar = '&'
      } else {
        loader = loader + '-loader'
        extraParamChar = '?'
      }
      return loader + (options.sourceMap ? extraParamChar + 'sourceMap' : '')
    }).join('!')

    if (options.extract) {
      return ExtractTextPlugin.extract('vue-style-loader', sourceLoader, {
        publicPath: './'
      })
    } else {
      return ['vue-style-loader', sourceLoader].join('!')
    }
  }

  // http://vuejs.github.io/vue-loader/configurations/extract-css.html
  return {
    css: generateLoaders(['css', 'autoprefixer']),
    less: generateLoaders(['css', 'autoprefixer', 'less'])
  }
}

// Generate loaders for standalone style files (outside of .vue)
var styleLoaders = function(options) {
  var output = []
  var loaders = cssLoaders(options)
  for (var extension in loaders) {
    var loader = loaders[extension]
    output.push({
      test: new RegExp('\\.' + extension + '$'),
      loader: loader
    })
  }
  return output
}

var common = {
  entry: {
    app: './src/main.js'
  },
  output: {
    path: './build',
    filename: 'build.js'
  },
  resolve: {
    extensions: ['', '.js', '.vue', '.less', '.css'],
    alias: {
      'jquery': 'jquery',
      'axios': 'axios',
      'vue': 'vue/dist/vue.js'
    }
  },
  module: {
    loaders: [{
      test: /\.vue$/i,
      loader: 'vue'
    }, {
      test: /\.js$/i,
      loader: 'babel',
      exclude: /node_modules/
    }, {
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
      loader: 'url',
      query: {
        limit: 10000,
        name: '[name].[ext]'
      }
    }, {
      test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9=&.]+)?$/,
      loader: 'file-loader',
      query: {
        name: '[name].[ext]'
      }
    }]
  },
  plugins: [
    new webpack.ProvidePlugin({
      Vue: 'vue',
      $: 'jquery',
      axios: 'axios'
    })
  ],
  babel: {
    presets: ['es2015'],
    plugins: ['transform-runtime'],
    comments: false
  },
  vue: {
    loaders: cssLoaders()
  }
}

function randomNum() {
  return Math.floor(Math.random() * 10) % 3 + 1;
}

if (process.env.NODE_ENV !== 'production') {
  /**
   * Apply ESLint
   */
  // common.module.loaders.push({
  //   test: /\.(js|vue)$/,
  //   enforce: 'pre',
  //   exclude: /node_modules/,
  //   loader: 'eslint-loader',
  //   options: {
  //     formatter: require('eslint-friendly-formatter')
  //   }
  // })
}

switch (process.env.npm_lifecycle_event) {
  case 'release':
    config = merge(common, {
      output: {
        path: './build/',
        filename: '[name]_[hash:8].js',
        chunkFilename: '[name]_[chunkhash:8].js',
        publicPath: '//s' + randomNum() + '.hdslb.com/bfs/static/space/'
      },
      module: {
        loaders: styleLoaders({
          extract: true
        })
      },
      vue: {
        loaders: cssLoaders({
          extract: true
        })
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new HtmlWebpackPlugin({
          template: './index.html',
          filename: 'index.html'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('[name]_[hash:8].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash:8].js')
      ]
    })
    break;

  case 'test':
    config = merge(common, {
      output: {
        path: './build/',
        filename: '[name]_[hash:8].js',
        chunkFilename: '[name]_[chunkhash:8].js',
        publicPath: '//s1.hdslb.com/bfs/b/space/'
      },
      module: {
        loaders: styleLoaders({
          extract: true
        })
      },
      vue: {
        loaders: cssLoaders({
          extract: true
        })
      },
      plugins: [
        new webpack.optimize.UglifyJsPlugin({
          compress: {
            warnings: false
          }
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"production"'
          }
        }),
        new HtmlWebpackPlugin({
          template: './index.html',
          filename: 'index.html'
        }),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new ExtractTextPlugin('[name]_[hash:8].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor_[hash:8].js')
      ]
    })
    break;

  default:
    config = merge(common, {
      devtool: 'eval-source-map',
      output: {
        publicPath: 'http://localhost:8080/'
      },
      module: {
        loaders: styleLoaders()
      },
      devServer: {
        hot: true,
        inline: true,
        progress: true,
        compress: true,
        stats: 'errors-only',
        port: '8080',
        historyApiFallback: true
      },
      plugins: [
        new HtmlWebpackPlugin({
          template: './index.html',
          filename: 'index.html'
        }),
        new webpack.DefinePlugin({
          'process.env': {
            NODE_ENV: '"development"'
          }
        }),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.NoErrorsPlugin(),
        new ExtractTextPlugin('[name].css'),
        new webpack.optimize.CommonsChunkPlugin('vendor', 'vendor.js')
      ]
    });
    break;
}

module.exports = config;
