import React, { useEffect, useState } from 'react';

export default function AdminSubmissionsPage() {
  const [subs, setSubs] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [password, setPassword] = useState('');

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const headers = {};
      if (password) headers['x-admin-key'] = password;
      const res = await fetch('/api/submissions', { headers });
      if (!res.ok) {
        const txt = await res.text();
        throw new Error(txt || 'Failed to fetch submissions');
      }
      const data = await res.json();
      setSubs(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Admin — Submissions (protected)</h2>
      <div style={{ marginBottom: 12 }}>
        <input placeholder="Admin password" type="password" value={password} onChange={e => setPassword(e.target.value)} style={{ marginRight: 8 }} />
        <button onClick={load} disabled={loading}>{loading ? 'Loading...' : 'Load Submissions'}</button>
      </div>
      {error && <div style={{ color: 'red' }}>Error: {error}</div>}
      {!subs || subs.length === 0 ? (
        <div>No submissions found or not authorized.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Received</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Subject</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Name / Email / Phone</th>
              <th style={{ textAlign: 'left', borderBottom: '1px solid #ddd', padding: '8px' }}>Message</th>
            </tr>
          </thead>
          <tbody>
            {subs.map((s, i) => (
              <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                <td style={{ padding: '8px' }}>{new Date(s.receivedAt).toLocaleString()}</td>
                <td style={{ padding: '8px' }}>{s.subject}</td>
                <td style={{ padding: '8px' }}>{s.payload?.name} / {s.payload?.email} / {s.payload?.phone}</td>
                <td style={{ padding: '8px' }}>{s.payload?.message}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
