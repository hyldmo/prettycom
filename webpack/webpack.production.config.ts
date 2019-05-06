import HtmlWebpackPlugin from 'html-webpack-plugin'
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
import packageJSON from '../package.json'
import baseConfig from './webpack.config'

(baseConfig.module as any).rules[1].use.unshift(MiniCssExtractPlugin.loader)

const config: webpack.Configuration = {
	...baseConfig,

	output: {
		path: path.resolve(baseConfig.context, 'app'),
		filename: '[name]-[contenthash].js',
		chunkFilename: '[name]-[contenthash].js'
	},

	mode: 'production',
	devtool: 'source-map',
	plugins: [
		new HtmlWebpackPlugin({
			title: packageJSON.name,
			version: packageJSON.version,
			template: 'app/index.ejs',
			filename: 'index.html'
		}),
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css'
		}),
		...baseConfig.plugins
	]
}

module.exports = config
