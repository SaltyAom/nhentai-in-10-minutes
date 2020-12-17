import { AppProps } from 'next/app'

import { Provider, createClient, defaultExchanges } from 'urql'
import { cacheExchange } from '@urql/exchange-graphcache'
import { persistedFetchExchange } from '@urql/exchange-persisted-fetch'
import { requestPolicyExchange } from '@urql/exchange-request-policy'

import AppLayout from '../layouts/app'

const cache = cacheExchange({
	keys: {
		NHApi: (hentai) => hentai.id.toString()
	}
})

const threeHours = 3 * 60 * 60 * 1000

export const exchanges = [
	...defaultExchanges,
	cache,
	persistedFetchExchange(),
	requestPolicyExchange({
		ttl: threeHours
	})
]

const client = createClient({
	url: 'https://nhql.saltyaom.com/graphql',
	exchanges
})

const App = ({ Component, pageProps }: AppProps) => (
	<Provider value={client}>
		<AppLayout>
			<Component {...pageProps} />
		</AppLayout>
	</Provider>
)

export default App
