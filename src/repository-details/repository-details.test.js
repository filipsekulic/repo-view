import React from 'react';
import { render, waitFor, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import RepositoryDetails from './repository-details';

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: () => ({ owner: 'some-owner', repo: 'some-repo' }),
  useNavigate: jest.fn()
}));

describe('RepositoryDetails', () => {
  test('renders repository details after data is fetched', async () => {
    const repository = {
      name: 'Some Repository',
      stargazers_count: 10,
      forks_count: 5,
      owner: {
        login: 'some-owner',
        avatar_url: 'https://example.com/avatar.png'
      },
      open_issues_count: 3,
      topics: ['topic1', 'topic2']
    };

    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(repository)
    });

    render(
      <MemoryRouter initialEntries={['/some-owner/some-repo']}>
        <Routes>
          <Route path="/:owner/:repo" element={<RepositoryDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Repository Details')).toBeInTheDocument();
      expect(screen.getByText('Some Repository')).toBeInTheDocument();
      expect(screen.getByText('Stars: 10')).toBeInTheDocument();
      expect(screen.getByText('Forks: 5')).toBeInTheDocument();
      expect(screen.getByText('Owner: some-owner')).toBeInTheDocument();
      expect(screen.getByAltText('some-owner')).toBeInTheDocument();
      expect(screen.getByText('Open Issues: 3')).toBeInTheDocument();
      expect(screen.getByText('Topics:')).toBeInTheDocument();
    });
  });

  test('displays loading message when repository details are being fetched', async () => {
    jest.spyOn(global, 'fetch').mockResolvedValueOnce({
      json: jest.fn().mockResolvedValueOnce(null)
    });

    render(
      <MemoryRouter initialEntries={['/some-owner/some-repo']}>
        <Routes>
          <Route path="/:owner/:repo" element={<RepositoryDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading repository details...')).toBeInTheDocument();
    });
  });

  test('renders contributors after data is fetched', async () => {
    const repository = {
      name: 'Some Repository',
      stargazers_count: 10,
      forks_count: 5,
      owner: {
        login: 'some-owner',
        avatar_url: 'https://example.com/avatar.png'
      },
      open_issues_count: 3,
      contributors_url: 'https://example.com/contributors',
      topics: ['topic1', 'topic2']
    };

    const contributors = [
      { id: 1, login: 'contributor1' },
      { id: 2, login: 'contributor2' }
    ];

    jest
      .spyOn(global, 'fetch')
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(repository)
      })
      .mockResolvedValueOnce({
        json: jest.fn().mockResolvedValueOnce(contributors)
      });

    render(
      <MemoryRouter initialEntries={['/some-owner/some-repo']}>
        <Routes>
          <Route path="/:owner/:repo" element={<RepositoryDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Contributors:')).toBeInTheDocument();
      expect(screen.getByText('contributor1')).toBeInTheDocument();
      expect(screen.getByText('contributor2')).toBeInTheDocument();
    });
  });

  test('displays loading message when data fetching fails', async () => {
    jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Failed to fetch data'));

    render(
      <MemoryRouter initialEntries={['/some-owner/some-repo']}>
        <Routes>
          <Route path="/:owner/:repo" element={<RepositoryDetails />} />
        </Routes>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Loading repository details...')).toBeInTheDocument();
    });
  });
});
