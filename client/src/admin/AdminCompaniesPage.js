import React, { useState, useEffect } from 'react';

export default function AdminCompaniesPage({ onLogout }) {
  const [companies, setCompanies] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', logo: '', logoFile: null });
  const [editingId, setEditingId] = useState(null);
  const [productForm, setProductForm] = useState({ name: '', price: '', image: '', imageFile: null });
  const [activeProductCompanyId, setActiveProductCompanyId] = useState(null);
  const [imageGallery, setImageGallery] = useState([]);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryType, setGalleryType] = useState('product'); // 'product' or 'logo'

  // Simple password protection
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const ADMIN_PASSWORD = 'ullavar2025';

  function handlePasswordSubmit(e) {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
    } else {
      alert('Incorrect password!');
    }
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  }

  function handleLogoFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setForm(f => ({ ...f, logoFile: file, logo: '' }));
    }
  }

  function handleAdd(e) {
    e.preventDefault();
    if (!form.name.trim()) return;
    
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.logoFile) {
      formData.append('logo', form.logoFile);
    } else if (form.logo) {
      formData.append('logo', form.logo);
    }

    fetch('/api/companies', {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(newCompany => {
      setCompanies(prev => [...prev, newCompany]);
      setForm({ name: '', description: '', logo: '', logoFile: null });
    })
    .catch(err => {
      console.error('Error adding company:', err);
      alert('Failed to add company');
    });
  }

  function handleEdit(id) {
    const company = companies.find(c => c.id === id);
    setForm({ 
      name: company.name, 
      description: company.description || '', 
      logo: company.logo || '',
      logoFile: null 
    });
    setEditingId(id);
  }

  function handleUpdate(e) {
    e.preventDefault();
    if (!form.name.trim()) return;

    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('description', form.description);
    if (form.logoFile) {
      formData.append('logo', form.logoFile);
    } else if (form.logo !== undefined) {
      formData.append('logo', form.logo);
    }

    fetch(`/api/companies/${editingId}`, {
      method: 'PUT',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === updated.id ? updated : c));
      setForm({ name: '', description: '', logo: '', logoFile: null });
      setEditingId(null);
    })
    .catch(err => {
      console.error('Error updating company:', err);
      alert('Failed to update company');
    });
  }

  function handleDelete(id) {
    if (!window.confirm('Are you sure you want to delete this company? This action cannot be undone.')) {
      return;
    }

    fetch(`/api/companies/${id}`, {
      method: 'DELETE'
    })
    .then(r => r.json())
    .then(() => {
      setCompanies(prev => prev.filter(c => c.id !== id));
    })
    .catch(err => {
      console.error('Error deleting company:', err);
      alert('Failed to delete company');
    });
  }

  // Product management
  function handleProductChange(e) {
    const { name, value } = e.target;
    setProductForm(f => ({ ...f, [name]: value }));
  }

  function handleProductImageFileChange(e) {
    const file = e.target.files && e.target.files[0];
    if (file) {
      setProductForm(f => ({ ...f, imageFile: file, image: '' }));
    }
  }

  function handleAddProduct(e, companyId) {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price || '');
    if (productForm.imageFile) {
      formData.append('image', productForm.imageFile);
    } else if (productForm.image) {
      formData.append('image', productForm.image);
    }

    fetch(`/api/companies/${companyId}/products`, {
      method: 'POST',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
      setProductForm({ name: '', price: '', image: '', imageFile: null });
      setActiveProductCompanyId(null);
    })
    .catch(err => {
      console.error('Error adding product:', err);
      alert('Failed to add product');
    });
  }

  function handleUpdateProduct(e, companyId, productIndex) {
    e.preventDefault();
    if (!productForm.name.trim()) return;

    const formData = new FormData();
    formData.append('name', productForm.name);
    formData.append('price', productForm.price || '');
    if (productForm.imageFile) {
      formData.append('image', productForm.imageFile);
    } else if (productForm.image !== undefined) {
      formData.append('image', productForm.image);
    }

    fetch(`/api/companies/${companyId}/products/${productIndex}`, {
      method: 'PUT',
      body: formData
    })
    .then(r => r.json())
    .then(updated => {
      setCompanies(prev => prev.map(c => c.id === companyId ? updated : c));
      setProductForm({ name: '', price: '', image: '', imageFile: null });
      setActiveProductCompanyId(null);
    })
    .catch(err => {
      console.error('Error updating product:', err);
      alert('Failed to update product');
    });
  }

  function handleRemoveProduct(companyId, idx) {
    if (!window.confirm('Are you sure you want to remove this product?')) return;

    fetch(`/api/companies/${companyId}/products/${idx}`, { method: 'DELETE' })
      .then(r => r.json())
      .then(() => {
        setCompanies(prev => prev.map(c => 
          c.id === companyId 
            ? { ...c, products: c.products.filter((_, i) => i !== idx) } 
            : c
        ));
      })
      .catch(err => {
        console.error('Error removing product:', err);
        alert('Failed to remove product');
      });
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetch('/api/companies')
        .then(r => r.json())
        .then(data => setCompanies(data))
        .catch(err => {
          console.error('Failed to load companies', err);
          setCompanies([]);
        });

      // load image gallery
      fetch('/api/images')
        .then(r => r.json())
        .then(imgs => setImageGallery(imgs))
        .catch(err => console.error('Failed to load images', err));
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <div style={{ maxWidth: 700, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: '2rem' }}>
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
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', background: '#fff', borderRadius: 12, boxShadow: '0 2px 12px #eee', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2 style={{ color: '#388e3c', margin: 0 }}>Companies Management</h2>
        <button 
          className="btn btn-secondary" 
          onClick={() => { 
            setIsAuthenticated(false); 
            setPassword(''); 
            if (typeof onLogout === 'function') onLogout(); 
          }}
        >
          Logout
        </button>
      </div>

      {/* Add/Edit Company Form */}
      <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f8f9fa', borderRadius: 8, border: '1px solid #dee2e6' }}>
        <h3 style={{ marginTop: 0, color: '#495057' }}>
          {editingId ? 'Edit Company' : 'Add New Company'}
        </h3>
        <form onSubmit={editingId ? handleUpdate : handleAdd} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Company Name *</label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter company name"
              required
              style={{ padding: '0.6em', borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Description</label>
            <input
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Enter company description"
              style={{ padding: '0.6em', borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Logo URL</label>
            <input
              name="logo"
              value={form.logo}
              onChange={handleChange}
              placeholder="Enter logo URL"
              style={{ padding: '0.6em', borderRadius: 6, border: '1px solid #ccc', width: '100%' }}
            />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Or Upload Logo</label>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoFileChange}
                style={{ padding: '0.4em', borderRadius: 6, border: '1px solid #ccc', flex: 1 }}
              />
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => { setGalleryType('logo'); setIsGalleryOpen(true); }}
                style={{ fontSize: '0.9em', whiteSpace: 'nowrap' }}
              >
                Gallery
              </button>
            </div>
          </div>
          <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button type="submit" className="btn btn-primary">
              {editingId ? 'Update Company' : 'Add Company'}
            </button>
            {editingId && (
              <button 
                type="button" 
                className="btn btn-secondary" 
                onClick={() => {
                  setEditingId(null);
                  setForm({ name: '', description: '', logo: '', logoFile: null });
                }}
              >
                Cancel
              </button>
            )}
            {/* Logo Preview */}
            {(form.logo || form.logoFile) && (
              <div style={{ marginLeft: '1rem' }}>
                <img 
                  src={form.logoFile ? URL.createObjectURL(form.logoFile) : form.logo} 
                  alt="Logo preview" 
                  style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6, border: '1px solid #ddd' }} 
                />
              </div>
            )}
          </div>
        </form>
      </div>

      {/* Companies List */}
      <div>
        <h3 style={{ color: '#495057', marginBottom: '1rem' }}>Companies ({companies.length})</h3>
        {companies.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>No companies found. Add your first company above.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {companies.map(company => (
              <div key={company.id} style={{ border: '1px solid #dee2e6', borderRadius: 8, padding: '1.5rem', background: '#fff' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                    {/* Company Logo */}
                    {company.logo ? (
                      <img 
                        src={company.logo} 
                        alt={`${company.name} logo`} 
                        style={{ width: 80, height: 80, objectFit: 'cover', borderRadius: 8, border: '1px solid #ddd' }} 
                      />
                    ) : (
                      <div style={{ 
                        width: 80, 
                        height: 80, 
                        background: '#f8f9fa', 
                        borderRadius: 8, 
                        border: '1px solid #dee2e6',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#6c757d',
                        fontSize: '0.8rem'
                      }}>
                        No Logo
                      </div>
                    )}
                    <div>
                      <h4 style={{ margin: 0, color: '#2e7d32' }}>{company.name}</h4>
                      <p style={{ margin: '0.5em 0', color: '#6c757d' }}>{company.description || 'No description'}</p>
                      <small style={{ color: '#6c757d' }}>ID: {company.id}</small>
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <button 
                      className="btn btn-secondary" 
                      onClick={() => handleEdit(company.id)}
                      style={{ fontSize: '0.9em' }}
                    >
                      Edit
                    </button>
                    <button 
                      className="btn btn-danger" 
                      onClick={() => handleDelete(company.id)}
                      style={{ fontSize: '0.9em' }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Products Section */}
                <div style={{ borderTop: '1px solid #dee2e6', paddingTop: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <strong style={{ color: '#495057' }}>Products ({company.products?.length || 0})</strong>
                    <button 
                      className="btn btn-primary" 
                      style={{ fontSize: '0.9em' }} 
                      onClick={() => { 
                        setActiveProductCompanyId(company.id); 
                        setProductForm({ name: '', price: '', image: '', imageFile: null, editIndex: null }); 
                      }}
                    >
                      Add Product
                    </button>
                  </div>

                  {/* Products Grid */}
                  {company.products && company.products.length > 0 ? (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
                      {company.products.map((product, idx) => (
                        <div key={idx} style={{ border: '1px solid #dee2e6', borderRadius: 6, padding: '1rem', background: '#f8f9fa' }}>
                          {product.image && (
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 4, marginBottom: '0.5rem' }} 
                            />
                          )}
                          <h5 style={{ margin: '0 0 0.5rem 0', fontSize: '1rem' }}>{product.name}</h5>
                          {product.price && <p style={{ margin: '0 0 0.5rem 0', color: '#28a745', fontWeight: 'bold' }}>₹{product.price}</p>}
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button 
                              className="btn btn-secondary" 
                              style={{ fontSize: '0.8em', flex: 1 }} 
                              onClick={() => {
                                setActiveProductCompanyId(company.id);
                                setProductForm({ 
                                  name: product.name, 
                                  price: product.price || '', 
                                  image: product.image || '',
                                  imageFile: null,
                                  editIndex: idx 
                                });
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              className="btn btn-danger" 
                              style={{ fontSize: '0.8em', flex: 1 }} 
                              onClick={() => handleRemoveProduct(company.id, idx)}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p style={{ color: '#6c757d', fontStyle: 'italic', margin: '1rem 0' }}>No products added yet.</p>
                  )}

                  {/* Product Form */}
                  {activeProductCompanyId === company.id && (
                    <div style={{ background: '#e9ecef', padding: '1rem', borderRadius: 6, border: '1px solid #ced4da' }}>
                      <h5 style={{ marginTop: 0 }}>
                        {productForm.editIndex !== null && productForm.editIndex !== undefined ? 'Edit Product' : 'Add New Product'}
                      </h5>
                      <form 
                        onSubmit={e => {
                          if (productForm.editIndex !== null && productForm.editIndex !== undefined) {
                            handleUpdateProduct(e, company.id, productForm.editIndex);
                          } else {
                            handleAddProduct(e, company.id);
                          }
                        }} 
                        style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', alignItems: 'end' }}
                      >
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Product Name *</label>
                          <input 
                            name="name" 
                            value={productForm.name} 
                            onChange={handleProductChange} 
                            placeholder="Product Name" 
                            required 
                            style={{ padding: '0.5em', borderRadius: 4, border: '1px solid #ccc', width: '100%' }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Price</label>
                          <input 
                            name="price" 
                            value={productForm.price} 
                            onChange={handleProductChange} 
                            placeholder="Price" 
                            type="number" 
                            min="0" 
                            style={{ padding: '0.5em', borderRadius: 4, border: '1px solid #ccc', width: '100%' }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Image URL</label>
                          <input 
                            name="image" 
                            value={productForm.image} 
                            onChange={handleProductChange} 
                            placeholder="Image URL" 
                            style={{ padding: '0.5em', borderRadius: 4, border: '1px solid #ccc', width: '100%' }} 
                          />
                        </div>
                        <div>
                          <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>Or Upload Image</label>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <input 
                              type="file" 
                              accept="image/*" 
                              onChange={handleProductImageFileChange} 
                              style={{ padding: '0.4em', borderRadius: 4, border: '1px solid #ccc', flex: 1 }} 
                            />
                            <button 
                              type="button" 
                              className="btn btn-secondary" 
                              onClick={() => { setGalleryType('product'); setIsGalleryOpen(true); }}
                              style={{ fontSize: '0.85em', whiteSpace: 'nowrap' }}
                            >
                              Gallery
                            </button>
                          </div>
                        </div>
                        <div style={{ gridColumn: '1 / -1', display: 'flex', gap: '1rem', alignItems: 'center' }}>
                          <button type="submit" className="btn btn-primary">
                            {productForm.editIndex !== null && productForm.editIndex !== undefined ? 'Update Product' : 'Add Product'}
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary" 
                            onClick={() => { 
                              setActiveProductCompanyId(null); 
                              setProductForm({ name: '', price: '', image: '', imageFile: null }); 
                            }}
                          >
                            Cancel
                          </button>
                          {/* Image Preview */}
                          {(productForm.image || productForm.imageFile) && (
                            <div style={{ marginLeft: '1rem' }}>
                              <img 
                                src={productForm.imageFile ? URL.createObjectURL(productForm.imageFile) : productForm.image} 
                                alt="Product preview" 
                                style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 4, border: '1px solid #ddd' }} 
                              />
                            </div>
                          )}
                        </div>
                      </form>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Image Gallery Modal */}
      {isGalleryOpen && (
        <ImageGalleryModal
          images={imageGallery}
          onClose={() => setIsGalleryOpen(false)}
          onPick={(url) => { 
            if (galleryType === 'logo') {
              setForm(f => ({ ...f, logo: url, logoFile: null }));
            } else {
              setProductForm(f => ({ ...f, image: url, imageFile: null }));
            }
            setIsGalleryOpen(false); 
          }}
        />
      )}
    </div>
  );

  // Gallery modal component
  function ImageGalleryModal({ images, onClose, onPick }) {
    return (
      <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }}>
        <div style={{ width: '80%', maxWidth: 900, background: '#fff', borderRadius: 8, padding: '1.5rem', maxHeight: '80vh', overflow: 'auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0 }}>Choose Image from Gallery</h3>
            <button className="btn btn-secondary" onClick={onClose}>Close</button>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
            {images.map((img, i) => (
              <div 
                key={i} 
                style={{ 
                  cursor: 'pointer', 
                  border: '2px solid transparent',
                  borderRadius: 6,
                  transition: 'border-color 0.2s'
                }} 
                onClick={() => onPick(img.url)}
                onMouseEnter={e => e.target.style.borderColor = '#007bff'}
                onMouseLeave={e => e.target.style.borderColor = 'transparent'}
              >
                <img 
                  src={img.url} 
                  alt={`Gallery item ${i}`} 
                  style={{ 
                    width: '100%', 
                    height: 120, 
                    objectFit: 'cover', 
                    borderRadius: 4,
                    display: 'block'
                  }} 
                />
              </div>
            ))}
          </div>
          {images.length === 0 && (
            <p style={{ textAlign: 'center', color: '#6c757d', padding: '2rem' }}>No images found in gallery.</p>
          )}
        </div>
      </div>
    );
  }
}
