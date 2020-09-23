const glob = require('glob');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

function globFiles(pattern) {
    return Object.fromEntries(
        glob.sync(pattern).map(p => [path.parse(p).name, p])
    )
}

module.exports = [
    {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            alias: {
                'glaxier': path.resolve(__dirname, 'lib'),
                'glaxier$': path.resolve(__dirname, 'lib', 'index.ts'),
            }
        },
        devtool: 'source-map',
        entry: {
            lib: path.resolve('./lib'),
            main: path.resolve('./src/main.ts'),
        },
        target: 'electron-main',
        node: {
            __dirname: true,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: [path.resolve('./lib'), path.resolve('./src')],
                    use: {
                        loader: 'ts-loader',
                    },
                },
            ],
        },
        externals: {
            'glaxier': 'commonjs ./lib',
        },
        optimization: {
            concatenateModules: false,
            namedModules: true,
            namedChunks: true,
            splitChunks: {
                chunks: chunk => {
                    return !['main', 'lib'].includes(chunk.name);
                },
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                    }
                }
            },
        },
        output: {
            path: path.resolve('dist'),
            filename: '[name].js',
            libraryTarget: 'global',
            globalObject: 'this'
        },
        plugins: [
            new CopyPlugin({
                patterns: [
                    { from: 'assets' }
                ]
            }),
        ]
    },
    {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            alias: {
                'glaxier': path.resolve('./dist/lib.js'),
            }
        },
        devtool: 'source-map',
        entry: {
            ...globFiles('./src/scenes/*.ts'),
        },
        target: 'electron-renderer',
        node: {
            __dirname: true,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: [path.resolve('./lib'), path.resolve('./src/scenes/**/*')],
                    use: {
                        loader: 'ts-loader',
                    },
                },
            ],
        },
        externals: {
            'glaxier': 'global',
        },
        optimization: {
            splitChunks: {
                chunks: chunk => {
                    return !['renderer-lib'].includes(chunk.name);
                },
                cacheGroups: {
                    commons: {
                        test: /[\\/]node_modules[\\/]/,
                        name: 'vendors',
                    }
                }
            },
        },
        output: {
            path: path.resolve('dist'),
            filename: '[name].js',
            libraryTarget: 'global',
            globalObject: 'this',
        },
    },
]