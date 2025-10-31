import { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from './layout/Layout';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    API.get('/soil/all').then((res) => {
      setData(res.data);
      if (res.data.length > 0) {
        const sorted = [...res.data].sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );
        setLatest(sorted[0]);
      }
    });
  }, []);

  return (
    <Layout title="Smart Soil Dashboard">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <Card title="Nitrogen (N)" value={latest?.N} color="bg-green-200" />
        <Card title="Phosphorus (P)" value={latest?.P} color="bg-blue-200" />
        <Card title="Potassium (K)" value={latest?.K} color="bg-yellow-200" />
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">📅 Latest Soil Reading</h3>
        {latest ? (
          <div className="grid grid-cols-2 gap-4">
            <p><strong>Date:</strong> {new Date(latest.timestamp).toLocaleString()}</p>
            <p><strong>Location:</strong> {latest.latitude}, {latest.longitude}</p>
            <p><strong>NPK:</strong> {latest.N} / {latest.P} / {latest.K}</p>
            <p><strong>Recommendation:</strong> {latest.recommendation?.crops?.join(', ') || "N/A"}</p>
          </div>
        ) : (
          <p>No data yet</p>
        )}
      </div>

      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">📊 Soil Reading History</h3>
        <div className="overflow-auto max-h-[300px] border rounded">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Latitude</th>
                <th className="p-2">Longitude</th>
                <th className="p-2">N</th>
                <th className="p-2">P</th>
                <th className="p-2">K</th>
                <th className="p-2">Crops</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {data.map((entry, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-2">{new Date(entry.timestamp).toLocaleString()}</td>
                  <td className="p-2">{entry.latitude}</td>
                  <td className="p-2">{entry.longitude}</td>
                  <td className="p-2">{entry.N}</td>
                  <td className="p-2">{entry.P}</td>
                  <td className="p-2">{entry.K}</td>
                  <td className="p-2">{entry.recommendation?.crops?.join(', ') || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded shadow text-center ${color}`}>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-2xl font-bold">{value !== undefined ? value : '...'}</p>
    </div>
  );
}
