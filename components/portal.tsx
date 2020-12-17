const Portal = ({ onSubmit, isLoading }) => (
	<form onSubmit={onSubmit}>
		<label htmlFor="hentai id">6 digits code</label>
		<input name="hentai id" type="number" pattern="[0-9]{6}" inputMode="numeric" placeholder="Hentai ID" />
		<button>Read</button>
		{isLoading && <p>Loading...</p>}
	</form>
)

export default Portal
