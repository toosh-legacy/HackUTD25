import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          width: '100%',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: 'linear-gradient(to bottom right, #ffffff, #fce7f3)',
          padding: '2rem',
          textAlign: 'center'
        }}>
          <h1 style={{ color: '#e20074', marginBottom: '1rem' }}>Oops! Something went wrong</h1>
          <p style={{ marginBottom: '1rem' }}>We're sorry, but something went wrong. Please try refreshing the page.</p>
          <button 
            onClick={() => window.location.reload()}
            style={{
              backgroundColor: '#e20074',
              color: 'white',
              border: 'none',
              padding: '0.75rem 1.5rem',
              borderRadius: '0.5rem',
              cursor: 'pointer'
            }}
          >
            Refresh Page
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export { ErrorBoundary as default };