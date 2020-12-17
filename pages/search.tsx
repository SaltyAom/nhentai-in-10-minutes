import { FormEvent, Fragment, useCallback, useEffect, useState } from 'react'

import Image from 'next/image'
import Link from 'next/link'

import { useQuery } from 'urql'

import SearchLayout from '../layouts/search'

const query = `
    query($keyword: String!, $page: Int!) {
        searchHentai(keyword: $keyword, page: $page) {
			id
            title {
                display
			}
			info {
				amount
			}
            metadata {
                language
            }
            images {
                cover {
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

const SearchPage = () => {
	let [keyword, updateKeyword] = useState(''),
		[hentais, updateHentais] = useState([]),
		[page, updatePage] = useState(1)

	let [result, reFetch] = useQuery({
		query,
		variables: {
			keyword,
			page
		},
		pause: !keyword
	})

	let { data, fetching: isLoading, error } = result

	let searchHentai = useCallback(
		(event: FormEvent<HTMLFormElement>): void => {
			event.preventDefault()

			let { value: searchKey } = event.currentTarget
				.childNodes[1] as HTMLInputElement

			updateKeyword(searchKey)
		},
		[updateKeyword]
	)

	let loadNextPage = useCallback(() => {
		updatePage(page + 1)
		reFetch()
	}, [reFetch, page, updatePage])

	useEffect(() => {
		updateHentais([])
		updatePage(1)
	}, [keyword, updateHentais, updatePage])

	if (!keyword) {
		return <SearchLayout onSearch={searchHentai} />
	}

	let noHentaiLoadYet = !hentais.length

	if (error && noHentaiLoadYet)
		return (
			<SearchLayout onSearch={searchHentai}>
				<h1>Not Found</h1>
			</SearchLayout>
		)

	if ((isLoading || !data) && noHentaiLoadYet)
		return (
			<SearchLayout onSearch={searchHentai}>
				<p>Loading</p>
			</SearchLayout>
		)

	let { searchHentai: currentPage } = data

	useEffect(() => {
		updateHentais([...hentais, ...currentPage])
	}, [currentPage])

	return (
		<SearchLayout onSearch={searchHentai}>
			<p>Results</p>
			{ !noHentaiLoadYet ? (
				<main>
					{hentais.map((hentai) => (
						<Link href="/[id]" as={`/${hentai.id}`}>
							<a href={`/${hentai.id}`} role="article">
								<Image
									objectFit="contain"
									key={hentai.id}
									src={hentai.images.cover.link}
									width={hentai.images.cover.info.width}
									height={hentai.images.cover.info.height}
									alt={hentai.title.display}
								/>
								<h3>{hentai.title.display}</h3>
								<p>{hentai.info.amount} pages</p>
								<p>Language: {hentai.metadata.language}</p>
							</a>
						</Link>
					))}
				</main>
			) : (
				<h4>Not Found</h4>
			)}
			{isLoading ? (
				<p>Loading</p>
			) : !error && currentPage.length ? (
				<button onClick={loadNextPage}>Load more</button>
			) : null}
		</SearchLayout>
	)
}

export default SearchPage
