import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

test('renders Tic Tac Toe title', () => {
  render(<App />);
  const title = screen.getByText(/Tic Tac Toe/i);
  expect(title).toBeInTheDocument();
});

test('can make a move in PvP mode', () => {
  render(<App />);
  // Find the first cell and click
  const cells = screen.getAllByTestId('cell');
  expect(cells[0]).toBeInTheDocument();
  fireEvent.click(cells[0]);
  expect(cells[0].textContent).toBe('X');
  fireEvent.click(cells[1]);
  expect(cells[1].textContent).toBe('O');
});

test('game board exists', () => {
  render(<App />);
  const board = screen.getByTestId('ttt-board');
  expect(board).toBeInTheDocument();
});
