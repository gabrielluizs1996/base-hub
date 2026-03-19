import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './app';

describe('Order page', () => {
  const renderApp = () =>
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>,
    );

  it('should render without crashing', () => {
    const { baseElement } = renderApp();
    expect(baseElement).toBeInTheDocument();

    expect(screen.getByText(/exportar csv/i)).toBeInTheDocument();
    expect(screen.getByText(/ordem/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();

    // filtros básicos
    expect(screen.getByPlaceholderText(/PETR4/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/ORD-0001/i)).toBeInTheDocument();
  });

  it('should filter by ID', async () => {
    renderApp();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/ORD-0001/i);
    await user.type(input, 'ORD-');
    const items = screen.getAllByText(/ORD-/i);
    expect(items[0]).toBeInTheDocument();
  });

   it('should filter by instrument', async () => {
    renderApp();
    const user = userEvent.setup();
    const input = screen.getByPlaceholderText(/PETR4/i);
    await user.type(input, 'PETR4');
    const items = screen.getAllByText(/PETR4/i);
    expect(items[0]).toBeInTheDocument();
  });
});
