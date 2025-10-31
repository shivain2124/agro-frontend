import { useState } from 'react';
import Layout from './layout/Layout';

export default function Profile() {
  const [username, setUsername] = useState('testuser');
  const [email, setEmail] = useState('vishal@example.com');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(null);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setAvatar(file);
    setPreview(URL.createObjectURL(file));
  };

  const saveProfile = () => {
    alert("Profile saved (mock only)");
    // TODO: Send data and avatar to backend using FormData
  };

  return (
    <Layout title="User Profile">
      <div className="bg-white p-6 rounded shadow w-full sm:w-1/2">
        <h2 className="text-2xl font-bold mb-4">👤 Edit Profile</h2>
        <div className="space-y-4">
          <div>
            <label className="block font-semibold">Avatar</label>
            {preview && <img src={preview} alt="Preview" className="w-24 h-24 rounded-full mb-2" />}
            <input type="file" onChange={handleImage} />
          </div>
          <div>
            <label className="block font-semibold">Username</label>
            <input type="text" className="w-full border p-2 rounded" value={username} onChange={(e) => setUsername(e.target.value)} />
          </div>
          <div>
            <label className="block font-semibold">Email</label>
            <input type="email" className="w-full border p-2 rounded" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <button onClick={saveProfile} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Save</button>
        </div>
      </div>
    </Layout>
  );
}