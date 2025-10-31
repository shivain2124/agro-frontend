import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await API.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token);
      nav('/welcome');
    } catch {
      alert('Login failed. Please check credentials or signup.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-100">
      <h2 className="text-3xl font-bold mb-4">Login</h2>
      <input
        className="mb-3 p-2 border w-64"
        placeholder="Username"
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        className="mb-3 p-2 border w-64"
        type="password"
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
        onClick={handleLogin}
        className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded"
      >
        Login
      </button>

      <p className="mt-4">
        New user? <Link to="/signup" className="text-blue-600 underline">Signup here</Link>
      </p>
    </div>
  );
}