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

export default function LandPage() {
  const [form, setForm] = useState({
    owner: "",
    area: "",
    price: "",
    description: "",
    location: null,
    landImage: null,
    patta: null,
    pattaNumber: "",
  });
        <label>Patta/Chitta Number:<br />
          <input name="pattaNumber" value={form.pattaNumber} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
  const [submitted, setSubmitted] = useState(false);

  function handleChange(e) {
    const { name, value, files } = e.target;
    setForm({ ...form, [name]: files ? files[0] : value });
  }

  function handleLocation(latlng) {
    setForm({ ...form, location: latlng });
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'List Your Land for Buy/Sell',
      name: form.owner,
      phone: form.contact,
      message: `Land listing details submitted`,
      extra: {
        'Owner Name': form.owner,
        'Area (acres)': form.area,
        'Price': form.price,
        'Contact': form.contact,
        'Location': form.location ? `Lat: ${form.location.lat}, Lng: ${form.location.lng}` : 'Not selected',
        'Land Image': form.landImage ? form.landImage.name : 'No image uploaded',
        'Patta Details': form.patta ? form.patta.name : 'No document uploaded'
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
      console.log('Land listing submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting land listing:', error);
    });
  }

  return (
    <div style={{ maxWidth: 600, margin: "2em auto", background: "#fff", padding: "2em", borderRadius: 12, boxShadow: "0 2px 12px rgba(0,0,0,0.07)" }}>
      <h2 style={{ color: "#388e3c" }}>Submit Land Details</h2>
  <form onSubmit={handleSubmit} encType="multipart/form-data">
        <label>Land Image:<br />
          <input type="file" name="landImage" accept="image/*" onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Patta Details (PDF/Image):<br />
          <input type="file" name="patta" accept=".pdf,image/*" onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Owner Name:<br />
          <input name="owner" value={form.owner} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Area (in acres):<br />
          <input name="area" value={form.area} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Expected Price:<br />
          <input name="price" value={form.price} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Description:<br />
          <textarea name="description" value={form.description} onChange={handleChange} required style={{ width: "100%", marginBottom: 12 }} />
        </label>
        <label>Pick Land Location:</label>
        <div style={{ height: 300, marginBottom: 12 }}>
          <MapContainer center={[11.0168, 76.9558]} zoom={8} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker onLocationSelect={handleLocation} />
          </MapContainer>
        </div>
        {form.location && (
          <div style={{ marginBottom: 12, color: "#388e3c" }}>
            Selected Location: Lat {form.location.lat}, Lng {form.location.lng}
          </div>
        )}
        <button type="submit" className="btn btn-primary">Submit</button>
      </form>
      {submitted && (
        <div style={{ marginTop: 20, color: "#388e3c", fontWeight: "bold" }}>
          Land details submitted successfully!
        </div>
      )}
    </div>
  );
}
