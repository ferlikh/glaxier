const glob = require('glob');
const path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

function globFiles(pattern) {
    return Object.fromEntries(
        glob.sync(pattern).map(p => [path.parse(p).name, p])
    )
}

function globFolder(dir) {
    const { name } = path.parse(dir);
    return {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            alias: {
                'glaxier': path.resolve('lib'),
            }
        },
        devtool: 'inline-source-map',
        entry: globFiles(dir + '*.ts'),
        target: 'electron-renderer',
        node: {
            __dirname: true,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: [path.resolve('./lib/renderer'), path.resolve(dir)],
                    loader: 'ts-loader',
                },
            ],
        },
        externals: {
            glaxier: 'global'
        },
        output: {
            path: path.resolve('dist'),
            filename: `scenes/${name}/[name].js`,
            libraryTarget: 'global',
            globalObject: 'this',
        },
    };
}

function globFolders(dirs) {
    return dirs.map(dir => globFolder(dir));
}

module.exports = [
    {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            alias: {
                'glaxier': path.resolve('lib'),
            }
        },
        entry: path.resolve('./lib'),
        target: 'node',
        node: {
            __dirname: true,
            __filename: false
        },
        module: {
            rules: [
                {
                    test: /\.(ts|tsx)$/,
                    include: [path.resolve('./lib')],
                    use: {
                        loader: 'ts-loader',
                        options: {
                            configFile: "tsconfig.lib.json"
                        }
                    },
                },
            ],
        },
        externals: {
            'glaxier': 'commonjs ./lib',
        },
        output: {
            path: path.resolve('dist/bundles'),
            filename: 'index.js',
            libraryTarget: 'commonjs',
            globalObject: 'this'
        },
    },
    {
        resolve: {
            extensions: ['.ts', '.tsx', '.js'],
            modules: ['node_modules'],
            alias: {
                'glaxier': path.resolve('lib'),
            }
        },
        devtool: 'inline-source-map',
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
                'glaxier': path.resolve('lib'),
            }
        },
        devtool: 'inline-source-map',
        entry: {
            'renderer-lib': path.resolve('./lib'),
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
                    include: [path.resolve('./lib'), path.resolve('./src/scenes/*.ts')],
                    loader: 'ts-loader',
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
            filename: (pathData) => {
                const sceneDir = path.resolve('./src/scenes');
                const isScene = pathData.chunk.entryModule.context === sceneDir;
                return isScene ? 'scenes/[name].js' : '[name].js';
            },
            libraryTarget: 'global',
            globalObject: 'this',
        },
    },
    ...globFolders(glob.sync('./src/scenes/*/'))
]