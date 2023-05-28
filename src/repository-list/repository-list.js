import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useNavigate, useLocation } from 'react-router-dom';
import './repository-list.scss';
import { HEADER_CONFIGURATION } from '../utils/constants';

const RepositoryList = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const selectedTabParam = searchParams.get('tab') || 'React';
  const pageParam = parseInt(searchParams.get('page'), 10) || 1;
  const sortByParam = searchParams.get('sort') || 'stars';
  const sortOrderParam = searchParams.get('order') || 'desc';

  const [activeTab, setActiveTab] = useState(selectedTabParam);
  const [searchResults, setSearchResults] = useState([]);
  const [currentPage, setCurrentPage] = useState(pageParam);
  const [totalPages, setTotalPages] = useState(0);
  const [sortBy, setSortBy] = useState(sortByParam);
  const [sortOrder, setSortOrder] = useState(sortOrderParam);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
    setCurrentPage(1);
  };

  const handleSortOrderChange = (event) => {
    setSortOrder(event.target.value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const handleSearch = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/search/repositories?q=${activeTab}&sort=${sortBy}&order=${sortOrder}&page=${currentPage}`,
          HEADER_CONFIGURATION
        );

        const data = await response.json();

        setSearchResults(data.items);
        setTotalPages(Math.ceil(data.total_count / 10));
      } catch (error) {
        console.error('Error while searching repositories:', error);
      }
    };

    handleSearch();
  }, [activeTab, currentPage, sortBy, sortOrder]);

  useEffect(() => {
    const searchParams = new URLSearchParams();
    searchParams.set('tab', activeTab);
    searchParams.set('sort', sortBy);
    searchParams.set('order', sortOrder);
    searchParams.set('page', currentPage);

    navigate({ search: searchParams.toString() });
  }, [activeTab, currentPage, sortBy, sortOrder, navigate]);

  return (
    <div className="repository-list-container">
      <div className="repository-list-container__tab-bar">
        <button
          className="repository-list-container__tab-bar__button"
          onClick={() => handleTabChange('React')}>
          React
        </button>
        <button
          className="repository-list-container__tab-bar__button"
          onClick={() => handleTabChange('Vue')}>
          Vue
        </button>
        <button
          className="repository-list-container__tab-bar__button"
          onClick={() => handleTabChange('Angular')}>
          Angular
        </button>
      </div>

      <div className="repository-list-container__select-menu">
        Sort by
        <select
          value={sortBy}
          onChange={handleSortChange}
          className="repository-list-container__select-menu__select-option">
          <option value="stars">Stars</option>
          <option value="forks">Forks</option>
        </select>
        <select
          value={sortOrder}
          onChange={handleSortOrderChange}
          className="repository-list-container__select-menu__select-option">
          <option value="desc">Descending</option>
          <option value="asc">Ascending</option>
        </select>
      </div>

      {searchResults.length > 0 ? (
        <div className="repository-list-container__repositories">
          <ul>
            {searchResults.map((repository) => (
              <li
                key={repository.id}
                className="repository-list-container__repositories__repo-list-item">
                <Link
                  to={`/repositories/${repository.owner.login}/${repository.name}?tab=${activeTab}&sort=${sortBy}&order=${sortOrder}&page=${currentPage}`}>
                  <h3>{repository.name}</h3>
                </Link>
                <p>Stars: {repository.stargazers_count}</p>
                <p>Forks: {repository.forks_count}</p>
                <p>Owner: {repository.owner.login}</p>
                <img
                  src={repository.owner.avatar_url}
                  alt={repository.owner.login}
                  width={300}
                  height={300}
                />
              </li>
            ))}
          </ul>

          <div className="repository-list-container__repositories__pagination">
            {currentPage > 1 && (
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                className="repository-list-container__repositories__pagination__button">
                Previous
              </button>
            )}
            <span>{currentPage}</span>
            {currentPage < totalPages && (
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                className="repository-list-container__repositories__pagination__button">
                Next
              </button>
            )}
          </div>
        </div>
      ) : (
        <p>Loading repositories...</p>
      )}
    </div>
  );
};

export default RepositoryList;
