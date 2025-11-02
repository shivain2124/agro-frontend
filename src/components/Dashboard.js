import { useEffect, useState } from 'react';
import API from '../services/api';
import Layout from './layout/Layout';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [latest, setLatest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const res = await API.get('/soil/all');
        const rows = Array.isArray(res.data) ? res.data : [];
        setData(rows);
        if (rows.length > 0) {
          const sorted = [...rows].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
          setLatest(sorted[0]);
        } else {
          setLatest(null);
        }
      } catch (e) {
        setErr(e?.response?.data?.message || e?.message || 'Failed to fetch soil data');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <Layout title="Smart Soil Dashboard">
      {/* Top metric cards */}
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-6 mb-8">
        <Card title="Nitrogen (N)" value={latest?.N} color="bg-green-200" />
        <Card title="Phosphorus (P)" value={latest?.P} color="bg-blue-200" />
        <Card title="Potassium (K)" value={latest?.K} color="bg-yellow-200" />
        <Card title="pH" value={latest?.ph} color="bg-pink-200" />
        <Card title="Moisture" value={latest?.moisture} color="bg-cyan-200" />
      </div>

      {/* Latest reading */}
      <div className="bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">📅 Latest Soil Reading</h3>

        {loading && <p>Loading...</p>}
        <p>🌱 No soil readings found yet.</p>

        {!loading && !err && (
          latest ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <p><strong>Date:</strong> {new Date(latest.timestamp).toLocaleString()}</p>
              <p>
                <strong>Location:</strong>{' '}
                {latest.latitude ?? '–'}, {latest.longitude ?? '–'}
              </p>
              <p>
                <strong>NPK:</strong>{' '}
                {latest.N ?? '–'} / {latest.P ?? '–'} / {latest.K ?? '–'}
              </p>
              <p><strong>pH:</strong> {latest.ph ?? '–'}</p>
              <p><strong>Moisture:</strong> {latest.moisture ?? '–'}%</p>
              <p>
                <strong>Recommendation:</strong>{' '}
                {latest.recommendation?.crops?.length
                  ? latest.recommendation.crops.join(', ')
                  : 'N/A'}
              </p>
            </div>
          ) : (
            <div className="p-6 bg-yellow-50 border-l-4 border-yellow-400 rounded text-gray-700">
              <p>🌱 No soil readings found yet.</p>
              <p className="text-sm mt-1">
                Connect your ESP32 or upload sample data to start seeing readings here.
              </p>
            </div>
          )
        )}
      </div>

      {/* History table */}
      <div className="mt-10 bg-white p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-4">📊 Soil Reading History</h3>
        <div className="overflow-auto max-h-[360px] border rounded">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-left text-sm">
              <tr>
                <th className="p-2">Timestamp</th>
                <th className="p-2">Latitude</th>
                <th className="p-2">Longitude</th>
                <th className="p-2">N</th>
                <th className="p-2">P</th>
                <th className="p-2">K</th>
                <th className="p-2">pH</th>
                <th className="p-2">Moisture</th>
                <th className="p-2">Crops</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td className="p-2" colSpan={9}>Loading...</td></tr>
              ) : err ? (
                <tr><p><b>🌱 No soil readings found yet.</b></p></tr>
              ) : data.length === 0 ? (
                <tr><td className="p-2" colSpan={9}>No data yet</td></tr>
              ) : (
                data
                  .slice() // avoid mutating state
                  .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                  .map((entry, i) => (
                    <tr key={entry._id || i} className="border-t hover:bg-gray-50">
                      <td className="p-2">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : '–'}</td>
                      <td className="p-2">{entry.latitude ?? '–'}</td>
                      <td className="p-2">{entry.longitude ?? '–'}</td>
                      <td className="p-2">{entry.N ?? '–'}</td>
                      <td className="p-2">{entry.P ?? '–'}</td>
                      <td className="p-2">{entry.K ?? '–'}</td>
                      <td className="p-2">{entry.ph ?? '–'}</td>
                      <td className="p-2">{entry.moisture ?? '–'}{entry.moisture != null ? '%' : ''}</td>
                      <td className="p-2">
                        {entry.recommendation?.crops?.length
                          ? entry.recommendation.crops.join(', ')
                          : 'N/A'}
                      </td>
                    </tr>
                  ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  );
}

/* Small presentational card */
function Card({ title, value, color }) {
  return (
    <div className={`p-6 rounded shadow text-center ${color}`}>
      <h4 className="text-lg font-semibold mb-2">{title}</h4>
      <p className="text-2xl font-bold">
        {value !== undefined && value !== null ? value : '...'}
      </p>
    </div>
  );
}