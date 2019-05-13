import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import path from 'path'
import webpack from 'webpack'
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
		new MiniCssExtractPlugin({
			filename: '[name].css',
			chunkFilename: '[name].css'
		}),
		...baseConfig.plugins
	]
}

module.exports = config
