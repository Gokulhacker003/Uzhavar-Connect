import React, { useState } from 'react';

const initialCompanies = [
  { id: 1, name: 'Ullavar Agro', description: 'Farm management and consulting.', products: [] },
  { id: 2, name: 'GreenTech Solutions', description: 'Irrigation and automation.', products: [] },
];

export default function AdminCompaniesPage() {
  // Simple password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'ullavar2025'; // Change this to your desired password

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  }
  const [companies, setCompanies] = useState(initialCompanies);
  const [form, setForm] = useState({ name: '', description: '' });
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '' });
  const [activeProductCompanyId, setActiveProductCompanyId] = useState(null);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleAdd(e) {
  e.preventDefault();
  if (!form.name.trim()) return;
  setCompanies([...companies, { id: Date.now(), ...form, products: [] }]);
  setForm({ name: '', description: '' });
  }

  function handleEdit(id) {
  const company = companies.find(c => c.id === id);
  setForm({ name: company.name, description: company.description });
  setEditingId(id);
  }

  function handleUpdate(e) {
  e.preventDefault();
  setCompanies(companies.map(c => c.id === editingId ? { ...c, ...form } : c));
  setForm({ name: '', description: '' });
  setEditingId(null);
  }

  function handleDelete(id) {
    setCompanies(companies.filter(c => c.id !== id));
  }

  // Product management
  function handleProductChange(e) {
    const { name, value } = e.target;
    setProductForm(f => ({ ...f, [name]: value }));
  }

  function handleAddProduct(e, companyId) {
    e.preventDefault();
    if (!productForm.name.trim()) return;
    setCompanies(companies.map(c =>
      c.id === companyId
        ? { ...c, products: [...c.products, { name: productForm.name, price: productForm.price }] }
        : c
    ));
    setProductForm({ name: '', price: '' });
    setActiveProductCompanyId(null);
  }

  function handleRemoveProduct(companyId, idx) {
    setCompanies(companies.map(c =>
      c.id === companyId
        ? { ...c, products: c.products.filter((_, i) => i !== idx) }
        : c
    ));
  }

  return (
    <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: '2rem' }}>
      {!isAuthenticated ? (
        <form onSubmit={handlePasswordSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          <h2 style={{ color: '#388e3c' }}>Admin Login</h2>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            placeholder="Enter admin password"
            style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #ccc', width: '100%', maxWidth: 300 }}
          />
          <button type="submit" className="btn btn-primary" style={{ width: '100%', maxWidth: 300 }}>Login</button>
        </form>
      ) : (
        <>
          <h2 style={{ textAlign: 'center', color: '#388e3c', marginBottom: '2rem' }}>Admin: Manage Companies</h2>
          <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            <input name="name" value={form.name} onChange={handleChange} placeholder="Company Name" required style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #ccc' }} />
            <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" rows={2} style={{ padding: '0.7em', borderRadius: 8, border: '1px solid #ccc' }} />
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>{editingId ? 'Update Company' : 'Add Company'}</button>
            {editingId && <button type="button" className="btn btn-secondary" style={{ width: '100%' }} onClick={() => { setEditingId(null); setForm({ name: '', description: '' }); }}>Cancel Edit</button>}
          </form>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {companies.map(c => (
              <li key={c.id} style={{ marginBottom: '2.5rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h3 style={{ margin: 0, color: '#2e7d32' }}>{c.name}</h3>
                    <p style={{ margin: '0.5em 0', color: '#555' }}>{c.description}</p>
                    <div style={{ marginTop: '1em' }}>
                      <strong>Products:</strong>
                      <ul style={{ margin: '0.5em 0 0 0', padding: 0, listStyle: 'none' }}>
                        {c.products && c.products.length > 0 ? (
                          c.products.map((p, idx) => (
                            <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '1em', marginBottom: '0.3em' }}>
                              <span>{p.name} {p.price && <>- ₹{p.price}</>}</span>
                              <button className="btn btn-danger" style={{ fontSize: '0.8em', padding: '2px 8px' }} onClick={() => handleRemoveProduct(c.id, idx)}>Remove</button>
                            </li>
                          ))
                        ) : (
                          <li style={{ color: '#aaa' }}>No products added.</li>
                        )}
                      </ul>
                      {activeProductCompanyId === c.id ? (
                        <form onSubmit={e => handleAddProduct(e, c.id)} style={{ display: 'flex', gap: '0.5em', marginTop: '0.5em' }}>
                          <input name="name" value={productForm.name} onChange={handleProductChange} placeholder="Product Name" required style={{ padding: '0.4em', borderRadius: 6, border: '1px solid #ccc', fontSize: '0.95em' }} />
                          <input name="price" value={productForm.price} onChange={handleProductChange} placeholder="Price" type="number" min="0" style={{ padding: '0.4em', borderRadius: 6, border: '1px solid #ccc', width: 90, fontSize: '0.95em' }} />
                          <button type="submit" className="btn btn-primary" style={{ fontSize: '0.95em' }}>Add</button>
                          <button type="button" className="btn btn-secondary" style={{ fontSize: '0.95em' }} onClick={() => { setActiveProductCompanyId(null); setProductForm({ name: '', price: '' }); }}>Cancel</button>
                        </form>
                      ) : (
                        <button className="btn btn-primary" style={{ fontSize: '0.95em', marginTop: '0.5em' }} onClick={() => { setActiveProductCompanyId(c.id); setProductForm({ name: '', price: '' }); }}>Add Product</button>
                      )}
                    </div>
                  </div>
                  <div>
                    <button className="btn btn-secondary" style={{ marginRight: 8 }} onClick={() => handleEdit(c.id)}>Edit</button>
                    <button className="btn btn-danger" onClick={() => handleDelete(c.id)}>Delete</button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
