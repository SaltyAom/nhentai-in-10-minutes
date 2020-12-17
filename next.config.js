const withStylus = require('@zeit/next-stylus')
const withBundleAnalyzer = require('@next/bundle-analyzer')({
	enabled: process.env.ANALYZE === 'true'
})

const preact = require('preact')

module.exports = withBundleAnalyzer(
	withStylus({
		experimental: {
			modern: true,
			polyfillsOptimization: true
		},
		images: {
			domains: ['i.nhentai.net', 't.nhentai.net'],
			deviceSizes: [640, 750, 828, 1080],
			imageSizes: [16, 32, 48, 64, 96],
			path: '/_next/image',
			loader: 'default'
		},
		webpack(config, { dev, isServer }) {
			config.resolve.alias = {
				...config.resolve.alias,
				react: 'preact/compat',
				'react-dom': 'preact/compat'
			}

			if (dev) {
				if (isServer) {
					// Remove circular `__self` and `__source` props only meant for
					// development. See https://github.com/developit/nextjs-preact-demo/issues/25
					let oldVNodeHook = preact.options.vnode
					preact.options.vnode = (vnode) => {
						const props = vnode.props
						if (props != null) {
							if ('__self' in props) props.__self = null
							if ('__source' in props) props.__source = null
						}

						if (oldVNodeHook) {
							oldVNodeHook(vnode)
						}
					}
				} else {
					// inject Preact DevTools
					const entry = config.entry
					config.entry = () =>
						entry().then((entries) => {
							entries['main.js'] = ['preact/debug'].concat(
								entries['main.js'] || []
							)
							return entries
						})
				}
			}

			return config
		}
	})
)
