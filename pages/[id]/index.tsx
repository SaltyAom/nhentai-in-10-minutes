import { useCallback, FormEvent, Fragment, useState, useEffect } from 'react'

import { GetStaticPaths, GetStaticProps } from 'next'
import Head from 'next/head'
import { useRouter } from 'next/router'
import Image from 'next/image'

import { ClientOptions, ssrExchange } from 'urql'
import { withUrqlClient, initUrqlClient } from 'next-urql'

import Portal from '../../components/portal'

import { exchanges } from '../_app'

const query = `
    query($id: Int!) {
        getHentaiById(id: $id) {
            title {
                display
			}
			info {
				amount
			}
            metadata {
				language
				artist {
					name
				}
                tags {
                    name
                    count
                }
            }
            images {
                cover {
                    link
                    info {
                        width
                        height
                    }
                }
                pages {
                    link
                    info {
                        width
                        height
                    }
                }
            }
        }
    }
`

const NHentai = ({ id, nhentai, error }) => {
	let [isLoading, updateLoading] = useState(false)

	let router = useRouter()

	useEffect(() => {
		updateLoading(false)
	}, [id])

	let loadNewHentai = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		updateLoading(true)

		// @ts-ignore
		let id = event.srcElement[0].value

		router.push(`/${id}`)
	}, [])

	if (error)
		return (
			<Fragment>
				<h1>Error</h1>
				<Portal isLoading={isLoading} onSubmit={loadNewHentai} />
				<p>{JSON.stringify(error, null, 2)}</p>
			</Fragment>
		)

	if (!nhentai) return <h1>Loading</h1>

	if (!nhentai.images.cover.link)
		return (
			<Fragment>
				<h1>{id} not found</h1>
				<Portal isLoading={isLoading} onSubmit={loadNewHentai} />
			</Fragment>
		)

	return (
		<Fragment>
			<Head>
				<title>{nhentai.title.display}</title>
				<meta name="title" content={nhentai.title.display} />
				<meta name="description" content={`Read ${nhentai.title.display} ${nhentai.metadata.language}`} />
				<meta name="author" content={nhentai.metadata.artist.name} />

				<meta property="og:title" content={nhentai.title.display} />
				<meta property="og:description" content={`Read ${nhentai.title.display} ${nhentai.metadata.language}`}  />
				<meta property="article:author" content={nhentai.metadata.artist.name} />

				<meta
					property="og:image:width"
					content={nhentai.images.cover.link}
				/>
				<meta
					property="og:image:width"
					content={nhentai.images.cover.info.width}
				/>
				<meta
					property="og:image:height"
					content={nhentai.images.cover.info.height}
				/>
				<meta property="og:locale" content="en_US" />
				<meta property="og:type" content="website" />

				<meta name="twitter:card" content="summary_large_image" />

				<meta name="twitter:title" content={nhentai.title.display} />
				<meta name="twitter:description" content={`Read ${nhentai.title.display} ${nhentai.metadata.language}`} />
				<meta name="twitter:image" content={nhentai.images.cover.link} />
			</Head>
			<Portal isLoading={isLoading} onSubmit={loadNewHentai} />
			<header>
				<small>{id}</small>
				<h1>{nhentai.title.display}</h1>
				<div style={{ width: 300 }}>
				<Image
					objectFit="contain"
					src={nhentai.images.cover.link}
					width={nhentai.images.cover.info.width}
					height={nhentai.images.cover.info.height}
					alt={`${nhentai.title.display} cover`}
					/>
				</div>
				<p>Language: {nhentai.metadata.language}</p>
				<p>{nhentai.info.amount} pages</p>
				<ul>
					{nhentai.metadata.tags.map((tag) => (
						<li key={tag.name}>
							{tag.name} {tag.count}
						</li>
					))}
				</ul>
			</header>
			<main
				style={{
					maxWidth: 840,
					margin: 'auto',
					backgroundColor: '#efeff4'
				}}
			>
				{nhentai.images.pages.map((page, index) => (
					<Image
						objectFit="contain"
						key={page.link}
						src={page.link}
						width={page.info.width}
						height={page.info.height}
						alt={`${nhentai.title.display} page ${index + 1}`}
					/>
				))}
			</main>
		</Fragment>
	)
}

const ssrCache = ssrExchange({ isClient: false })

const createUrqlClient = (): ClientOptions => ({
	url: 'https://nhql.saltyaom.com/graphql',
	exchanges: [...exchanges, ssrCache]
})

export const getStaticPaths: GetStaticPaths = async () => {
	return {
		paths: [],
		fallback: true
	}
}

export const getStaticProps: GetStaticProps = async (context) => {
	const client = initUrqlClient(createUrqlClient(), false)

	let {
		params: { id }
	} = context

	let {
		data: { getHentaiById: nhentai },
		error
	} = await client
		.query(query, {
			id: +id
		})
		.toPromise()

	return {
		props: {
			nhentai,
			error: error || null,
			id
		},
		revalidate: 3600
	}
}

export default withUrqlClient(
	createUrqlClient,
	{ ssr: false } // Important so we don't wrap our component in getInitialProps
)(NHentai)
