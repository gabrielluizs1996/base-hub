import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import '@testing-library/jest-dom';
import App from './app';

const renderApp = () =>
  render(
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );

describe('Order page', () => {
  it('should render main structure correctly', () => {
    renderApp();

    expect(screen.getByText(/exportar csv/i)).toBeInTheDocument();
    expect(screen.getByRole('table')).toBeInTheDocument();
  });

  it('should filter orders by ID', async () => {
    renderApp();
    const user = userEvent.setup();

    const idInput = screen.getByPlaceholderText(/ORD-0001/i);

    await user.type(idInput, 'ORD-0001');

    expect(screen.getByText('ORD-0001')).toBeInTheDocument();

    // validação REAL de filtro (importante)
    expect(screen.queryByText('ORD-0002')).not.toBeInTheDocument();
  });

  it('should filter orders by instrument', async () => {
    renderApp();
    const user = userEvent.setup();

    const instrumentInput = screen.getByPlaceholderText(/PETR4/i);

    await user.type(instrumentInput, 'PETR4');

    await waitFor(() => {
      const rows = screen.getAllByRole('row').slice(1);

      expect(rows.length).toBeGreaterThan(0);

      rows.forEach((row) => {
        expect(row).toHaveTextContent('PETR4');
        expect(row).not.toHaveTextContent('VALE3');
        expect(row).not.toHaveTextContent('ITUB4');
      });
    });
  });
});