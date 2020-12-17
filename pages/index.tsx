import { FormEvent, Fragment, useCallback, useState } from 'react'

import { useRouter } from 'next/router'

import Portal from '../components/portal'

const Landing = () => {
	let [isLoading, updateLoading] = useState(false)

	let router = useRouter()

	let loadNewHentai = useCallback((event: FormEvent<HTMLFormElement>) => {
		event.preventDefault()
		updateLoading(true)

		let { value: id } = event.currentTarget
			.childNodes[1] as HTMLInputElement

		router.push(`/${id}`)
	}, [])

	return (
		<Fragment>
			<h1>
				nHentai{' '}
				<sub>
					<small>but made in 10 minutes</small>
				</sub>
			</h1>
			<Portal isLoading={isLoading} onSubmit={loadNewHentai} />
		</Fragment>
	)
}

export default Landing
