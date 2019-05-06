import path from 'path'
import webpack from 'webpack'
import { getFolders } from '../app/src/utils/webpack'
import jestConfig from '../jest.config.js'
import packageJSON from '../package.json'
import tsConfig from '../tsconfig.json'

const context = path.resolve(__dirname, '../')

const config: webpack.Configuration = {
	entry: './app/src/index.tsx',
	context,

	resolve: {
		alias: getFolders(path.join(context, tsConfig.compilerOptions.baseUrl)),
		extensions: jestConfig.moduleFileExtensions.map(ext => `.${ext}`)
	},

	module: {
		rules: [
			{
				test: /\.tsx?$/,
				loader: 'ts-loader'
			},
			{
				test: /\.scss$/,
				use: [
					...['css-loader', 'postcss-loader', 'sass-loader'].map(loader => ({
						loader,
						options: { sourceMap: true }
					}))
				]
			}
		]
	},

	plugins: [
		new webpack.DefinePlugin({
			'process.env.PACKAGE_NAME': JSON.stringify(packageJSON.name),
			'process.env.PACKAGE_VERSION': JSON.stringify(packageJSON.version)
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
