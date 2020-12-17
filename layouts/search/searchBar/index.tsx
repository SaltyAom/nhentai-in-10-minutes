import { FormEvent, FunctionComponent } from "react"

interface SearchLayoutProps {
	onSubmit: (event: FormEvent<HTMLFormElement>) => void
}

const Search: FunctionComponent<SearchLayoutProps> = ({ onSubmit }) => (
    <form onSubmit={onSubmit}>
        <label htmlFor="search">Find hentai</label>
        <input name="search" type="text" placeholder="Search" />
        <button>Search</button>
    </form>
)

export default Search