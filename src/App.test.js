import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

// Routing tests isolate the canvas/network layer; graph presentation has its own tests.
jest.mock('./Features/Graph/GraphController', () => {
  const { useParams } = require('react-router-dom');
  return function GraphRoute({ impactMode }) {
    const { labId } = useParams();
    return <h1>{impactMode ? 'Impact' : 'Graph'} lab {labId}</h1>;
  };
});

jest.mock('react-password-checklist', () => () => null);

beforeEach(() => localStorage.clear());

test.each([
  ['/', 'Graph lab 1'],
  ['/graph/7', 'Graph lab 7'],
  ['/impact/7', 'Impact lab 7'],
])('opens the expected graph for %s', async (path, heading) => {
  render(<MemoryRouter initialEntries={[path]}><App /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: heading })).toBeInTheDocument();
});

test('unknown routes show the error page', async () => {
  render(<MemoryRouter initialEntries={['/missing-page']}><App /></MemoryRouter>);
  expect(await screen.findByRole('heading', { name: 'Sorry' })).toBeInTheDocument();
});
