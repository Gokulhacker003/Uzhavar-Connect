import React, { useState } from 'react';

export default function AdminUserDataPage() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const loadUserData = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (password) headers['x-admin-key'] = password;
      const res = await fetch('/api/user-data', { headers });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch user data');
      }
      const data = await res.json();
      setUserData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — User Data Storage</h2>
      <div style={{ marginBottom: 12 }}>
        <input 
          placeholder="Admin password" 
          type="password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          style={{ marginRight: 8 }} 
        />
        <button onClick={loadUserData} disabled={loading}>
          {loading ? 'Loading...' : 'Load User Data'}
        </button>
      </div>
      
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      
      {!userData || userData.length === 0 ? (
        <div>No user data found or not authorized.</div>
      ) : (
        <div>
          <h3>Stored User Data ({userData.length} entries)</h3>
          <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
            {userData.map((entry, i) => (
              <div key={i} style={{ 
                border: '1px solid #ddd', 
                margin: '10px 0', 
                padding: '15px', 
                borderRadius: '5px',
                backgroundColor: '#f9f9f9'
              }}>
                <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Entry #{entry.id} - {entry.type} - {new Date(entry.timestamp).toLocaleString()}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Data:</strong>
                  <pre style={{ 
                    backgroundColor: '#fff', 
                    padding: '10px', 
                    borderRadius: '3px',
                    fontSize: '14px',
                    overflow: 'auto'
                  }}>
                    {JSON.stringify(entry.data, null, 2)}
                  </pre>
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  User Agent: {entry.userAgent}<br/>
                  IP: {entry.ip}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}