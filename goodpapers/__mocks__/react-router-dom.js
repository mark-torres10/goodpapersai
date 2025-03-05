// Import React since we're using JSX
const React = require('react');

// Mock for react-router-dom
module.exports = {
  useNavigate: jest.fn(() => jest.fn()),
  useParams: jest.fn(() => ({})),
  useLocation: jest.fn(() => ({ pathname: '/', search: '', hash: '', state: null })),
  BrowserRouter: function BrowserRouter({ children }) { return children; },
  Routes: function Routes({ children }) { return children; },
  Route: function Route({ children }) { return children; },
  Link: function Link({ children, to }) { return React.createElement('a', { href: to }, children); },
  Navigate: function Navigate({ to }) { return React.createElement('div', {}, `Navigate to ${to}`); }
}; 