import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../services/api';

export default function Signup() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const nav = useNavigate();

  const handleSignup = async () => {
    try {
      await API.post('/auth/signup', { username, password });
      alert('Signup successful! You can now log in.');
      nav('/'); // redirect to login
    } catch (error) {
      alert('Signup failed. Username might already exist.');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-green-100">
      <h2 className="text-3xl font-bold mb-4">Create New Account</h2>
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
        onClick={handleSignup}
        className="bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded"
      >
        Signup
      </button>
    </div>
  );
}