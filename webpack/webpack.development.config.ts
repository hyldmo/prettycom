import HtmlWebpackPlugin from 'html-webpack-plugin'
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin')
import path from 'path'
import webpack from 'webpack'
import packageJSON from '../package.json'
import baseConfig from './webpack.config'

(baseConfig.module as any).rules[1].use.unshift('style-loader') // Used to load CSS on dev-server

const config: webpack.Configuration = {
	...baseConfig,
	mode: 'development',
	devtool: 'cheap-eval-source-map',

	output: {
		publicPath: 'http://localhost:1337/',
		filename: '[name].js'
	},

	devServer: {
		historyApiFallback: true,
		port: 1337,
		overlay: true,
		stats: baseConfig.stats as any
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: packageJSON.name,
			version: packageJSON.version,
			template: 'app/index.ejs',
			filename: path.resolve(baseConfig.context, 'app/index.html'),
			alwaysWriteToDisk: true
		}),
		new HtmlWebpackHarddiskPlugin(),
		...baseConfig.plugins
	]
}

module.exports = config
