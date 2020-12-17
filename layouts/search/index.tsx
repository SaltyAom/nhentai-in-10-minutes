import { FormEvent, Fragment, FunctionComponent } from 'react'

import Search from './searchBar'

interface SearchLayoutProps {
	onSearch: (event: FormEvent<HTMLFormElement>) => void
}

const SearchLayout: FunctionComponent<SearchLayoutProps> = ({ onSearch, children }) => (
	<Fragment>
		<h1>Search</h1>
		<Search onSubmit={onSearch} />
		{children}
	</Fragment>
)

export default SearchLayout
