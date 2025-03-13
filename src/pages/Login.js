import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import logo from '../assets/logo.png';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/login/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        throw new Error('Identifiants invalides');
      }
      const data = await response.json();
      localStorage.setItem('token', data.token);
      navigate('/tasks');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div class="homeContainer">
      <div class="logoContainer">
        <img src={logo} alt="Logo" style={{ width: '200px', marginBottom: '1rem' }} />
      </div>
      <h2>Hello !</h2>
      <p>Ravi de vous revoir ! </p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <input type="email" placeholder='    email' value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div>
          <input type="password" placeholder='    password' value={password} onChange={(e) => setPassword(e.target.value)} required />
        </div>
        <button type="submit" class="connect">Se connecter</button>
      </form>
      <p>
        Pas de compte ? <Link class="link" to="/register">Inscris-toi</Link>
      </p>
    </div>
  );
};

export default Login;
