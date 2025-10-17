import React, { useEffect, useState } from "react";

export default function CompaniesPage() {
  const [companies, setCompanies] = useState(null);
  const [loading, setLoading] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [selectedCompany, setSelectedCompany] = useState(null);

  const loadCompanies = () => {
    setLoading(true);
    // Add cache-busting parameter to ensure fresh data
    const timestamp = new Date().getTime();
    fetch(`/api/companies?_t=${timestamp}`, {
      cache: 'no-cache',
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
      }
    })
      .then(r => r.json())
      .then(data => {
        setCompanies(data);
        setLastUpdated(new Date());
        setLoading(false);
      })
      .catch(() => {
        setCompanies(null);
        setLoading(false);
      });
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const renderCompanyCard = (c, fallbackImg) => (
    <div 
      key={c.id} 
      className="company-card" 
      onClick={() => setSelectedCompany(c)}
      style={{ 
        flex: '1 1 320px', 
        background: '#f7faf7', 
        borderRadius: 14, 
        boxShadow: '0 2px 8px rgba(56,142,60,0.07)', 
        padding: '2em', 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        minWidth: 280,
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        border: '2px solid transparent'
      }}
      onMouseOver={e => {
        e.target.style.transform = 'translateY(-4px)';
        e.target.style.boxShadow = '0 8px 24px rgba(56,142,60,0.15)';
        e.target.style.borderColor = '#388e3c';
      }}
      onMouseOut={e => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.boxShadow = '0 2px 8px rgba(56,142,60,0.07)';
        e.target.style.borderColor = 'transparent';
      }}
    >
      <img 
        src={c.logo || (c.products && c.products.length > 0 && c.products[0].image ? c.products[0].image : fallbackImg)} 
        alt={c.name} 
        style={{ width: 80, height: 80, borderRadius: '50%', marginBottom: '1em', objectFit: 'cover', boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} 
      />
      <h3 style={{ color: '#388e3c', fontWeight: 700, fontSize: '1.3em', marginBottom: '0.7em' }}>{c.name}</h3>
      <p style={{ color: '#444', fontSize: '1.08em', textAlign: 'center', marginBottom: '1em' }}>{c.description}</p>
      <div style={{ 
        background: '#388e3c', 
        color: 'white', 
        padding: '0.5em 1.2em', 
        borderRadius: 20, 
        fontSize: '0.9em', 
        fontWeight: 'bold',
        marginTop: 'auto'
      }}>
        Click to view products
      </div>
      {c.products && c.products.length > 0 && (
        <div style={{ marginTop: '0.5em', fontSize: '0.9em', color: '#666' }}>
          {c.products.length} products available
        </div>
      )}
    </div>
  );

  const fallbackMasala = 'https://images.unsplash.com/photo-1519864600265-abb23847ef2c?auto=format&fit=crop&w=400&q=80';
  const fallbackOrganics = 'https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=400&q=80';

  const renderCompanyDetail = (company) => (
    <div className="company-detail" style={{ maxWidth: 1000, margin: "2em auto", padding: "2em", background: "rgba(255,255,255,0.95)", borderRadius: 18, boxShadow: "0 4px 24px rgba(56,142,60,0.10)" }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2em' }}>
        <button 
          onClick={() => setSelectedCompany(null)}
          style={{ 
            background: '#388e3c', 
            color: 'white', 
            border: 'none', 
            padding: '0.7em 1.2em', 
            borderRadius: 8, 
            cursor: 'pointer',
            fontSize: '0.9em',
            fontWeight: 'bold',
            marginRight: '1em'
          }}
          onMouseOver={e => e.target.style.background = '#2e7d32'}
          onMouseOut={e => e.target.style.background = '#388e3c'}
        >
          ← Back to Companies
        </button>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1em' }}>
          <img 
            src={company.logo || (company.products && company.products.length > 0 && company.products[0].image ? company.products[0].image : (company.name && company.name.includes('Masala') ? fallbackMasala : fallbackOrganics))} 
            alt={company.name} 
            style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', boxShadow: '0 2px 8px rgba(56,142,60,0.10)' }} 
          />
          <div>
            <h2 style={{ color: "#388e3c", margin: 0, fontWeight: 800, fontSize: '2.2em', letterSpacing: '1px' }}>{company.name}</h2>
            <p style={{ color: '#666', margin: '0.5em 0 0 0', fontSize: '1.1em' }}>{company.description}</p>
          </div>
        </div>
      </div>

      <div style={{ marginBottom: '2em' }}>
        <h3 style={{ color: '#388e3c', fontSize: '1.8em', marginBottom: '1em', fontWeight: 700 }}>
          Products ({company.products ? company.products.length : 0})
        </h3>
        
        {company.products && company.products.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5em' }}>
            {company.products.map((product, index) => (
              <div key={index} style={{ 
                background: '#f9f9f9', 
                borderRadius: 12, 
                padding: '1.5em', 
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                transition: 'transform 0.2s ease'
              }}
              onMouseOver={e => e.target.style.transform = 'translateY(-2px)'}
              onMouseOut={e => e.target.style.transform = 'translateY(0)'}
              >
                <div style={{ 
                  width: '100%', 
                  height: 180, 
                  borderRadius: 8, 
                  overflow: 'hidden', 
                  background: '#fff', 
                  marginBottom: '1em',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {product.image ? (
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                  ) : (
                    <div style={{ 
                      width: '100%', 
                      height: '100%', 
                      background: 'linear-gradient(135deg, #f5f5f5 0%, #e8e8e8 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#999',
                      fontSize: '0.9em'
                    }}>
                      No Image
                    </div>
                  )}
                </div>
                <h4 style={{ color: '#333', fontSize: '1.2em', fontWeight: 700, marginBottom: '0.5em' }}>{product.name}</h4>
                {product.description && (
                  <p style={{ color: '#666', fontSize: '0.95em', marginBottom: '1em', lineHeight: 1.5 }}>{product.description}</p>
                )}
                {product.price && (
                  <div style={{ 
                    background: '#388e3c', 
                    color: 'white', 
                    padding: '0.5em 1em', 
                    borderRadius: 20, 
                    fontSize: '1.1em', 
                    fontWeight: 'bold',
                    textAlign: 'center'
                  }}>
                    ₹{product.price}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ 
            textAlign: 'center', 
            padding: '3em', 
            color: '#666',
            background: '#f9f9f9',
            borderRadius: 12,
            border: '2px dashed #ddd'
          }}>
            <div style={{ fontSize: '3em', marginBottom: '0.5em' }}>📦</div>
            <h4 style={{ color: '#999', fontSize: '1.2em', marginBottom: '0.5em' }}>No Products Available</h4>
            <p style={{ color: '#999' }}>This company hasn't added any products yet.</p>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="companies-page">
      {selectedCompany ? (
        renderCompanyDetail(selectedCompany)
      ) : (
        <div style={{ maxWidth: 900, margin: "2em auto", padding: "2em", background: "rgba(255,255,255,0.95)", borderRadius: 18, boxShadow: "0 4px 24px rgba(56,142,60,0.10)" }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5em' }}>
            <h2 style={{ color: "#388e3c", margin: 0, fontWeight: 800, fontSize: '2.2em', letterSpacing: '1px' }}>Our Companies</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              {lastUpdated && (
                <small style={{ color: '#666' }}>
                  Updated: {lastUpdated.toLocaleTimeString()}
                </small>
              )}
              <button 
                onClick={loadCompanies}
                disabled={loading}
                style={{ 
                  background: loading ? '#ccc' : '#388e3c', 
                  color: 'white', 
                  border: 'none', 
                  padding: '0.5em 1em', 
                  borderRadius: 8, 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '0.9em',
                  fontWeight: 'bold'
                }}
                onMouseOver={e => { if (!loading) e.target.style.background = '#2e7d32'; }}
                onMouseOut={e => { if (!loading) e.target.style.background = '#388e3c'; }}
              >
                {loading ? '🔄 Loading...' : '🔄 Refresh'}
              </button>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '2.5em', flexWrap: 'wrap', justifyContent: 'center' }}>
            {companies && companies.length > 0 ? (
              companies.map(c => renderCompanyCard(c, c.name && c.name.includes('Masala') ? fallbackMasala : fallbackOrganics))
            ) : (
              <>
                {renderCompanyCard({ id: 'masala', name: 'Aadhivelan Masala', description: 'Premium spice blends and masala products, crafted for authentic taste and quality. Serving homes and businesses with pure, flavorful masalas.', products: [] }, fallbackMasala)}
                {renderCompanyCard({ id: 'organics', name: 'Aadhivelan Organics', description: 'Organic farm produce and products, grown and processed with care for health and sustainability. Bringing fresh, chemical-free food to your table.', products: [] }, fallbackOrganics)}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
