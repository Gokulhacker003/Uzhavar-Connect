import React, { useState } from 'react';

export default function BookTeamPage() {
  const [form, setForm] = useState({
    name: '',
    contact: '',
    address: '',
    landImage: null,
    crop: ''
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'Book My Team',
      name: form.name,
      phone: form.contact,
      message: `Address: ${form.address}${form.crop ? `\nCrop Planted: ${form.crop}` : ''}`,
      extra: {
        'Contact Number': form.contact,
        'Address': form.address,
        'Crop Planted': form.crop || 'Not specified',
        'Land Image': form.landImage ? form.landImage.name : 'No image uploaded'
      }
    };

    // Send email
    fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(emailData),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Team booking form submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting team booking form:', error);
    });
  }

  // Use require for local image so webpack resolves it
  const bgImg = require('./assert/agriculture.jpg');
  return (
    <div
      className="book-team-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh',
        backgroundImage: `url(${bgImg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        position: 'relative',
      }}
    >
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        padding: '2rem 2.5rem',
        borderRadius: '16px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
        width: '100%',
        maxWidth: 420,
      }}>
        <h2 style={{ textAlign: 'center', color: '#2e7d32', marginBottom: '1.5rem' }}>Book Our Team</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Name:</label><br />
            <input name="name" value={form.name} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Contact Number:</label><br />
            <input name="contact" value={form.contact} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Address:</label><br />
            <textarea name="address" value={form.address} onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc', minHeight: '60px' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Land Image:</label><br />
            <input type="file" name="landImage" accept="image/*" onChange={handleChange} required style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ fontWeight: 'bold' }}>Crop Planted (optional):</label><br />
            <input name="crop" value={form.crop} onChange={handleChange} style={{ width: '100%', padding: '0.5rem', borderRadius: '8px', border: '1px solid #ccc' }} />
          </div>
          <button type="submit" style={{ width: '100%', padding: '0.75rem', background: '#2e7d32', color: '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', fontSize: '1rem', cursor: 'pointer', boxShadow: '0 2px 8px rgba(46,125,50,0.08)' }}>Submit</button>
        </form>
        {submitted && <div style={{ color: '#2e7d32', marginTop: 20, textAlign: 'center', fontWeight: 'bold' }}>Thank you! We received your details.</div>}
      </div>
    </div>
  );
}
