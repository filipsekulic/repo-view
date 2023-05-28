import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import RepositoryList from './repository-list';

describe('RepositoryList', () => {
  const server = setupServer(
    rest.get('https://api.github.com/search/repositories', (req, res, ctx) => {
      const { tab } = req.url.searchParams;

      if (tab === 'React') {
        return res(
          ctx.json({
            items: [
              {
                id: 1,
                name: 'React Repository',
                stargazers_count: 100,
                forks_count: 50,
                owner: {
                  login: 'reactuser',
                  avatar_url: 'https://example.com/reactavatar.png'
                }
              }
            ],
            total_count: 1
          })
        );
      } else if (tab === 'Vue') {
        return res(ctx.json({ items: [], total_count: 0 }));
      } else {
        return res(ctx.status(500));
      }
    })
  );

  beforeAll(() => server.listen());
  afterEach(() => server.resetHandlers());
  afterAll(() => server.close());

  test('renders the RepositoryList component with search results and handles interactions', async () => {
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: 'React Repository',
                stargazers_count: 100,
                forks_count: 50,
                owner: {
                  login: 'reactuser',
                  avatar_url: 'https://example.com/reactavatar.png'
                }
              }
            ],
            total_count: 1
          })
      })
    );

    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    const searchResults = await screen.findByText('React Repository');
    expect(searchResults).toBeInTheDocument();
    expect(screen.getByText('Stars: 100')).toBeInTheDocument();
    expect(screen.getByText('Forks: 50')).toBeInTheDocument();
    expect(screen.getByText('Owner: reactuser')).toBeInTheDocument();

    window.fetch = originalFetch;
  });

  test('renders the RepositoryList component with no search results', async () => {
    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    const noResultsMessage = await screen.findByText('Loading repositories...');
    expect(noResultsMessage).toBeInTheDocument();
  });

  test('handles tab change', async () => {
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: 'Vue Repository',
                stargazers_count: 200,
                forks_count: 100,
                owner: {
                  login: 'vueuser',
                  avatar_url: 'https://example.com/vueavatar.png'
                }
              }
            ],
            total_count: 1
          })
      })
    );

    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Vue'));

    await waitFor(() => screen.getByText('Vue Repository'));

    expect(screen.getByText('Vue Repository')).toBeInTheDocument();
    expect(screen.getByText('Stars: 200')).toBeInTheDocument();
    expect(screen.getByText('Forks: 100')).toBeInTheDocument();
    expect(screen.getByText('Owner: vueuser')).toBeInTheDocument();

    window.fetch = originalFetch;
  });

  test('shows the loading message when there is an API error', async () => {
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({ status: 500 }));

    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText('Loading repositories...');
    expect(errorMessage).toBeInTheDocument();

    window.fetch = originalFetch;
  });

  test('handles page change', async () => {
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: 'React Repository',
                stargazers_count: 100,
                forks_count: 50,
                owner: {
                  login: 'reactuser',
                  avatar_url: 'https://example.com/reactavatar.png'
                }
              }
            ],
            total_count: 100
          })
      })
    );

    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('React Repository'));

    fireEvent.click(screen.getByText('Next'));

    await waitFor(() => screen.getByText('2'));

    expect(screen.getByText('2')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Previous'));

    await waitFor(() => screen.getByText('1'));

    expect(screen.getByText('1')).toBeInTheDocument();

    window.fetch = originalFetch;
  });

  test('handles sort change', async () => {
    const originalFetch = window.fetch;
    window.fetch = jest.fn().mockImplementation(() =>
      Promise.resolve({
        json: () =>
          Promise.resolve({
            items: [
              {
                id: 1,
                name: 'React Repository',
                stargazers_count: 100,
                forks_count: 50,
                owner: {
                  login: 'reactuser',
                  avatar_url: 'https://example.com/reactavatar.png'
                }
              }
            ],
            total_count: 1
          })
      })
    );

    render(
      <MemoryRouter>
        <RepositoryList />
      </MemoryRouter>
    );

    await waitFor(() => screen.getByText('React Repository'));

    fireEvent.change(screen.getByText('Stars'), { target: { value: 'Forks' } });

    await waitFor(() => screen.getByText('Forks'));

    expect(screen.getByText('Forks')).toBeInTheDocument();

    window.fetch = originalFetch;
  });
});
