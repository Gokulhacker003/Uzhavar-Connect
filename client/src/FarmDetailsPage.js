import React, { useState } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function FarmDetailsPage() {
  const [form, setForm] = useState({
    ownerName: '',
    contact: '',
    address: '',
    landImage: null,
    area: '',
    crop: '',
    irrigationType: '',
    notes: '',
    location: null
  });
  const [marker, setMarker] = useState(null);
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }));
  }


  function LocationPicker({ onLocationSelect }) {
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        setForm(f => ({ ...f, location: e.latlng }));
        if (onLocationSelect) onLocationSelect(e.latlng);
      },
    });
    return marker ? <Marker position={marker} /> : null;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'Upload Your Farm Details',
      name: form.ownerName,
      message: `Farm details submitted`,
      extra: {
        'Owner Name': form.ownerName,
        'Farm Location': marker ? `Lat: ${marker.lat}, Lng: ${marker.lng}` : 'Not selected',
        'Area (acres)': form.area,
        'Crop Planted': form.crop || 'Not specified',
        'Irrigation Type': form.irrigationType || 'Not specified',
        'Additional Notes': form.notes || 'None'
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
      console.log('Farm details submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting farm details:', error);
    });
  }

  return (
  <div style={{display:'flex',justifyContent:'center',alignItems:'center',minHeight:'80vh',backgroundImage:'url(/assert/agriculture.jpg)',backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}}>
      <div style={{background:'rgba(255,255,255,0.95)',padding:'2rem 2.5rem',borderRadius:'16px',boxShadow:'0 4px 24px rgba(0,0,0,0.08)',width:'100%',maxWidth:420}}>
        <h2 style={{textAlign:'center',color:'#2e7d32',marginBottom:'1.5rem'}}>Upload Your Farm Details</h2>
  <form onSubmit={handleSubmit}>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Owner Name:</label><br/>
            <input name="ownerName" value={form.ownerName} onChange={handleChange} required style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Select Farm Land Location:</label><br/>
            <div style={{ width: '100%', height: '250px', borderRadius: '8px', overflow: 'hidden', marginBottom: '0.5rem' }}>
              <MapContainer center={[11.0, 78.0]} zoom={7} style={{ height: '100%', width: '100%' }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker />
              </MapContainer>
            </div>
            {form.location && <div style={{color:'#388e3c',marginTop:'0.5rem'}}>Selected Location: Lat {form.location.lat}, Lng {form.location.lng}</div>}
            <small style={{color:'#388e3c'}}>Click on the map to select your farm's location.</small>
          </div>
          <div style={{marginBottom:'1rem'}}>
            {/* Remove Google Maps input, location is now picked from map */}
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Contact Number:</label><br/>
            <input name="contact" value={form.contact} onChange={handleChange} required style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Address:</label><br/>
            <textarea name="address" value={form.address} onChange={handleChange} required style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc',minHeight:'60px'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Land Image:</label><br/>
            <input type="file" name="landImage" accept="image/*" onChange={handleChange} required style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Area (in acres):</label><br/>
            <input name="area" value={form.area} onChange={handleChange} required style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Crop Planted:</label><br/>
            <input name="crop" value={form.crop} onChange={handleChange} style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Irrigation Type:</label><br/>
            <input name="irrigationType" value={form.irrigationType} onChange={handleChange} style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc'}} />
          </div>
          <div style={{marginBottom:'1rem'}}>
            <label style={{fontWeight:'bold'}}>Additional Notes:</label><br/>
            <textarea name="notes" value={form.notes} onChange={handleChange} style={{width:'100%',padding:'0.5rem',borderRadius:'8px',border:'1px solid #ccc',minHeight:'40px'}} />
          </div>
          <button type="submit" style={{width:'100%',padding:'0.75rem',background:'#2e7d32',color:'#fff',border:'none',borderRadius:'8px',fontWeight:'bold',fontSize:'1rem',cursor:'pointer',boxShadow:'0 2px 8px rgba(46,125,50,0.08)'}}>Submit</button>
        </form>
        {submitted && <div style={{color:'#2e7d32',marginTop:20,textAlign:'center',fontWeight:'bold'}}>Thank you! We received your farm details.</div>}
      </div>
    </div>
  );
}
