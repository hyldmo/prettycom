import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import webpack from 'webpack'
import { getFolders } from './utils'
import packageJSON from '../package.json'
import tsConfig from '../tsconfig.json'

const context = path.resolve(__dirname, '../')

const config: webpack.Configuration = {
	entry: './app/src/index.tsx',
	context,

	resolve: {
		alias: getFolders(path.join(context, tsConfig.compilerOptions.baseUrl)),
		extensions: ['.js', '.ts', '.tsx', '.scss', '.css']
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.scss$/,
				use: ['css-loader', 'postcss-loader', 'sass-loader'].map(loader => ({
					loader,
					options: { sourceMap: true }
				}))
			}
		]
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: packageJSON.name,
			version: packageJSON.version,
			template: 'app/index.ejs',
			filename: 'index.html'
		}),
		new webpack.DefinePlugin({
			'process.env.PACKAGE_NAME': JSON.stringify(packageJSON.name),
			'process.env.PACKAGE_VERSION': JSON.stringify(packageJSON.version),
			'process.env.PACKAGE_REPO': JSON.stringify(packageJSON.repository)
		})
	],

	optimization: {
		splitChunks: {
			cacheGroups: {
				vendor: {
					chunks: 'initial',
					test: path.resolve(context, 'node_modules'),
					name: 'vendor',
					enforce: true
				}
			}
		}
	},

	stats: {
		assets: true,
		children: false,
		chunks: false,
		hash: false,
		modules: false,
		publicPath: true,
		timings: false,
		version: false,
		warnings: true
	}
}

export default config
