function Search({searchTerm, setSearchTerm}) {
    return (
        <div className="user-search-area">
            <input type="text" 
                className="user-search-text" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Users"
            />
            <i className="fa fa-search user-search-btn" aria-hidden="true"></i>
        </div>
    )
}

export default Search;