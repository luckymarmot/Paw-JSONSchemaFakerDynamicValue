import webpack from 'webpack';
import path from 'path';

const name = 'JSONSchemaFakerDynamicValue';

const production = process.env.NODE_ENV === 'production';

const config = {
  target: 'node-webkit',
  entry: [
    'json-schema-faker',
    './src/JSONSchemaFakerDynamicValue.js'
  ],
  output:{
    path: path.join(__dirname, './build/com.luckymarmot.PawExtensions.JSONSchemaFakerDynamicValue'),
    pathInfo: true,
    publicPath: '/build/',
    filename: name + '.js'
  },
  module: {
    loaders: [
      {
        loader: 'babel-loader',
        include: [
          path.resolve(__dirname, 'src')
        ],
        test: /\.js$/
      }
    ]
  }
};

module.exports = config;
