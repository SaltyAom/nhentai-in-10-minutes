import { Fragment, FunctionComponent } from 'react'

import Link from 'next/link'

const AppLayout: FunctionComponent = ({ children }) => (
	<Fragment>
		<nav>
			<header>
				<Link href="/">
					<a role="heading" aria-level={1}>
						nHentai{' '}
						<sub>
							<small>but made in 10 minutes</small>
						</sub>
					</a>
				</Link>
			</header>
			<section>
				<Link href="/search">
					<a role="heading" aria-level={2}>
						search
					</a>
				</Link>
			</section>
		</nav>
		{children}
	</Fragment>
)

export default AppLayout
