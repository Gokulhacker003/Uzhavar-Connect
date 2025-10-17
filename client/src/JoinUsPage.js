import React, { useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function LocationPicker({ onLocationSelect }) {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      onLocationSelect(e.latlng);
    },
  });
  return position ? <Marker position={position} /> : null;
}

export default function JoinUsPage() {
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    farmLocation: null,
    address: "",
    pincode: "",
    area: "",
    crops: "",
    idProof: null,
  });
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  function handleLocation(latlng) {
    setForm({ ...form, farmLocation: latlng });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'Register as Farmer',
      name: form.name,
      phone: form.contact,
      email: form.email,
      message: `Farmer registration details submitted`,
      extra: {
        'Name': form.name,
        'Contact': form.contact,
        'Email': form.email,
        'Experience': form.experience,
        'Farm Size': form.farmSize,
        'Farm Location': form.farmLocation ? `Lat: ${form.farmLocation.lat}, Lng: ${form.farmLocation.lng}` : 'Not selected',
        'ID Proof': form.idProof ? form.idProof.name : 'No document uploaded'
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
      console.log('Farmer registration submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting farmer registration:', error);
    });
  }

  return (
    <div style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
      <video
        autoPlay
        loop
        muted
        playsInline
        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', zIndex: 0 }}
      >
  <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={{ position: 'relative', zIndex: 1, maxWidth: 600, margin: "2em auto", background: "rgba(255,255,255,0.95)", padding: "2em", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
        <h2 style={{ color: "#388e3c" }}>Farmer Registration</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>ID Proof (PDF):<br />
          <input type="file" name="idProof" accept=".pdf" onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <div style={{marginBottom:12, padding: '0.5em 0', borderRadius: 8, background: '#f7f7f7'}}>
          <label style={{fontWeight:'bold', display:'block', marginBottom:'0.5em'}}><FaUser style={{marginRight:4}}/> Personal Information</label>
          <div style={{display:'flex', gap:'1em', marginBottom:'8px'}}>
            <input name="name" value={form.name} onChange={handleChange} required placeholder="Full Name" style={{ flex:1 }} />
            <input name="email" value={form.email} onChange={handleChange} required placeholder="Email Address" style={{ flex:1 }} />
          </div>
          <div style={{display:'flex', gap:'1em', marginBottom:'8px'}}>
            <input name="phone" value={form.phone} onChange={handleChange} required placeholder="Phone Number" style={{ flex:1 }} />
          </div>
        </div>
        <div style={{marginBottom:12, padding: '0.5em 0', borderRadius: 8, background: '#f7f7f7'}}>
          <label style={{fontWeight:'bold', display:'block', marginBottom:'0.5em'}}><FaMapMarkerAlt style={{marginRight:4}}/> Address Information</label>
          <textarea name="address" value={form.address} onChange={handleChange} required placeholder="Full Address" style={{ width: "100%", marginBottom: 8 }} />
          <div style={{display:'flex', gap:'1em', marginBottom:'8px'}}>
            <input name="city" value={form.city || ''} onChange={handleChange} required placeholder="City" style={{ flex:1 }} />
            <input name="state" value={form.state || ''} onChange={handleChange} required placeholder="State" style={{ flex:1 }} />
          </div>
          <input name="pincode" value={form.pincode} onChange={handleChange} required placeholder="Pincode" style={{ width: "100%", marginBottom: 8 }} />
        </div>
        <label>Area (in acres):<br />
          <input name="area" value={form.area} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Crops Grown:<br />
          <input name="crops" value={form.crops} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Pick Farm Location:</label>
        <div style={{ height: 300, marginBottom: 12 }}>
          <MapContainer center={[11.0168, 76.9558]} zoom={8} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onLocationSelect={handleLocation} />
          </MapContainer>
        </div>
        {form.farmLocation && (
          <div style={{ marginBottom: 12, color: "#388e3c" }}>
            Selected Location: Lat {form.farmLocation.lat}, Lng {form.farmLocation.lng}
          </div>
        )}
        <button type="submit" className="btn btn-primary">Register</button>
        </form>
        {submitted && (
          <div style={{ marginTop: 20, color: "#388e3c", fontWeight: "bold" }}>
            Registration submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}
