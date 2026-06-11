import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Shield } from 'lucide-react';

export default function AuthCallbackPage() {
  const [params] = useSearchParams();
  const { setToken } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get('token');
    const error = params.get('error');

    if (error) {
      navigate(`/login?error=${error}`);
      return;
    }

    if (token) {
      setToken(token);
      navigate('/dashboard');
    } else {
      navigate('/login?error=no_token');
    }
  }, []);

  return (
    <div style={{
      minHeight: '100vh', background: 'var(--bg-primary)',
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 20,
    }}>
      <img src="/buglogo.png" alt="Bug Bounty AI" style={{
        width: 56, height: 56, borderRadius: 16,
        objectFit: 'cover', boxShadow: '0 0 24px rgba(0, 255, 157, 0.3)'
      }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <div className="spinner" />
        <span style={{ color: 'var(--text-secondary)', fontSize: 16 }}>Authenticating with GitHub...</span>
      </div>
    </div>
  );
}
