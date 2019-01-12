const path = require('path')

const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssPlugin = require('mini-css-extract-plugin')
const OptimiseCssAssetsPlugin = require('optimize-css-assets-webpack-plugin')


module.exports = {
	entry: {
		popup: path.resolve(__dirname, 'src', 'popup', 'popup.js'),
	},
	output: {
		path: path.resolve(__dirname, 'build'),
		filename: '[name].[hash].js'
	},
	module: {
		rules: [{
			test: /\.js/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [[ '@babel/env', {
						targets: {
							firefox: 60,
						}
					}]]
				}
			}
		}, {
			test: /\.s?css/,
			use: [
				MiniCssPlugin.loader,
				'css-loader',
				{
					loader: 'sass-loader',
				}
			]
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: path.resolve(__dirname, 'src', 'popup', 'popup.html'),
			filename: 'popup.html',
			chunks: [ 'popup' ],
		}),
		new MiniCssPlugin({
			filename: '[name].[hash].css',
			chunkFilename: '[id].[hash].css',
		}),
		new OptimiseCssAssetsPlugin(),
	],
	resolve: {
		alias: {
			Popup: path.resolve(__dirname, 'src', 'popup'),
		}
	}
}
