const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const extractSass = new ExtractTextPlugin({
	disable: true,
});

const {
	imageLoaderConfiguration,
	babelLoaderConfiguration,
	sassLoaderConfiguration,
} = require('./loaderConfiguration')(extractSass);

const devServer = {
	contentBase: path.join(__dirname, 'dist'),
	// enable HMR
	hot: true,
	// embed the webpack-dev-server runtime into the bundle
	inline: true,
	// serve index.html in place of 404 responses to allow HTML5 history
	historyApiFallback: true,
	port: 3000,
};
module.exports = {
	// ...the rest of your config
	devServer,
	entry: [
		'react-hot-loader/patch',
		path.resolve(__dirname, '../index.web.js'),
		path.resolve(__dirname, '../src/sass/app.scss'),
	],
	module: {
		rules: [
			babelLoaderConfiguration,
			imageLoaderConfiguration,
			sassLoaderConfiguration,
			{
				test: /\.(ttf|eot|woff|woff2|svg)$/,
				loader: 'url-loader',
			},
		],
	},
	output: {
		path: path.join(__dirname, 'dist'),
		filename: 'app.js',
		publicPath: '/',
	},
	devtool: 'source-map',
	plugins: [
		extractSass,
		new webpack.NamedModulesPlugin(),
		new webpack.HotModuleReplacementPlugin(),
		// `process.env.NODE_ENV === 'production'` must be `true` for production
		// builds to eliminate development checks and reduce build size. You may
		// wish to include additional optimizations.
		new webpack.DefinePlugin({
			'process.env.NODE_ENV': JSON.stringify('development'),
		}),
	],
	resolve: {
		// If you're working on a multi-platform React Native app, web-specific
		// module implementations should be written in files using the extension
		// `.web.js`.
		extensions: ['.web.js', '.web.jsx', '.js', '.jsx'],
	},
};
