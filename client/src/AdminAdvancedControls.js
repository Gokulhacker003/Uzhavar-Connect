import React, { useState } from "react";

export default function AdminAdvancedControls({ siteContent, setSiteContent, images, setImages }) {
  // Edit any section content
  const [editingSection, setEditingSection] = useState("");
  const [sectionValue, setSectionValue] = useState("");


  // Image management
  function updateImage(section, file) {
    if (!file) return;
    const localUrl = URL.createObjectURL(file);
    setImages({ ...images, [section]: localUrl });
  }

  // Section content management
  function startEditSection(section, value) {
    setEditingSection(section);
    setSectionValue(value);
  }
  function saveSectionEdit() {
    setSiteContent({ ...siteContent, [editingSection]: sectionValue });
    setEditingSection("");
    setSectionValue("");
  }

  return (
    <div style={{ marginTop: "2em" }}>
      <h3 style={{ color: "#388e3c" }}>Advanced Controls</h3>
      {/* Section Content Edit */}
      <div style={{ marginBottom: "2em" }}>
        <h4>Edit Section Content</h4>
        {Object.keys(siteContent).map(section => (
          <div key={section} style={{ marginBottom: "1em" }}>
            <strong>{section}:</strong>
            {editingSection === section ? (
              <>
                <textarea value={sectionValue} onChange={e => setSectionValue(e.target.value)} style={{ width: "100%", minHeight: 60 }} />
                <button onClick={saveSectionEdit} style={{ marginLeft: 8, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4em 1em' }}>Save</button>
                <button onClick={() => setEditingSection("")} style={{ marginLeft: 8, background: '#e53935', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4em 1em' }}>Cancel</button>
              </>
            ) : (
              <>
                <span style={{ marginLeft: 8 }}>{siteContent[section]}</span>
                <button onClick={() => startEditSection(section, siteContent[section])} style={{ marginLeft: 8, background: '#388e3c', color: '#fff', border: 'none', borderRadius: 6, padding: '0.4em 1em' }}>Edit</button>
              </>
            )}
          </div>
        ))}
      </div>
      {/* Product Price Edit removed: now handled in main dashboard */}
      {/* Image Management */}
      <div style={{ marginBottom: "2em" }}>
        <h4>Manage Section Images (Local Only)</h4>
        {Object.keys(images).map(section => (
          <div key={section} style={{ marginBottom: '1em', display: 'flex', alignItems: 'center', gap: '1em' }}>
            <strong>{section}:</strong>
            <input type="file" accept="image/*" onChange={e => updateImage(section, e.target.files[0])} style={{ marginLeft: 8 }} />
            {images[section] && <img src={images[section]} alt={section} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 8, boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}
