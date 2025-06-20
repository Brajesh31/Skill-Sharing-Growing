import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import LoadingSpinner from '../components/Public/LoadingSpinner';
import Preloader from '../components/Preloader';

const Callback = () => {
  const { handleCallback } = useContext(AuthContext);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processCallback = async () => {
      // Get the code from URL search params
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        setError('No authorization code found in the URL');
        return;
      }

      try {
        const success = await handleCallback(code);
        if (success) {
          // Redirect to home or dashboard
          navigate('/');
        } else {
          setError('Failed to authenticate. Please try again.');
        }
      } catch {
        setError('Authentication process failed. Please try again.');
      }
    };

    processCallback();
  }, [handleCallback, navigate]);

  if (error) {
    return (
      <div className="callback-error">
        <h3>Authentication Error</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/login')}>Return to Login</button>
      </div>
    );
  }

  return (
    <Preloader />
  );
};

export default Callback;
