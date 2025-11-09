import React from 'react';

export default function LoadingScreen() {
  return (
    <div style={{
      width: '100%',
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(to bottom right, #ffffff, #fce7f3)',
      fontFamily: 'Inter, system-ui, sans-serif'
    }}>
      <img
        src="/t-mobile-logo.png"
        alt="T-Mobile"
        style={{
          width: '150px',
          marginBottom: '2rem'
        }}
      />
      <div style={{
        width: '40px',
        height: '40px',
        border: '3px solid #fce7f3',
        borderTop: '3px solid #e20074',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
        marginBottom: '1rem'
      }} />
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
      <div style={{
        color: '#e20074',
        fontSize: '1.25rem',
        fontWeight: '500'
      }}>
        Loading...
      </div>
    </div>
  );
}