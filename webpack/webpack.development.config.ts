﻿import webpack from 'webpack'
import baseConfig from './webpack.config'

(baseConfig.module as any).rules[1].use.unshift('style-loader') // Used to load CSS on dev-server

const config: webpack.Configuration & { devServer: any } = {
	...baseConfig,
	mode: 'development',
	devtool: 'cheap-source-map',

	output: {
		publicPath: 'http://localhost:1337/',
		filename: '[name].js'
	},

	resolve: {
		...baseConfig.resolve,
		alias: {
			...baseConfig.resolve.alias,
			'react-dom': '@hot-loader/react-dom'
		}
	},

	devServer: {
		historyApiFallback: true,
		port: 1337,
		overlay: true,
		stats: baseConfig.stats as any
	},

	plugins: [
		...baseConfig.plugins
	]
}

module.exports = config
