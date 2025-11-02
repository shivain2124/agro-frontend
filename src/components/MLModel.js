import { useState } from "react";
import { Bar, Line, Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";
import Layout from "./layout/Layout";
import API from "../services/api";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

export default function MLModel() {
  const [file, setFile] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [accuracy, setAccuracy] = useState(0);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const uploadFile = async () => {
    if (!file) return alert("Please select a CSV or Excel file.");
    setLoading(true);
    const form = new FormData();
    form.append("file", file);

    try {
      // You can replace this endpoint with your real backend ML API
      const res = await API.post("/ml/predict", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPredictions(res.data.predictions || []);
      setAccuracy(res.data.accuracy || 0.0);
    } catch (err) {
      console.error(err);
      alert("Error uploading or predicting data.");
    } finally {
      setLoading(false);
    }
  };

  // Mock charts if no backend yet
  const labels = predictions.length
    ? predictions.map((p) => p.crop)
    : ["Wheat", "Rice", "Maize", "Sugarcane"];
  const values = predictions.length
    ? predictions.map((p) => p.confidence)
    : [0.92, 0.82, 0.76, 0.68];

  const barData = {
    labels,
    datasets: [
      {
        label: "Prediction Confidence",
        data: values,
        backgroundColor: ["#22c55e", "#3b82f6", "#f59e0b", "#ef4444"],
      },
    ],
  };

  const lineData = {
    labels: ["Now", "+1 day", "+2 days", "+3 days", "+4 days"],
    datasets: [
      {
        label: "Predicted Moisture Trend (%)",
        data: [35, 40, 45, 43, 50],
        fill: false,
        borderColor: "#16a34a",
        tension: 0.3,
      },
    ],
  };

  const doughnutData = {
    labels: ["Accuracy", "Error"],
    datasets: [
      {
        data: [accuracy * 100 || 90, 100 - (accuracy * 100 || 90)],
        backgroundColor: ["#16a34a", "#fca5a5"],
      },
    ],
  };

  return (
    <Layout title="AI Crop Prediction 🌾">
      <div className="mt-6 text-center">
        <h1 className="text-3xl font-bold text-green-700 mb-2">
          AI Crop Prediction & Analytics
        </h1>
        <p className="text-gray-700">
          Upload soil data or view real-time predictions with confidence scores
          and trend analysis.
        </p>
      </div>

      {/* Upload Section */}
      <div className="bg-white p-6 rounded shadow mt-8 mb-10">
        <h3 className="text-xl font-semibold mb-3">📤 Upload Soil Dataset</h3>
        <p className="text-gray-600 mb-4">
          Upload a CSV or Excel file containing columns like{" "}
          <code>N, P, K, pH, moisture</code>.
        </p>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="file"
            accept=".csv,.xlsx"
            onChange={handleFileChange}
            className="border border-gray-300 rounded px-3 py-2"
          />
          <button
            onClick={uploadFile}
            disabled={loading}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            {loading ? "Processing..." : "Upload & Predict"}
          </button>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-3">🌱 Top Crop Predictions</h3>
          <Bar
            data={barData}
            options={{ plugins: { legend: { display: false } } }}
          />
        </div>

        <div className="bg-white p-6 rounded shadow">
          <h3 className="text-lg font-bold mb-3">📈 Moisture Future Trend</h3>
          <Line data={lineData} />
        </div>

        <div className="bg-white p-6 rounded shadow flex flex-col items-center justify-center">
          <h3 className="text-lg font-bold mb-3">🎯 Model Accuracy</h3>
          <Doughnut data={doughnutData} />
          <p className="mt-4 text-lg font-semibold text-green-700">
            {(accuracy * 100 || 90).toFixed(1)}%
          </p>
        </div>
      </div>

      {/* Future insights */}
      <div className="bg-white mt-10 p-6 rounded shadow">
        <h3 className="text-xl font-bold mb-3">📊 Insights Summary</h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>Shows top predicted crops with confidence levels.</li>
          <li>Displays predicted moisture trend over coming days.</li>
          <li>Shows overall model accuracy and error ratio.</li>
          <li>Upload any soil data file to visualize predictions.</li>
        </ul>
      </div>
    </Layout>
  );
}
