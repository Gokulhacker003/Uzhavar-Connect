const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 4000;


app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server running on port ${PORT}`);
});


// Optional: load environment variables from a .env file when available (dev convenience)
try {
  // Load .env located in the server directory explicitly so starting node from a different cwd still works
  const path = require('path');
  require('dotenv').config({ path: path.join(__dirname, '.env') });
} catch (err) {
  // dotenv not installed or .env missing - that's fine for production or when using system env vars
}

// Email configuration
let transporter = null;
if (process.env.SEND_EMAILS === 'true' && process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT) || 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
  
  // Verify connection configuration
  transporter.verify((error, success) => {
    if (error) {
      console.log('Email server verification failed:', error);
      transporter = null; // Disable email sending if verification fails
    } else {
      console.log('Email server is ready to send messages');
    }
  });
} else {
  console.log('Email sending disabled - using local storage only');
}

// Email handling - local storage only (no actual sending)

app.use(cors());
app.use(express.json());

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Ullavar Backend Server', 
    status: 'running',
    endpoints: [
      'GET /api/hello',
      'POST /api/send-email',
      'GET /api/companies',
      'GET /api/submissions (admin)',
      'GET /api/user-data (admin)',
      'GET /admin - Admin data viewer',
      'GET /api/images'
    ]
  });
});

// Serve admin viewer
app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin-viewer.html'));
});

// Example endpoint
app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

// Email handling - local storage only (no actual sending)

// File system helpers for simple persistence
const fs = require('fs');
const path = require('path');
const uploadsDir = path.join(__dirname, 'uploads');
const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });

// Serve uploaded images
app.use('/uploads', express.static(uploadsDir));

// Serve client-side asset assets (so admin can pick existing project images)
const clientAssertDir = path.join(__dirname, '..', 'src', 'assert');
if (fs.existsSync(clientAssertDir)) {
  app.use('/assets/assert', express.static(clientAssertDir));
}

// Multer for file uploads
let multer;
try {
  multer = require('multer');
} catch (err) {
  console.warn('multer not installed. Image upload endpoints will be disabled. Install with `npm install multer` in server folder.');
}
const storage = multer ? multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_'))
}) : null;
const upload = multer ? multer({ storage }) : null;

function readCompanies() {
  const f = path.join(dataDir, 'companies.json');
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeCompanies(data) {
  const f = path.join(dataDir, 'companies.json');
  fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
}

function readSubmissions() {
  const f = path.join(dataDir, 'submissions.json');
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeSubmissions(data) {
  const f = path.join(dataDir, 'submissions.json');
  fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
}

// Helper functions for user data storage
function readUserData() {
  const f = path.join(dataDir, 'user-data.json');
  try {
    return JSON.parse(fs.readFileSync(f, 'utf8'));
  } catch (err) {
    return [];
  }
}

function writeUserData(data) {
  const f = path.join(dataDir, 'user-data.json');
  fs.writeFileSync(f, JSON.stringify(data, null, 2), 'utf8');
}

// GET companies
app.get('/api/companies', (req, res) => {
  const companies = readCompanies();
  res.json(companies);
});

// POST - Create new company
app.post('/api/companies', upload ? upload.single('logo') : (req, res) => res.status(500).json({ error: 'multer not installed' }), (req, res) => {
  const { name, description } = req.body || {};
  if (!name) return res.status(400).json({ error: 'Company name is required' });
  
  const companies = readCompanies();
  let logo = req.body.logo || '';
  if (req.file) logo = `/uploads/${req.file.filename}`;
  
  const newCompany = {
    id: Date.now(),
    name,
    description: description || '',
    logo,
    products: []
  };
  
  companies.push(newCompany);
  writeCompanies(companies);
  res.json(newCompany);
});

// PUT - Update company including logo
app.put('/api/companies/:id', upload ? upload.single('logo') : (req, res) => res.status(500).json({ error: 'multer not installed' }), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const { name, description } = req.body || {};
  const companies = readCompanies();
  const comp = companies.find(c => c.id === id);
  if (!comp) return res.status(404).json({ error: 'Company not found' });
  
  if (name) comp.name = name;
  if (description !== undefined) comp.description = description;
  
  // Handle logo update
  if (req.file) {
    comp.logo = `/uploads/${req.file.filename}`;
  } else if (req.body.logo !== undefined) {
    comp.logo = req.body.logo;
  }
  
  writeCompanies(companies);
  res.json(comp);
});

// DELETE - Delete company
app.delete('/api/companies/:id', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const companies = readCompanies();
  const index = companies.findIndex(c => c.id === id);
  if (index === -1) return res.status(404).json({ error: 'Company not found' });
  
  const deleted = companies.splice(index, 1)[0];
  writeCompanies(companies);
  res.json({ message: 'Company deleted', company: deleted });
});

// Upload image endpoint (returns URL)
app.post('/api/upload-image', upload ? upload.single('image') : (req, res) => res.status(500).json({ error: 'multer not installed' }), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url });
});

// List available images from uploads and client assets
app.get('/api/images', (req, res) => {
  try {
    const images = [];
    // uploads
    const upFiles = fs.existsSync(uploadsDir) ? fs.readdirSync(uploadsDir) : [];
    upFiles.forEach(f => {
      const ext = path.extname(f).toLowerCase();
      if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) images.push({ url: `/uploads/${f}`, source: 'uploads' });
    });
    // client assets
    if (fs.existsSync(clientAssertDir)) {
      const assetFiles = fs.readdirSync(clientAssertDir);
      assetFiles.forEach(f => {
        const ext = path.extname(f).toLowerCase();
        if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.svg'].includes(ext)) images.push({ url: `/assets/assert/${encodeURIComponent(f)}`, source: 'assets' });
      });
    }
    res.json(images);
  } catch (err) {
    console.error('Error listing images', err);
    res.status(500).json({ error: 'Failed to list images' });
  }
});

// Add product to a company (multipart/form-data to accept file)
app.post('/api/companies/:id/products', upload ? upload.single('image') : (req, res) => res.status(500).json({ error: 'multer not installed' }), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const companies = readCompanies();
  const comp = companies.find(c => c.id === id);
  if (!comp) return res.status(404).json({ error: 'Company not found' });

  const name = req.body.name || 'Untitled';
  const price = req.body.price || '';
  let image = req.body.image || '';
  if (req.file) image = `/uploads/${req.file.filename}`;

  comp.products = comp.products || [];
  comp.products.push({ name, price, image });
  writeCompanies(companies);
  res.json(comp);
});

// Remove product by index
app.delete('/api/companies/:id/products/:idx', (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = parseInt(req.params.idx, 10);
  const companies = readCompanies();
  const comp = companies.find(c => c.id === id);
  if (!comp) return res.status(404).json({ error: 'Company not found' });
  if (!comp.products || idx < 0 || idx >= comp.products.length) return res.status(400).json({ error: 'Invalid product index' });
  const removed = comp.products.splice(idx, 1);
  writeCompanies(companies);
  res.json({ removed: removed[0], company: comp });
});

// Update product by index (accepts multipart/form-data or JSON)
app.put('/api/companies/:id/products/:idx', upload ? upload.single('image') : (req, res) => res.status(500).json({ error: 'multer not installed' }), (req, res) => {
  const id = parseInt(req.params.id, 10);
  const idx = parseInt(req.params.idx, 10);
  const companies = readCompanies();
  const comp = companies.find(c => c.id === id);
  if (!comp) return res.status(404).json({ error: 'Company not found' });
  if (!comp.products || idx < 0 || idx >= comp.products.length) return res.status(400).json({ error: 'Invalid product index' });

  const bodyName = req.body && req.body.name;
  const bodyPrice = req.body && req.body.price;
  let bodyImage = req.body && req.body.image;
  if (req.file) bodyImage = `/uploads/${req.file.filename}`;

  const prod = comp.products[idx];
  if (bodyName) prod.name = bodyName;
  if (bodyPrice !== undefined) prod.price = bodyPrice;
  if (bodyImage) prod.image = bodyImage;

  writeCompanies(companies);
  res.json(comp);
});

// Return persisted form submissions (admin-only)
app.get('/api/submissions', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    const expected = process.env.ADMIN_KEY;
    if (!expected) {
      return res.status(403).json({ error: 'Admin access not configured. Set ADMIN_KEY in server .env to enable.' });
    }
    if (!adminKey || adminKey !== expected) {
      return res.status(401).json({ error: 'Unauthorized. Provide valid admin key via x-admin-key header.' });
    }
    const subs = readSubmissions();
    res.json(subs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to read submissions' });
  }
});

app.post('/api/send-email', async (req, res) => {
  const toEmail = process.env.TO_EMAIL || 'uzhavarconnect2025@gmail.com';
  const { subject, name, email, phone, message, formType, extra } = req.body || {};

  const emailSubject = subject || (formType ? `${formType} Submission from ${name || 'Customer'}` : `New submission from ${name || 'Customer'}`);
  const htmlParts = [];
  
  // Build email content
  htmlParts.push(`<h2>New Form Submission</h2>`);
  if (formType) htmlParts.push(`<p><strong>Form Type:</strong> ${formType}</p>`);
  if (name) htmlParts.push(`<p><strong>Name:</strong> ${name}</p>`);
  if (email) htmlParts.push(`<p><strong>Email:</strong> ${email}</p>`);
  if (phone) htmlParts.push(`<p><strong>Phone:</strong> ${phone}</p>`);
  if (message) htmlParts.push(`<p><strong>Message:</strong><br/>${message.replace(/\n/g, '<br/>')}</p>`);
  
  if (extra && typeof extra === 'object') {
    htmlParts.push('<h3>Additional Details</h3>');
    htmlParts.push('<ul>');
    for (const [k,v] of Object.entries(extra)) {
      if (v !== null && v !== undefined && v !== '') {
        htmlParts.push(`<li><strong>${k}:</strong> ${v}</li>`);
      }
    }
    htmlParts.push('</ul>');
  }
  
  htmlParts.push(`<hr/><p><small>Submitted at: ${new Date().toLocaleString()}</small></p>`);
  const htmlBody = htmlParts.join('\n') || '<p>No details provided.</p>';

  // Persist submission locally for auditing / admin review
  try {
    const subs = readSubmissions();
    const submissionEntry = {
      receivedAt: new Date().toISOString(),
      toEmail,
      subject: emailSubject,
      payload: { name, email, phone, message, formType, extra },
      metadata: {
        userAgent: req.headers['user-agent'],
        ip: req.ip || req.connection.remoteAddress,
        referer: req.headers.referer,
        contentLength: req.headers['content-length']
      }
    };
    subs.push(submissionEntry);
    writeSubmissions(subs);
    console.log('Form submission stored with metadata:', submissionEntry);
  } catch (err) {
    console.warn('Failed to persist submission', err);
  }

  // Try to send actual email if configured
  let emailSent = false;
  let emailError = null;
  
  if (transporter) {
    try {
      const mailOptions = {
        from: `"Ullavar Connect" <${process.env.SMTP_USER}>`,
        to: toEmail,
        subject: emailSubject,
        html: htmlBody
      };
      
      await transporter.sendMail(mailOptions);
      emailSent = true;
      console.log('Email sent successfully to:', toEmail);
    } catch (error) {
      emailError = error.message;
      console.error('Failed to send email:', error);
    }
  }

  // Store email log
  try {
    const logLine = `${new Date().toISOString()} - ${emailSent ? 'SENT' : 'STORED LOCALLY'} - to=${toEmail} subject=${emailSubject} ${emailError ? `error=${emailError}` : ''}\n`;
    fs.appendFileSync(path.join(dataDir, 'email.log'), logLine, 'utf8');
  } catch (err) {
    console.warn('Failed to write email.log', err);
  }
  
  res.json({ 
    success: true, 
    emailSent,
    message: emailSent ? 'Email sent successfully!' : 'Form submitted and stored locally.',
    ...(emailError && { emailError })
  });
});

// Store any user data locally
app.post('/api/store-data', (req, res) => {
  try {
    const userData = readUserData();
    const newEntry = {
      id: Date.now(), // Simple ID using timestamp
      timestamp: new Date().toISOString(),
      type: req.body.type || 'general',
      data: req.body.data || req.body,
      userAgent: req.headers['user-agent'],
      ip: req.ip || req.connection.remoteAddress
    };
    
    userData.push(newEntry);
    writeUserData(userData);
    
    console.log('User data stored locally:', newEntry);
    res.json({ success: true, id: newEntry.id, message: 'Data stored locally successfully' });
  } catch (err) {
    console.error('Failed to store user data:', err);
    res.status(500).json({ success: false, error: 'Failed to store data locally' });
  }
});

// Get stored user data (admin-only)
app.get('/api/user-data', (req, res) => {
  try {
    const adminKey = req.headers['x-admin-key'] || req.query.adminKey;
    const expected = process.env.ADMIN_KEY;
    if (!expected) {
      return res.status(403).json({ error: 'Admin access not configured. Set ADMIN_KEY in server .env to enable.' });
    }
    if (!adminKey || adminKey !== expected) {
      return res.status(401).json({ error: 'Unauthorized. Provide valid admin key via x-admin-key header.' });
    }
    
    const userData = readUserData();
    res.json(userData);
  } catch (err) {
    console.error('Failed to read user data:', err);
    res.status(500).json({ error: 'Failed to read user data' });
  }
});

// Bind explicitly to 127.0.0.1 to avoid hostname/IPv6 resolution issues on some Windows setups
app.listen(PORT, '127.0.0.1', () => {
  console.log(`Server running on http://127.0.0.1:${PORT}`);
});
