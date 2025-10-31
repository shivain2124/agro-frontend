import { Link } from 'react-router-dom';

export default function Welcome() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-4xl font-bold mb-4">Welcome to Smart Agro Platform 🌱</h1>
      <p className="mb-6">Choose your next step:</p>
      <Link to="/dashboard" className="mr-4 bg-blue-600 text-white px-4 py-2">Dashboard</Link>
      <Link to="/irrigation" className="bg-green-600 text-white px-4 py-2">Irrigation</Link>
    </div>
  );
}
