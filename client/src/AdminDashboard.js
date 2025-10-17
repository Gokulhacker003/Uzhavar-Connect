import React, { useState } from "react";
import AdminAdvancedControls from './AdminAdvancedControls';

// Demo data structure for products and site content
const initialMasalaProducts = [
  { id: 1, name: "Chilli Powder", price: 120 },
  { id: 2, name: "Coriander Powder", price: 90 },
  { id: 3, name: "Turmeric Powder", price: 100 },
];
const initialOrganicsProducts = [
  { id: 1, name: "Organic Rice", price: 80 },
  { id: 2, name: "Organic Vegetables", price: 60 },
  { id: 3, name: "Cold-pressed Oils", price: 200 },
];

export default function AdminDashboard() {
  const [masalaProducts, setMasalaProducts] = useState(initialMasalaProducts);
  const [organicsProducts, setOrganicsProducts] = useState(initialOrganicsProducts);
  const [newMasalaProduct, setNewMasalaProduct] = useState({ name: "", price: "" });
  const [newOrganicsProduct, setNewOrganicsProduct] = useState({ name: "", price: "" });
  const [siteTitle, setSiteTitle] = useState("Ullavar Connect");
  const [siteDesc, setSiteDesc] = useState("Manage Your Farm Like a Pro. From Soil to Sale.");
  const [siteContent, setSiteContent] = useState({
    siteTitle,
    siteDesc,
    home: "Home page content...",
    about: "About section content...",
    companies: "Companies section content...",
    manageFarm: "Manage Farm section content...",
    buyInputs: "Buy Inputs section content...",
    sellProduce: "Sell Produce section content...",
    land: "Land section content...",
    construction: "Construction section content...",
    projects: "Past Work section content...",
    joinUs: "Join Us section content...",
    footer: "Footer content...",
    // Add more sections as needed
  });
  const [images, setImages] = useState({
  // hero image (background video) is not editable by admin
    about: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    companies: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    manageFarm: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
    buyInputs: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    sellProduce: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    land: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=400&q=80",
    construction: "https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80",
    projects: "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80",
    joinUs: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
    footer: "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80",
  });

  function handleMasalaProductChange(e) {
    setNewMasalaProduct({ ...newMasalaProduct, [e.target.name]: e.target.value });
  }
  function handleOrganicsProductChange(e) {
    setNewOrganicsProduct({ ...newOrganicsProduct, [e.target.name]: e.target.value });
  }
  function addMasalaProduct(e) {
    e.preventDefault();
    if (!newMasalaProduct.name || !newMasalaProduct.price) return;
    setMasalaProducts([...masalaProducts, { id: Date.now(), name: newMasalaProduct.name, price: Number(newMasalaProduct.price) }]);
    setNewMasalaProduct({ name: "", price: "" });
  }
  function addOrganicsProduct(e) {
    e.preventDefault();
    if (!newOrganicsProduct.name || !newOrganicsProduct.price) return;
    setOrganicsProducts([...organicsProducts, { id: Date.now(), name: newOrganicsProduct.name, price: Number(newOrganicsProduct.price) }]);
    setNewOrganicsProduct({ name: "", price: "" });
  }
  function removeMasalaProduct(id) {
    setMasalaProducts(masalaProducts.filter(p => p.id !== id));
  }
  function removeOrganicsProduct(id) {
    setOrganicsProducts(organicsProducts.filter(p => p.id !== id));
  }

  function updateSiteContent(e) {
    e.preventDefault();
    // Would save to backend in real app
    alert("Site content updated!");
  }

  return (
    <div className="admin-dashboard" style={{ maxWidth: 900, margin: "2em auto", padding: "2em", background: "#fff", borderRadius: 18, boxShadow: "0 4px 24px rgba(56,142,60,0.10)" }}>
      <h2 style={{ color: "#388e3c", marginBottom: "2em" }}>Admin Dashboard</h2>
      {/* 1. Site Content */}
      <form onSubmit={updateSiteContent} style={{ marginBottom: "2em" }}>
        <h3>Site Content</h3>
        <div style={{ marginBottom: "1em" }}>
          <label>Site Title</label>
          <input type="text" value={siteTitle} onChange={e => setSiteTitle(e.target.value)} style={{ width: "100%", padding: "0.5em" }} />
        </div>
        <div style={{ marginBottom: "1em" }}>
          <label>Site Description</label>
          <textarea value={siteDesc} onChange={e => setSiteDesc(e.target.value)} style={{ width: "100%", padding: "0.5em" }} />
        </div>
        <button type="submit" style={{ padding: "0.7em 2em", background: "#388e3c", color: "#fff", border: "none", borderRadius: 6, fontWeight: 600 }}>Update Content</button>
      </form>
      {/* 2. Section Images (Editable) */}
      <div style={{ marginBottom: "2em" }}>
        <h3>Section Images</h3>
        {Object.keys(images)
          .filter(section => section !== 'hero')
          .map(section => (
            <div key={section} style={{ marginBottom: '1em', display: 'flex', alignItems: 'center', gap: '1em' }}>
              <strong>{section}:</strong>
              <input type="file" accept="image/*" onChange={e => {
                const file = e.target.files[0];
                if (file) {
                  const localUrl = URL.createObjectURL(file);
                  setImages(prev => ({ ...prev, [section]: localUrl }));
                }
              }} />
              {images[section] && <img src={images[section]} alt={section} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} />}
            </div>
        ))}
      </div>
      {/* 3. Manage Products */}
      <div style={{ marginBottom: "2em" }}>
        <h3>Aadhivelan Masala Products</h3>
        <form onSubmit={addMasalaProduct} style={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
          <input name="name" value={newMasalaProduct.name} onChange={handleMasalaProductChange} placeholder="Product Name" style={{ flex: 2, padding: "0.5em" }} />
          <input name="price" value={newMasalaProduct.price} onChange={handleMasalaProductChange} placeholder="Price" type="number" style={{ flex: 1, padding: "0.5em" }} />
          <button type="submit" style={{ padding: "0.5em 1em", background: "#388e3c", color: "#fff", border: "none", borderRadius: 6 }}>Add</button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {masalaProducts.map(p => (
            <li key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7em 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <input type="number" value={p.price} onChange={e => setMasalaProducts(masalaProducts.map(mp => mp.id === p.id ? { ...mp, price: Number(e.target.value) } : mp))} style={{ width: 80, marginLeft: 8 }} />
              <button onClick={() => removeMasalaProduct(p.id)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "0.3em 0.8em", marginLeft: "1em" }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div style={{ marginBottom: "2em" }}>
        <h3>Aadhivelan Organics Products</h3>
        <form onSubmit={addOrganicsProduct} style={{ display: "flex", gap: "1em", marginBottom: "1em" }}>
          <input name="name" value={newOrganicsProduct.name} onChange={handleOrganicsProductChange} placeholder="Product Name" style={{ flex: 2, padding: "0.5em" }} />
          <input name="price" value={newOrganicsProduct.price} onChange={handleOrganicsProductChange} placeholder="Price" type="number" style={{ flex: 1, padding: "0.5em" }} />
          <button type="submit" style={{ padding: "0.5em 1em", background: "#388e3c", color: "#fff", border: "none", borderRadius: 6 }}>Add</button>
        </form>
        <ul style={{ listStyle: "none", padding: 0 }}>
          {organicsProducts.map(p => (
            <li key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.7em 0", borderBottom: "1px solid #eee" }}>
              <span style={{ fontWeight: 500 }}>{p.name}</span>
              <input type="number" value={p.price} onChange={e => setOrganicsProducts(organicsProducts.map(op => op.id === p.id ? { ...op, price: Number(e.target.value) } : op))} style={{ width: 80, marginLeft: 8 }} />
              <button onClick={() => removeOrganicsProduct(p.id)} style={{ background: "#e53935", color: "#fff", border: "none", borderRadius: 6, padding: "0.3em 0.8em", marginLeft: "1em" }}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      {/* 4. Advanced Controls */}
      <AdminAdvancedControls
        siteContent={siteContent}
        setSiteContent={setSiteContent}
        images={images}
        setImages={setImages}
      />
    </div>
  );
}
