import { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
} from 'chart.js';
import API from '../services/api';
import Layout from './layout/Layout';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend);

export default function Irrigation() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    API.get('/soil/all')
      .then((res) => {
        const rows = Array.isArray(res.data) ? res.data : [];
        setData(rows);
        if (rows.length > 0) {
          const sorted = [...rows].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLatest(sorted[0]);
        }
      })
      .catch((err) => console.error(err));
  }, []);

  // Moisture levels & timestamps for chart
  const moistureLevels = data.map((s) => s.moisture || 0);
  const timestamps = data.map((s) =>
    new Date(s.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  );

  const chartData = {
    labels: timestamps.slice(-10),
    datasets: [
      {
        label: 'Soil Moisture (%)',
        data: moistureLevels.slice(-10),
        borderColor: '#16a34a',
        backgroundColor: 'rgba(22,163,74,0.3)',
        fill: true,
        tension: 0.3,
      },
    ],
  };

  // Dynamic irrigation advice
  const irrigationAdvice = () => {
    if (!latest) return 'No soil data yet.';
    const m = latest.moisture ?? 0;
    if (m < 30) return '💧 Soil is too dry — irrigation required immediately.';
    if (m >= 30 && m <= 70) return '🌿 Moisture is optimal — no irrigation needed.';
    return '⚠️ Soil is too wet — pause irrigation and allow drainage.';
  };

  return (
    <Layout title="Irrigation Control Panel 💧">
      <div className="text-center mt-6 mb-10">
        <h1 className="text-3xl font-bold text-green-700">Irrigation Control Panel 💧</h1>
        <p className="mt-3 text-gray-700">
          Monitor soil moisture, view trends, and get real-time irrigation suggestions.
        </p>
      </div>

      {/* Section 1: Live Reading */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">📊 Latest Soil Condition</h3>
        {latest ? (
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <InfoCard title="Moisture (%)" value={latest.moisture ?? '–'} color="bg-cyan-100" />
            <InfoCard title="pH Level" value={latest.ph ?? '–'} color="bg-pink-100" />
            <InfoCard title="Last Update" value={new Date(latest.timestamp).toLocaleString()} color="bg-green-100" />
          </div>
        ) : (
          <p>No data received yet.</p>
        )}
      </div>

      {/* Section 2: Irrigation Advice */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">🌾 Smart Irrigation Suggestion</h3>
        <div
          className={`p-4 rounded text-lg font-semibold ${
            latest?.moisture < 30
              ? 'bg-red-100 text-red-700'
              : latest?.moisture > 70
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}
        >
          {irrigationAdvice()}
        </div>
      </div>

      {/* Section 3: Moisture Trend Chart */}
      <div className="bg-white p-6 rounded shadow mb-8">
        <h3 className="text-xl font-semibold mb-4">📈 Moisture Trend (Recent Readings)</h3>
        {data.length > 0 ? (
          <Line data={chartData} options={{ responsive: true, plugins: { legend: { display: false } } }} />
        ) : (
          <p>No moisture data available for graph.</p>
        )}
      </div>

      {/* Section 4: Pump Control (Coming Soon) */}
      <div className="bg-white p-6 rounded shadow text-center">
        <h3 className="text-xl font-semibold mb-2">⚙️ Irrigation Pump Control</h3>
        <p className="text-gray-600">Hardware-based control module integration coming soon!</p>
        <div className="mt-4">
          <button className="bg-green-600 text-white px-5 py-2 rounded mr-3 hover:bg-green-700 cursor-not-allowed opacity-50">
            Start Pump
          </button>
          <button className="bg-red-500 text-white px-5 py-2 rounded hover:bg-red-600 cursor-not-allowed opacity-50">
            Stop Pump
          </button>
        </div>
      </div>
    </Layout>
  );
}

function InfoCard({ title, value, color }) {
  return (
    <div className={`p-6 rounded shadow ${color}`}>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-2xl font-bold">{value}</p>
    </div>
  );
}