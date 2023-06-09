import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './repository-details.scss';
import { HEADER_CONFIGURATION } from '../utils/constants';

const RepositoryDetails = () => {
  const { owner, repo } = useParams();
  const [repository, setRepository] = useState(null);
  const [contributors, setContributors] = useState([]);
  const [languages, setLanguages] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchRepositoryDetails = async () => {
      try {
        const response = await fetch(
          `https://api.github.com/repos/${owner}/${repo}`,
          HEADER_CONFIGURATION
        );
        const data = await response.json();
        setRepository(data);

        const contributorsResponse = await fetch(data.contributors_url, HEADER_CONFIGURATION);
        const contributorsData = await contributorsResponse.json();
        setContributors(contributorsData.slice(0, 10));

        const languagesResponse = await fetch(data.languages_url, HEADER_CONFIGURATION);
        const languagesData = await languagesResponse.json();

        setLanguages(Object.keys(languagesData));
      } catch (error) {
        console.error('Error while fetching repository details:', error);
      }
    };

    fetchRepositoryDetails();
  }, [owner, repo]);

  const handleGoBack = () => {
    const searchParams = new URLSearchParams(window.location.search);

    const selectedTabParam = searchParams.get('tab');
    const pageParam = parseInt(searchParams.get('page'), 10);
    const sortParam = searchParams.get('sort');
    const orderByParam = searchParams.get('order');

    navigate(`/?tab=${selectedTabParam}&sort=${sortParam}&order=${orderByParam}&page=${pageParam}`);
  };

  if (repository === null) {
    return <p>Loading repository details...</p>;
  }
  return (
    <div className="repository-details-container">
      <button onClick={handleGoBack} className="repository-details-container__back-button">
        Back
      </button>
      <div className="repository-details-container__repo-details">
        <h2>Repository Details</h2>
        <h3>{repository.name}</h3>
        <p>Stars: {repository.stargazers_count}</p>
        <p>Forks: {repository.forks_count}</p>
        <p>Owner: {repository.owner.login}</p>
        <img
          src={repository.owner.avatar_url}
          alt={repository.owner.login}
          width={300}
          height={300}
        />
        <p>Open Issues: {repository.open_issues_count}</p>
        {contributors.length > 0 && (
          <>
            <h4>Contributors:</h4>
            <ul>
              {contributors.map((contributor) => (
                <li key={contributor.id}>{contributor.login}</li>
              ))}
            </ul>
          </>
        )}
        {languages.length > 0 && (
          <>
            <h4>Languages:</h4>
            <ul>
              {languages.map((language) => (
                <li key={language}>{language}</li>
              ))}
            </ul>
          </>
        )}
        {repository.topics.length > 0 && (
          <>
            <h4>Topics:</h4>
            <ul>
              {repository.topics.map((topic) => (
                <li key={topic}>{topic}</li>
              ))}
            </ul>
          </>
        )}
      </div>
    </div>
  );
};

export default RepositoryDetails;
