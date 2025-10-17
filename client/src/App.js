import React, { useState, useEffect } from 'react';
import { getHello } from './api';
import ConfirmPlan from './ConfirmPlan';
import AdminCompaniesPage from './admin/AdminCompaniesPage';
import AdminSubmissionsPage from './admin/AdminSubmissionsPage';
import AdminUserDataPage from './admin/AdminUserDataPage';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import CompaniesPage from './CompaniesPage';
import RequestQuotePage from './RequestQuotePage';
import ProjectsPage from './ProjectsPage';
import FarmDetailsPage from './FarmDetailsPage';
import BookTeamPage from './BookTeamPage';
import { BrowserRouter as Router, Routes, Route, Link, NavLink } from 'react-router-dom';
import { FaLeaf,FaUser, FaEnvelope, FaSeedling, FaTools, FaIdCard, FaHandshake, FaTractor, FaImage, FaMapMarkerAlt, FaCalendarAlt, FaCheckCircle, FaUserFriends, FaPhone, FaFileAlt, FaShoppingCart, FaClipboardList, FaBriefcase } from 'react-icons/fa';
import { MdOutlineConstruction, MdSettings, MdSell, MdLandscape } from 'react-icons/md';
import { BsArrowRightCircle, BsCalendarCheck, BsStars } from 'react-icons/bs';
import './App.css';
import {
  GiWheat,
  GiFarmTractor,
  GiPlantRoots,
  GiFruitTree,
  GiWateringCan,
} from 'react-icons/gi';
import { GiWoodenFence } from 'react-icons/gi';
import fencingImg from './assert/fencing.jpg';
import mango from './assert/Mango AMC.jpg';
import water from './assert/Water Tank Construction.jpg';
import drip from './assert/Drip Irrigation.webp';
import coconut from './assert/Coconut Plantation.jpg';
import farm from './assert/Farm Shed Construction.jpg';
import worker from './assert/farm workers.jpg'
import farmhouseImg from './assert/FArmhouse.jpeg'
import poolImg from './assert/Swimmingpool.jpeg'
import tankImg from './assert/tank.jpeg'
import polyhouseImg from './assert/polly.jpeg'
import shedImg from './assert/goat.jpg'
import founderImg from './assert/founder.jpg'
import adminImg from './assert/admin.jpg'

// ...existing code...

// Main projects array for carousel and other usage
const projects = [
  {
    title: 'Fencing',
    image: fencingImg,
    description: 'High-quality farm fencing for security and livestock management.'
  },
  {
    title: 'Mango AMC',
    image: mango,
    description: 'Annual Maintenance Contract for Mango orchards.'
  },
  {
    title: 'Water Tank Construction',
    image: water,
    description: 'Custom-built water tanks for farm irrigation.'
  },
  {
    title: 'Drip Irrigation',
    image: drip,
    description: 'Efficient drip irrigation systems for water conservation.'
  },
  {
    title: 'Coconut Plantation',
    image: coconut,
    description: 'Coconut plantation setup and management.'
  },
  {
    title: 'Farm Shed Construction',
    image: farm,
    description: 'Durable sheds for farm equipment and storage.'
  },
  {
    title: 'Farm Workers',
    image: worker,
    description: 'Skilled farm workers for all agricultural needs.'
  },
  {
    title: 'Farmhouse',
    image: farmhouseImg,
    description: 'Farmhouse construction and renovation.'
  },
  {
    title: 'Swimming Pool',
    image: poolImg,
    description: 'Swimming pool construction for farms and resorts.'
  },
  {
    title: 'Water Tank',
    image: tankImg,
    description: 'Water tank installation and maintenance.'
  },
  {
    title: 'Polyhouse',
    image: polyhouseImg,
    description: 'Polyhouse setup for protected cultivation.'
  },
  {
    title: 'Goat Shed',
    image: shedImg,
    description: 'Goat shed construction for livestock.'
  }
];


const services = [
  {
    title: "AMC (Annual Maintenance Contract)",
    icon: <FaCalendarAlt className="service-icon" />,
    description: "Scheduled maintenance for your farm with calendar-based tracking"
  },
  {
    title: "New Projects",
    icon: <MdOutlineConstruction className="service-icon" />,
    description: "Fencing, drip irrigation, planting and more"
  },
  {
    title: "Construction",
    icon: <GiWoodenFence className="service-icon" />,
    description: "Tanks, pools, sheds and other farm structures"
  },
  {
    title: "Inputs Supply",
    icon: <FaShoppingCart className="service-icon" />,
    description: "Tools, fertilizers, motors and other farm inputs"
  },
  {
    title: "Land Buy/Sell",
    icon: <MdLandscape className="service-icon" />,
    description: "Verified listings with soil/water data"
  },
  {
    title: "Crop Sales",
    icon: <MdSell className="service-icon" />,
    description: "Buyer connect and market price comparison"
  }
];

const trustFactors = [
  {
    title: "Photo Proof for Every Task",
    icon: <FaImage />,
    description: "Visual verification of completed work"
  },
  {
    title: "Calendar-Based AMC",
    icon: <FaCalendarAlt />,
    description: "Structured, not ad-hoc maintenance"
  },
  {
    title: "Fertilizer + Weather Synced",
    icon: <GiWateringCan />,
    description: "Smart scheduling based on conditions"
  },
  {
    title: "Transparent Pricing",
    icon: <FaHandshake />,
    description: "No hidden fees, no middlemen"
  },
  {
    title: "Easy Approval Process",
    icon: <FaCheckCircle />,
    description: "Via app or WhatsApp"
  },
  {
    title: "Trained Local Teams",
    icon: <FaUserFriends />,
    description: "Verified contracts and reliable workers"
  },
  {
    title: "One Vendor Responsibility",
    icon: <FaBriefcase />,
    description: "Single point of contact for all work"
  }
];

const howItWorks = [
  {
    step: 1,
    title: "Farm Visit & Needs Mapping",
    description: "We visit your farm and document requirements",
    icon: <FaMapMarkerAlt />
  },
  {
    step: 2,
    title: "Quote + Calendar",
    description: "We provide transparent pricing and schedule",
    icon: <FaCalendarAlt />
  },
  {
    step: 3,
    title: "Contract & Team Assignment",
    description: "Sign agreement and we assign the right team",
    icon: <FaFileAlt />
  },
  {
    step: 4,
    title: "Work & Photo Upload",
    description: "Work execution with photo documentation",
    icon: <FaImage />
  },
  {
    step: 5,
    title: "Approval by Farmer",
    description: "Review and approve completed tasks",
    icon: <FaCheckCircle />
  },
  {
    step: 6,
    title: "Monthly Reports",
    description: "Detailed reporting of all work done",
    icon: <FaClipboardList />
  }
];

function App() {
  // Modal state for Book a Project (legacy, not used)
  // const [showProjectModal, setShowProjectModal] = useState(false);

  // State for Book Project modal (used in main JSX)
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [projectForm, setProjectForm] = useState({
    name: '',
    phone: '',
    email: '',
    projectType: '',
    details: ''
  });
  const [projectSubmitted, setProjectSubmitted] = useState(false);

  const handleProjectInput = (e) => {
    const { name, value } = e.target;
    setProjectForm(prev => ({ ...prev, [name]: value }));
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    // send to backend
    postToApi({
      formType: 'Project Request',
      name: projectForm.name,
      email: projectForm.email,
      phone: projectForm.phone,
      message: projectForm.details,
      extra: { projectType: projectForm.projectType }
    }).then(() => {
      setProjectSubmitted(true);
      setShowProjectForm(false);
      setProjectForm({ name: '', phone: '', email: '', projectType: '', details: '' });
      alert('Project request submitted! Our team will contact you soon.');
    }).catch(err => {
      console.error(err);
      alert('Failed to submit. Please try again later.');
    });
  };

  // Soil Test Modal State for Fertilizer Plan
  const [showSoilTestModal, setShowSoilTestModal] = useState(false);
  const [soilTestForm, setSoilTestForm] = useState({
    name: '',
    phone: '',
    email: '',
    farmLocation: '',
    farmSize: ''
  });

  const handleSoilTestChange = (e) => {
    const { name, value } = e.target;
    setSoilTestForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSoilTestSubmit = (e) => {
    e.preventDefault();
    postToApi({
      formType: 'Soil Test',
      name: soilTestForm.name,
      email: soilTestForm.email,
      phone: soilTestForm.phone,
      extra: { farmLocation: soilTestForm.farmLocation, farmSize: soilTestForm.farmSize }
    }).then(() => {
      alert('Soil Test Scheduled! We will contact you soon.');
      setShowSoilTestModal(false);
      setSoilTestForm({ name: '', phone: '', email: '', farmLocation: '', farmSize: '' });
    }).catch(err => {
      console.error(err);
      alert('Failed to schedule soil test. Please try again later.');
    });
  };

  // helper to POST to backend
  const postToApi = async (payload) => {
    const res = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error('Network response was not ok');
    return res.json();
  };

  // Remove legacy handleBookProject and setShowProjectModal
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % projects.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Router>
      <div className="app" style={{ position: 'relative', minHeight: '100vh', overflow: 'hidden' }}>
        {/* Global Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="background-video"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            objectFit: 'cover',
            zIndex: -1,
            pointerEvents: 'none',
            opacity: 0.45
          }}
        >
          <source src={process.env.PUBLIC_URL + '/videos/farm-bg.mp4'} type="video/mp4" />
        </video>
        <nav className="navbar" style={{ minHeight: '44px', padding: '0 1em', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
          <div className="navbar-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '44px' }}>
            <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '0.5em', fontSize: '1em' }}>
              <GiWheat className="logo-icon" style={{ fontSize: '1.2em' }} />
              <span className="logo-text" style={{ fontWeight: 700, color: '#388e3c' }}>Ullavar Connect</span>
            </div>
            <div className={`menu-toggle ${isMenuOpen ? 'open' : ''}`} onClick={() => setIsMenuOpen(!isMenuOpen)}>
              <span></span>
              <span></span>
              <span></span>
            </div>
            <ul className={`nav-menu ${isMenuOpen ? 'open' : ''}`} style={{ fontFamily: 'Segoe UI, Arial, sans-serif', fontSize: '13px', fontWeight: 500, display: 'flex', flexWrap: 'nowrap', gap: '0.8em', justifyContent: 'center', alignItems: 'center', listStyle: 'none', margin: 0, padding: 0, overflowX: 'auto', whiteSpace: 'nowrap' }}>
              <li><NavLink to="/" end onClick={() => setIsMenuOpen(false)}>Home</NavLink></li>
              <li><NavLink to="/about" onClick={() => setIsMenuOpen(false)}>About</NavLink></li>
              <li><NavLink to="/companies" onClick={() => setIsMenuOpen(false)}>Our Companies</NavLink></li>
              <li><NavLink to="/manage-farm" onClick={() => setIsMenuOpen(false)}>Manage Farm</NavLink></li>
              <li><NavLink to="/buy-inputs" onClick={() => setIsMenuOpen(false)}>Buy Inputs</NavLink></li>
              <li><NavLink to="/sell-produce" onClick={() => setIsMenuOpen(false)}>Sell Produce</NavLink></li>
              <li><NavLink to="/land" onClick={() => setIsMenuOpen(false)}>Land</NavLink></li>
              <li><NavLink to="/construction" onClick={() => setIsMenuOpen(false)}>Construction</NavLink></li>
              <li><NavLink to="/projects" onClick={() => setIsMenuOpen(false)}>Past Work</NavLink></li>
              <li><NavLink to="/join" onClick={() => setIsMenuOpen(false)}>Join Us</NavLink></li>
            </ul>
          </div>
        </nav>

        <main>
          <Routes>
            <Route path="/" element={<HomePage currentSlide={currentSlide} />} />
            <Route path="/farm-details" element={<FarmDetailsPage />} />
            <Route path="/book-team" element={<BookTeamPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/companies" element={<CompaniesPage />} />
            <Route path="/manage-farm" element={
              <ManageFarmPage
                onOpenSoilTestModal={() => setShowSoilTestModal(true)}
                showProjectForm={showProjectForm}
                setShowProjectForm={setShowProjectForm}
                projectForm={projectForm}
                handleProjectInput={handleProjectInput}
                handleProjectSubmit={handleProjectSubmit}
                projectSubmitted={projectSubmitted}
              />
            } />
            <Route path="/buy-inputs" element={<BuyInputsPage />} />
            <Route path="/sell-produce" element={<SellProducePage />} />
            <Route path="/land" element={<LandPage />} />
            <Route path="/construction" element={<ConstructionPage />} />
            <Route path="/request-quote" element={<RequestQuotePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/join" element={<JoinUsPage />} />
            <Route path="/confirm-plan" element={<ConfirmPlan />} />
            <Route path="/admin/companies" element={<AdminCompaniesPage onLogout={() => { /* navigation fallback if needed */ }} />} />
            <Route path="/admin/submissions" element={<AdminSubmissionsPage />} />
            <Route path="/admin/user-data" element={<AdminUserDataPage />} />
          </Routes>
          {/* Soil Test Modal for Fertilizer Plan - only rendered in App */}
          {showSoilTestModal && (
            <div className="modal-overlay">
              <div className="modal soil-test-modal">
                <button className="modal-close" onClick={() => setShowSoilTestModal(false)} title="Close">&times;</button>
                <h2>
                  <span role="img" aria-label="soil">🧪</span> Schedule Soil Test
                </h2>
                <form onSubmit={handleSoilTestSubmit} className="soil-test-form">
                  <label>
                    Name
                    <input type="text" name="name" value={soilTestForm.name} onChange={handleSoilTestChange} required placeholder="Enter your name" />
                  </label>
                  <label>
                    Phone
                    <input type="tel" name="phone" value={soilTestForm.phone} onChange={handleSoilTestChange} required placeholder="10-digit mobile number" maxLength="10" />
                  </label>
                  <label>
                    Email
                    <input type="email" name="email" value={soilTestForm.email} onChange={handleSoilTestChange} required placeholder="Enter your email" />
                  </label>
                  <label>
                    Farm Location
                    <input type="text" name="farmLocation" value={soilTestForm.farmLocation} onChange={handleSoilTestChange} required placeholder="e.g., Coimbatore" />
                  </label>
                  <label>
                    Farm Size (in acres)
                    <input type="text" name="farmSize" value={soilTestForm.farmSize} onChange={handleSoilTestChange} required placeholder="e.g., 5" />
                  </label>
                  <div className="form-actions">
                    <button type="submit" className="btn btn-primary">Submit</button>
                    <button type="button" className="btn btn-secondary" onClick={() => setShowSoilTestModal(false)}>Cancel</button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
  <footer className="footer">
          <div className="footer-section">
            <h3>Ullavar Connect</h3>
            <p>Manage Your Farm Like a Pro. From Soil to Sale.</p>
          </div>
          <div className="footer-section">
            <h3>Quick Links</h3>
            <ul>
              <li><Link to="/about">About Us</Link></li>
              <li><Link to="/contact">Contact</Link></li>
              <li><Link to="/privacy-policy">Privacy Policy</Link></li>
              <li><Link to="/join">Careers</Link></li>
            </ul>
          </div>
          <div className="footer-section">
            <h3>Contact Us</h3>
            <p>Email: uzhavarconnect2025@gmail.com</p>
            <p>Phone: +91 7550119994 / 9842297056</p>
            <div className="app-download">
              <h4>Address</h4>
              <div className="app-buttons">
                <p>
                  7/3, Duraiswamy Nagar<br />
                  Coimbatore, Tamil Nadu - 641014<br />
                  India
                </p>
              </div>
            </div>
          </div>
          <div className="footer-cta">
            <h2>Start with a One-Time Project or Choose a Monthly Plan</h2>
            <div className="cta-buttons">
              <button className="btn btn-primary">Book Now</button>
              <button className="btn btn-secondary">Talk to Our Team</button>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; {new Date().getFullYear()} Ullavar Connect. All rights reserved.</p>
            <p>Powered by Netcraft Studio</p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

function HomePage({ currentSlide, onBookProject }) {
  const [backendMessage, setBackendMessage] = useState('');
  useEffect(() => {
    getHello().then(data => setBackendMessage(data.message)).catch(() => setBackendMessage('Backend not reachable'));
  }, []);

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-content">
          <h1>Manage Your Farm Like a Pro. From Soil to Sale.</h1>
          <p style={{ color: '#388e3c', fontWeight: 'bold' }}>AMC, planting, irrigation, fencing, inputs, tank work, harvesting, buyer connect – all in one app. With photo proof.</p>
          <div style={{marginBottom: '1em', color: 'green', fontWeight: 'bold'}}>
            Backend says: {backendMessage}
          </div>
          <div className="hero-cta">
            <Link to="/manage-farm" className="btn btn-primary"><GiFarmTractor /> Start Managing My Farm</Link>
            <Link to="/buy-inputs" className="btn btn-secondary"><FaShoppingCart /> Buy Agri Inputs</Link>
            <Link to="/sell-produce" className="btn btn-secondary"><MdSell /> Sell My Produce</Link>
            <Link to="/book-team" className="btn btn-primary" style={{marginLeft:'1em'}}>Book Our Team</Link>
            <Link to="/farm-details" className="btn btn-success" style={{marginLeft:'1em',background:'#388e3c',color:'#fff'}}>Upload My Farm Details</Link>
            {/* Book a Project button removed as requested */}
          </div>
        </div>
        <div className="hero-image">
          <img src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Farm Management" />
        </div>
      </section>


      <section className="what-we-do-section">
        <div className="section-heading">
          <h2><FaLeaf /> We Are Ullavar Connect – What We Do</h2>
          <p className="tagline">We are not a consultancy. Not just labour. We are your farm's execution team – structured, documented, scheduled.</p>
        </div>
        <div className="services-grid">
          {services.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="service-card-icon">
                {service.icon}
              </div>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
  {/* Explore All Services button removed as requested */}
      </section>

      <section className="trust-section">
        <div className="section-heading">
          <h2><BsStars /> Why Farmers Choose Us</h2>
        </div>
        <div className="trust-factors">
          {trustFactors.map((factor, index) => (
            <div className="trust-card" key={index}>
              <div className="trust-icon">{factor.icon}</div>
              <h3>{factor.title}</h3>
              <p>{factor.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="section-heading">
          <h2><MdSettings /> How It Works – SOP System</h2>
        </div>
        <div className="steps-container">
          {howItWorks.map((step) => (
            <div className="step-card" key={step.step}>
              <div className="step-number">{step.step}</div>
              <div className="step-icon">{step.icon}</div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </div>
          ))}
        </div>
  {/* Book Site Visit button removed as requested */}
      </section>

      <section className="recent-projects-section">
        <div className="section-heading">
          <h2><FaImage /> Recent Projects</h2>
        </div>
        <div className="projects-carousel">
          <div className="carousel-container" style={{ transform: `translateX(-${currentSlide * 100}%)` }}>
            {projects.map((project, index) => (
              <div className="project-card" key={project.id}>
                <div className="project-image">
                  <img src={project.image} alt={project.title} />
                </div>
                <div className="project-info">
                  <h3>{project.title}</h3>
                  <p>{project.description}</p>
                  <p className="project-location"><FaMapMarkerAlt /> {project.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="carousel-dots">
          {projects.map((_, index) => (
            <span 
              key={index} 
              className={`dot ${currentSlide === index ? 'active' : ''}`} 
            />
          ))}
        </div>
        <Link to="/projects" className="btn btn-primary center-btn">See Past Work <BsArrowRightCircle /></Link>
      </section>
    </div>
  );
}

function AboutPage() {
  return (
    <div className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1>Who We Are</h1>
          <div className="about-statement">
            <p>We are Ullavar Connect – a full-stack, no-nonsense, execution team for farmers.</p>
            <p className="highlight">We've built farms. Not decks.</p>
            <p className="highlight">We don't sell leads. We take responsibility.</p>
          </div>
        </div>
        <div className="about-hero-image">
          <img src="https://media.istockphoto.com/id/1316735334/photo/young-indian-farmer-with-agronomist-at-banana-field.jpg?s=612x612&w=0&k=20&c=SjD-Bi-oO9LsYUSB69Jphal7nB-DySGiwLb8aDnw8UI=" alt="Farm Workers" />
        </div>
      </section>
      
      <section className="about-mission">
        <h2>Our Mission</h2>
        <p>Whether you're a 10-acre landowner or NRI, we offer peace of mind, proof of work, and professional systems.</p>
        <blockquote>Build your farm like it's a factory.</blockquote>
      </section>
      
      <section className="about-team">
        <h2>Our Team</h2>
        <div className="team-grid">
          <div className="team-member">
            <img src={founderImg} alt="Founder" />
            <h3>Velu Samy</h3>
            <p style={{ color: '#388e3c', fontWeight: 'bold' }}>Founder</p>
          </div>
          <div className="team-member">
            <img src={adminImg} alt="Admin" />
            <h3>Prasanth</h3>
            <p style={{ color: '#388e3c', fontWeight: 'bold' }}>Admin</p>
          </div>
        </div>
      </section>
    </div>
  );
}

function ManageFarmPage(props) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('monthly');
  // All modal state and handlers come from props
  const {
    showProjectForm,
    setShowProjectForm,
    projectForm,
    handleProjectInput,
    handleProjectSubmit,
    projectSubmitted,
    onOpenSoilTestModal
  } = props;
  
  return (
    <div className="manage-farm-page" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <section className="page-header" style={{ textAlign: 'center', width: '100%' }}>
        <h1 style={{ textAlign: 'center' }}><GiFarmTractor /> Manage My Farm</h1>
        <p style={{ color: '#388e3c', fontWeight: 'bold', textAlign: 'center' }}>For AMC (maintenance) and Projects</p>
      </section>
      
      <div className="farm-tabs" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div className="tab-headers" style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <button 
            className={`tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
            style={{ background: activeTab === 'monthly' ? '#e3f2fd' : '#fff', color: '#1976d2', borderColor: '#1976d2' }}
            onClick={() => setActiveTab('monthly')}
          >
            <BsCalendarCheck /> Monthly AMC
          </button>
          <button 
            className={`tab-btn ${activeTab === 'fertilizer' ? 'active' : ''}`}
            style={{ background: activeTab === 'fertilizer' ? '#f1f8e9' : '#fff', color: '#388e3c', borderColor: '#388e3c' }}
            onClick={() => setActiveTab('fertilizer')}
          >
            <GiPlantRoots /> Fertilizer Plan
          </button>
          <button 
            className={`tab-btn ${activeTab === 'pruning' ? 'active' : ''}`}
            style={{ background: activeTab === 'pruning' ? '#fffde7' : '#fff', color: '#fbc02d', borderColor: '#fbc02d' }}
            onClick={() => setActiveTab('pruning')}
          >
            <FaSeedling /> Pruning & Pest Control
          </button>
          {/* Project Work tab fully removed as requested */}
          <button 
            className={`tab-btn ${activeTab === 'construction' ? 'active' : ''}`}
            style={{ background: activeTab === 'construction' ? '#ede7f6' : '#fff', color: '#512da8', borderColor: '#512da8' }}
            onClick={() => setActiveTab('construction')}
          >
            <GiWoodenFence /> Construction
          </button>
          <button 
            className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
            style={{ background: activeTab === 'reports' ? '#e0f7fa' : '#fff', color: '#00838f', borderColor: '#00838f' }}
            onClick={() => setActiveTab('reports')}
          >
            <FaClipboardList /> Reports & Approval
          </button>
        </div>
        
        <div className="tab-content">
          {activeTab === 'monthly' && (
            <div className="tab-pane">
              <h2>Monthly AMC (Annual Maintenance Contract)</h2>
              <p>Our structured monthly maintenance plans keep your farm in optimal condition year-round.</p>
              <div className="plan-cards">
                <div className="plan-card">
                  <h3>Basic Plan</h3>
                  <ul>
                    <li>Monthly farm visit</li>
                    <li>Basic irrigation check</li>
                    <li>Pest monitoring</li>
                    <li>Monthly report</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=basic')}>Select Plan</button>
                </div>
                <div className="plan-card featured">
                  <div className="featured-badge">Popular</div>
                  <h3>Standard Plan</h3>
                  <ul>
                    <li>Bi-weekly farm visit</li>
                    <li>Full irrigation maintenance</li>
                    <li>Pest control application</li>
                    <li>Fertilizer application</li>
                    <li>Detailed bi-weekly reports</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=standard')}>Select Plan</button>
                </div>
                <div className="plan-card">
                  <h3>Premium Plan</h3>
                  <ul>
                    <li>Weekly farm visit</li>
                    <li>Complete farm management</li>
                    <li>Advanced pest management</li>
                    <li>Customized fertilizer program</li>
                    <li>Weekly detailed reports</li>
                    <li>Priority support</li>
                  </ul>
                  <button className="btn btn-primary" onClick={() => navigate('/confirm-plan?type=premium')}>Select Plan</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'fertilizer' && (
            <div className="tab-pane">
              <h2>Fertilizer Plan</h2>
              <p>Custom fertilizer scheduling based on crop needs and seasonal conditions.</p>
              <div className="fertilizer-content">
                <div className="fertilizer-image">
                  <img src="https://images.unsplash.com/photo-1563514227147-6d2ff665a7a4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Fertilizer Application" />
                </div>
                <div className="fertilizer-info">
                  <h3>Weather-Synced Fertilizer Application</h3>
                  <p>Our system automatically adjusts your fertilizer schedule based on weather forecasts and soil conditions.</p>
                  <ul>
                    <li>Soil testing and analysis</li>
                    <li>Custom nutrient programs</li>
                    <li>Seasonal adjustments</li>
                    <li>Organic and conventional options</li>
                  </ul>
                  <button className="btn btn-primary" onClick={onOpenSoilTestModal}>Schedule Soil Test</button>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'pruning' && (
            <div className="tab-pane">
              <h2>Pruning & Pest Control</h2>
              <p>Maintain healthy growth and protect your crops from pests.</p>
              <div className="service-details">
                <div className="service-image">
                  <img src="https://images.unsplash.com/photo-1627646295764-3fb77cbd2d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Pruning Service" />
                </div>
                <div className="service-text">
                  <h3>Expert Pruning Services</h3>
                  <p>Our trained teams use proper techniques to encourage healthy growth and maximum yield.</p>
                  <ul>
                    <li>Seasonal maintenance pruning</li>
                    <li>Structural pruning for young trees</li>
                    <li>Rejuvenation pruning for older plants</li>
                    <li>Post-harvest pruning</li>
                  </ul>
                </div>
              </div>
              <div className="service-details reversed">
                <div className="service-text">
                  <h3>Integrated Pest Management</h3>
                  <p>Our pest management program uses eco-friendly solutions and expert monitoring to keep your crops healthy.</p>
                </div>
              </div>
            </div>
          )}
          {activeTab === 'construction' && (
            <div className="tab-pane">
              <h2>Construction Services</h2>
              <p>Build essential farm infrastructure with our experienced construction teams.</p>
              <div className="construction-items">
                <div className="construction-item">
                  <img src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Water Tank" />
                  <h3>Water Tanks</h3>
                  <p>Storage solutions for irrigation needs.</p>
                </div>
                <div className="construction-item">
                  <img src="/assert/storage-shed.jpg" alt="Storage Shed" />
                  <h3>Storage Sheds</h3>
                  <p>Protect equipment and harvest.</p>
                </div>
                <div className="construction-item">
                  <img src="https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farmhouse" />
                  <h3>Farmhouses</h3>
                  <p>Comfortable on-farm living spaces.</p>
                </div>
              </div>
              <Link to="/construction" className="btn btn-primary center-btn">View All Construction Services</Link>
            </div>
          )}
          
          {activeTab === 'reports' && (
            <div className="tab-pane">
              <h2>Reports & Approval Logs</h2>
              <p>Track all farm activities with detailed documentation.</p>
              <div className="reports-demo">
                <div className="reports-image">
                  <img src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Reports Dashboard" />
                </div>
                <div className="reports-features">
                  <h3>Our Reporting System Includes:</h3>
                  <ul>
                    <li>Photo documentation of all work</li>
                    <li>Task completion timestamps</li>
                    <li>Worker performance metrics</li>
                    <li>Material usage tracking</li>
                    <li>Weather condition logs</li>
                    <li>Digital approval systems</li>
                    <li>Monthly summary reports</li>
                  </ul>
                  {/* View Sample Report button removed as requested */}
                </div>
              </div>
              <div className="approval-system">
                <h3>Easy Approval System</h3>
                <p>Review and approve work through our app or WhatsApp messages.</p>
                <div className="approval-demo">
                  <div className="approval-step">
                    <div className="step-number">1</div>
                    <p>Receive notification of completed work</p>
                  </div>
                  <div className="approval-step">
                    <div className="step-number">2</div>
                    <p>View photos and details</p>
                  </div>
                  <div className="approval-step">
                    <div className="step-number">3</div>
                    <p>Approve or request changes</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <div className="farm-cta">
        <div className="cta-buttons">
          <button className="btn btn-primary" onClick={() => setActiveTab('monthly')}>Start AMC</button>
          <button className="btn btn-secondary" onClick={() => setShowProjectForm(true)}>Book Project</button>
          <Link to="/farm-details" className="btn btn-success" style={{marginLeft:'1em',background:'#388e3c',color:'#fff'}}>Upload My Farm Details</Link>
        </div>
        {showProjectForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h2>Book a Project</h2>
              <form onSubmit={handleProjectSubmit} className="project-form">
                <div className="form-group">
                  <label>Name</label>
                  <input type="text" name="name" value={projectForm.name} onChange={handleProjectInput} required pattern="^[A-Za-z ]+$" title="Name should contain only letters and spaces" />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input type="tel" name="phone" value={projectForm.phone} onChange={handleProjectInput} required pattern="^[0-9]{10}$" maxLength="10" title="Enter a valid 10-digit phone number" />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input type="email" name="email" value={projectForm.email} onChange={handleProjectInput} required />
                </div>
                <div className="form-group">
                  <label>Project Type</label>
                  <select name="projectType" value={projectForm.projectType} onChange={handleProjectInput} required>
                    <option value="">Select Type</option>
                    <option value="Fencing">Fencing</option>
                    <option value="Drip Irrigation">Drip Irrigation</option>
                    <option value="Plantation">Plantation</option>
                    <option value="Land Preparation">Land Preparation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={projectForm.description} onChange={handleProjectInput} rows="3" required maxLength="500" title="Describe your project (max 500 characters)" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn btn-primary">Submit</button>
                  <button type="button" className="btn btn-secondary" onClick={() => setShowProjectForm(false)}>Cancel</button>
                </div>
              </form>
            </div>
          </div>
        )}
        {projectSubmitted && (
          <div className="project-success">
            <p>Thank you! Your project request has been submitted.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function BuyInputsPage() {
  return (
    <div className="buy-inputs-page">
      <section className="page-header">
        <h1><FaShoppingCart /> Buy Agri Inputs – Ullavar Mart</h1>
        <div className="phase-badge">Phase 2 – Under Construction</div>
      </section>
      
      <div className="coming-soon">
        <div className="coming-soon-content">
          <h2>Coming Soon!</h2>
          <p>We're building a comprehensive marketplace for all your agricultural input needs.</p>
          <div className="features-preview">
            <div className="feature">
              <FaShoppingCart className="feature-icon" />
              <p>Buy fertilizers, pesticides, motors, tools</p>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <p>Verified brands with farmer reviews</p>
            </div>
            <div className="feature">
              <FaTractor className="feature-icon" />
              <p>Bulk pricing + delivery</p>
            </div>
            <div className="feature">
              <FaCalendarAlt className="feature-icon" />
              <p>AMC-linked auto refill</p>
            </div>
          </div>
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
        <div className="coming-soon-image">
          <img src="https://media.gettyimages.com/id/1318237749/photo/female-farm-worker-using-digital-tablet-with-virtual-reality-artificial-intelligence-for.jpg?s=612x612&w=gi&k=20&c=TB5tXFr1kM7uWWKkHuv8ZtDyd-hDBQnaSvBeTXZ-77A=" alt="Agricultural Supplies" />
        </div>
      </div>
    </div>
  );
}

function SellProducePage() {
  return (
    <div className="sell-produce-page">
      <section className="page-header">
        <h1><MdSell /> Sell My Produce – Ullavar Bazaar</h1>
        <div className="phase-badge">Phase 2 – Under Construction</div>
      </section>
      
      <div className="coming-soon">
        <div className="coming-soon-image">
          <img src="https://img.freepik.com/premium-photo/indian-vegetable-market-seller-with-lush-fresh-produce_1174497-154470.jpg" alt="Farm Fresh Produce" />
        </div>
        <div className="coming-soon-content">
          <h2>Coming Soon!</h2>
          <p>We're creating a marketplace to connect farmers directly with buyers.</p>
          <div className="features-preview">
            <div className="feature">
              <FaImage className="feature-icon" />
              <p>Upload crop photos</p>
            </div>
            <div className="feature">
              <FaHandshake className="feature-icon" />
              <p>Grading & Buyer Matching</p>
            </div>
            <div className="feature">
              <FaClipboardList className="feature-icon" />
              <p>Market Price Comparison</p>
            </div>
            <div className="feature">
              <FaCheckCircle className="feature-icon" />
              <p>Instant Payment Status</p>
            </div>
            <div className="feature">
              <FaFileAlt className="feature-icon" />
              <p>APEDA / FPC / Invoice help</p>
            </div>
          </div>
          <button className="btn btn-primary">Get Notified When Ready</button>
        </div>
      </div>
    </div>
  );
}

function LandPage() {
  const [form, setForm] = useState({
    ownerName: '',
    contact: '',
    location: '',
    latlng: null,
    area: '',
    soilType: '',
    waterSource: '',
    price: '',
    description: '',
    pattaNumber: '',
    landImage: null
  });
  const [submitted, setSubmitted] = useState(false);

  function handleLocation(latlng) {
    setForm(prev => ({ ...prev, latlng }));
  }

  function handleChange(e) {
    const { name, value, files } = e.target;
    if (name === 'landImage') {
      setForm(prev => ({ ...prev, landImage: files[0] }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleSubmit(e) {
    e.preventDefault();
    setSubmitted(true);
    
    // Prepare email data
    const emailData = {
      formType: 'List Your Land for Buy/Sell (Main Page)',
      name: form.owner,
      phone: form.contact,
      message: `Land listing details submitted from main page`,
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
      console.log('Land listing from main page submitted successfully:', data);
    })
    .catch(error => {
      console.error('Error submitting land listing from main page:', error);
    });
  }

  function LocationPicker({ onLocationSelect }) {
    const [marker, setMarker] = useState(null);
    useMapEvents({
      click(e) {
        setMarker(e.latlng);
        onLocationSelect(e.latlng);
      }
    });
    return marker ? <Marker position={marker} /> : null;
  }

  return (
    <div className="land-page">
      <section className="page-header">
        <h1><MdLandscape /> Buy/Sell Land – Ullavar Bhoomi</h1>
      </section>
      <div className="land-form-section" style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',minHeight:'70vh'}}>
        <h2 style={{textAlign:'center',marginBottom:'1em'}}>List Your Land for Buy/Sell</h2>
        <form className="land-form" onSubmit={handleSubmit} style={{maxWidth:'500px',width:'100%',background:'#f9f9f9',padding:'2em',borderRadius:'12px', boxShadow:'0 2px 12px rgba(0,0,0,0.08)'}}>
          <div className="form-group">
            <label>Owner Name</label>
            <input type="text" name="ownerName" value={form.ownerName} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Contact Number</label>
            <input type="tel" name="contact" value={form.contact} onChange={handleChange} required pattern="^[0-9]{10,15}$" />
          </div>
          <div className="form-group">
            <label>Location</label>
            <input type="text" name="location" value={form.location} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Mark Land Location on Map</label>
            <MapContainer center={[11.0168, 76.9558]} zoom={7} style={{ height: '250px', width: '100%', marginBottom: '1em' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker onLocationSelect={handleLocation} />
            </MapContainer>
            {form.latlng && (
              <div style={{fontSize:'0.9em',color:'#388e3c'}}>Selected: Lat {form.latlng.lat}, Lng {form.latlng.lng}</div>
            )}
          </div>
          <div className="form-group">
            <label>Area (in acres)</label>
            <input type="number" name="area" value={form.area} onChange={handleChange} required min="0.1" step="0.01" />
          </div>
          <div className="form-group">
            <label>Soil Type</label>
            <input type="text" name="soilType" value={form.soilType} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Water Source</label>
            <input type="text" name="waterSource" value={form.waterSource} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Expected Price (INR)</label>
            <input type="number" name="price" value={form.price} onChange={handleChange} required min="0" step="1000" />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea name="description" value={form.description} onChange={handleChange} rows="3" placeholder="Any additional details about the land" />
          </div>
          <div className="form-group">
            <label>Patta Number</label>
            <input type="text" name="pattaNumber" value={form.pattaNumber} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Land Image</label>
            <input type="file" name="landImage" accept="image/*" onChange={handleChange} required />
            {form.landImage && <span style={{fontSize:'0.9em',color:'#388e3c'}}>Selected: {form.landImage.name}</span>}
          </div>
          <button type="submit" className="btn btn-primary" style={{width:'100%',marginTop:'1em'}}>Submit</button>
        </form>
        {submitted && (
          <div className="success-message" style={{marginTop:'2em',color:'green',fontWeight:'bold'}}>
            Thank you! Your land details have been submitted.
          </div>
        )}
      </div>
    </div>
  );
}

function ConstructionPage() {

  return (
    <div className="construction-page">
      <section className="page-header">
        <h1><MdOutlineConstruction /> Construction Services</h1>
        <p>Quality infrastructure for your farm with professional teams</p>
      </section>
      
      <section className="construction-intro">
        <div className="intro-content">
          <h2>Farm Infrastructure Experts</h2>
          <p>From water storage to living spaces, we build the facilities your farm needs to thrive.</p>
          <p>All our construction projects come with:</p>
          <ul>
            <li>Detailed planning and estimation</li>
            <li>Quality materials</li>
            <li>Professional construction teams</li>
            <li>Regular progress updates</li>
            <li>Photo documentation</li>
            <li>Transparent billing</li>
          </ul>
          {/* Top Request Quote button removed as requested */}
        </div>
        <div className="intro-image">
          <img src="https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Farm Construction" />
        </div>
      </section>

      
      <section className="construction-services">
        <h2>Our Construction Services</h2>
        <div className="service-cards">
          <div className="service-card">
        <img src={farmhouseImg} alt="Farmhouse" />
        <h3>Farmhouses</h3>
        <p>Elegant farm living with modern comforts.</p>
        <p>Perfect for retreats or permanent residence.</p>
      </div>

      <div className="service-card">
        <img src={poolImg} alt="Swimming Pool" />
        <h3>Swimming Pools</h3>
        <p>Luxury pools designed for relaxation & fun.</p>
        <p>Durable, stylish, and low-maintenance.</p>
      </div>

      <div className="service-card">
        <img src={tankImg} alt="Water Tanks" />
        <h3>Water Tanks</h3>
        <p>Reliable storage for irrigation & livestock.</p>
        <p>Built strong, lasting through all seasons.</p>
      </div>

      <div className="service-card">
        <img src={fencingImg} alt="Fencing" />
        <h3>Fencing</h3>
        <p>Secure & durable fencing solutions.</p>
        <p>Protect crops, livestock, and property.</p>
      </div>

      <div className="service-card">
        <img src={polyhouseImg} alt="Polyhouse" />
        <h3>Polyhouse</h3>
        <p>Climate-controlled farming spaces.</p>
        <p>Boosts yield with advanced technology.</p>
      </div>

      <div className="service-card">
        <img src={shedImg} alt="Cow & Goat Shed" />
        <h3>Cow & Goat Sheds</h3>
        <p>Hygienic, ventilated, and durable shelters.</p>
        <p>Designed for animal comfort & health.</p>
      </div>
        </div>
      </section>
      
      <section className="construction-cta">
        <h2>Ready to Start Your Construction Project?</h2>
        <div className="cta-buttons">
          <Link to="/request-quote" className="btn btn-primary">Request Quote</Link>
          {/* See Past Constructions button removed as requested */}
        </div>
      </section>
      
      <div className="projects-grid">
        {projects.map(project => (
          <div className="gallery-project-card" key={project.id}>
            <div className="project-image">
              <img src={project.image} alt={project.title} />
            </div>
            <div className="project-info">
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              <p className="project-location"><FaMapMarkerAlt /> {project.location}</p>
              <div className="project-rating">
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="star">★</span>
                <span className="rating-text">5.0</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination removed as requested */}
    </div>
  );
}
function JoinUsPage() {
  const [userType, setUserType] = useState('');
  const [formData, setFormData] = useState({
    // Common fields
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    
    // Farmer specific
    farmName: '',
    farmSize: '',
    cropTypes: '',
    farmingExperience: '',
    irrigationType: '',
    currentChallenges: '',
    
    // Worker/Contractor specific
    workerType: '',
    experience: '',
    skills: '',
    vehicleOwned: '',
    availability: '',
    previousWork: '',
    idProof: '',
    expectedSalary: ''
  });

  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Common validations
    if (!formData.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone number is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.state.trim()) newErrors.state = 'State is required';
    if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
    
    // Email validation
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    // Phone validation
    if (formData.phone && !/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    if (userType === 'farmer') {
      if (!formData.farmName.trim()) newErrors.farmName = 'Farm name is required';
      if (!formData.farmSize.trim()) newErrors.farmSize = 'Farm size is required';
      if (!formData.cropTypes.trim()) newErrors.cropTypes = 'Crop types are required';
      if (!formData.farmingExperience.trim()) newErrors.farmingExperience = 'Farming experience is required';
    } else if (userType === 'worker') {
      if (!formData.workerType.trim()) newErrors.workerType = 'Worker type is required';
      if (!formData.experience.trim()) newErrors.experience = 'Experience is required';
      if (!formData.skills.trim()) newErrors.skills = 'Skills are required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      // Prepare email data
      const emailData = {
        formType: userType === 'farmer' ? 'Register as Farmer' : 'Register as Worker/Contractor',
        name: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        message: `New ${userType} registration`,
        extra: {
          'User Type': userType,
          'Full Name': formData.fullName,
          'Email': formData.email,
          'Phone': formData.phone,
          'Address': formData.address,
          'City': formData.city,
          'State': formData.state,
          'Pincode': formData.pincode,
          ...(userType === 'farmer' && {
            'Farm Name': formData.farmName,
            'Farm Size': formData.farmSize,
            'Crop Types': formData.cropTypes,
            'Farming Experience': formData.farmingExperience,
            'Irrigation Type': formData.irrigationType,
            'Current Challenges': formData.currentChallenges
          }),
          ...(userType === 'worker' && {
            'Worker Type': formData.workerType,
            'Experience': formData.experience,
            'Skills': formData.skills,
            'Vehicle Owned': formData.vehicleOwned,
            'Availability': formData.availability,
            'Previous Work': formData.previousWork,
            'Expected Salary': formData.expectedSalary
          })
        }
      };

      // Send email
      fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailData)
      }).then(res => res.json()).then(emailResult => {
        console.log('Registration email sent:', emailResult);
      }).catch(err => {
        console.error('Failed to send registration email:', err);
      });

      // Send data to local storage
      fetch('/api/store-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: `${userType}-registration`,
          data: { userType, ...formData }
        })
      }).then(res => res.json()).then(result => {
        console.log('Registration data stored locally:', result);
        alert(`Registration submitted successfully for ${userType}! Your information has been saved.`);
        resetForm();
      }).catch(err => {
        console.error('Failed to store registration data:', err);
        alert('Registration submitted, but there was an issue saving your data. Please try again.');
      });
    }
  };

  const resetForm = () => {
    setUserType('');
    setFormData({
      fullName: '', email: '', phone: '', address: '', city: '', state: '', pincode: '',
      farmName: '', farmSize: '', cropTypes: '', farmingExperience: '', irrigationType: '', currentChallenges: '',
      workerType: '', experience: '', skills: '', vehicleOwned: '', availability: '', previousWork: '', idProof: '', expectedSalary: ''
    });
    setErrors({});
  };

  if (!userType) {
    return (
      <div className="join-us-page">
        <section className="page-header">
          <h1><FaUserFriends /> Join Ullavar Connect</h1>
          <p>Choose your registration type to get started</p>
        </section>
        
        <div className="join-sections">
          <div className="join-section farmers">
            <div className="join-content" style={{ textAlign: 'center' }}>
              <h2 style={{ textAlign: 'center' }}><FaSeedling /> Register as Farmer</h2>
              <p style={{ textAlign: 'center' }}>Connect with agricultural services and grow your farming business</p>
              <ul style={{ display: 'inline-block', textAlign: 'left', margin: '20px auto' }}>
                <li>Get customized farming solutions</li>
                <li>Access to modern agricultural techniques</li>
                <li>Direct connection with service providers</li>
                <li>Track progress via app or WhatsApp</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setUserType('farmer')}
                >
                  Register as Farmer
                </button>
              </div>
            </div>
            <div className="join-image">
              <img src="https://media.istockphoto.com/id/1330214199/photo/indian-farmer-busy-using-mobile-phone-while-sitting-in-between-the-crop-seedlings-inside.jpg?s=612x612&w=0&k=20&c=PmGOwjZlQdOhETmjVwBoT4thL3mJn3VfEm5q9doj4aU=" alt="Farmer Using App" />
            </div>
          </div>
          
          <div className="join-section workers">
            <div className="join-image">
              <img src="https://pub-b47a7c74540d40228598178154fb4b56.r2.dev/2023/10/Azure-OpenAI-Service-India-blog-hero.jpg" alt="Farm Workers" />
            </div>
            <div className="join-content" style={{ textAlign: 'center' }}>
              <h2 style={{ textAlign: 'center' }}><FaTools /> Register as Worker/Contractor</h2>
              <p style={{ textAlign: 'center' }}>Join our network of skilled agricultural professionals</p>
              <ul style={{ display: 'inline-block', textAlign: 'left', margin: '20px auto' }}>
                <li>Weekly payments for completed work</li>
                <li>Performance-based job opportunities</li>
                <li>Training and skill development</li>
                <li>Flexible working arrangements</li>
              </ul>
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%' }}>
                <button 
                  className="btn btn-primary" 
                  onClick={() => setUserType('worker')}
                >
                  Register as Worker/Contractor
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="join-us-page">
      <section className="page-header">
        <h1>
          {userType === 'farmer' ? <FaSeedling /> : <FaTools />}
          {userType === 'farmer' ? 'Farmer Registration' : 'Worker/Contractor Registration'}
        </h1>
        <p>Please fill out all required information</p>
        <button 
          onClick={resetForm}
          style={{
            background: 'none',
            border: '1px solid #ccc',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          ← Change Registration Type
        </button>
      </section>

      <div className="join-sections">
        <div className="join-section" style={{flexDirection: 'column', maxWidth: '800px', margin: '0 auto'}}>
          <div className="registration-form">
            
            {/* Personal Information Section */}
            <div className="form-section">
              <h3><FaUser /> Personal Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="fullName">Full Name *</label>
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className={errors.fullName ? 'error' : ''}
                    placeholder="Enter your full name"
                  />
                  {errors.fullName && <span className="error-message">{errors.fullName}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email Address *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className={errors.email ? 'error' : ''}
                    placeholder="Enter your email"
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="phone">Phone Number *</label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className={errors.phone ? 'error' : ''}
                    placeholder="10-digit mobile number"
                    maxLength="10"
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="pincode">Pincode *</label>
                  <input
                    type="text"
                    id="pincode"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    className={errors.pincode ? 'error' : ''}
                    placeholder="Enter pincode"
                    maxLength="6"
                  />
                  {errors.pincode && <span className="error-message">{errors.pincode}</span>}
                </div>
              </div>
            </div>

            {/* Address Information Section */}
            <div className="form-section">
              <h3><FaMapMarkerAlt /> Address Information</h3>
              <div className="form-group">
                <label htmlFor="address">Full Address *</label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={errors.address ? 'error' : ''}
                  placeholder="Enter your complete address"
                  rows="3"
                />
                {errors.address && <span className="error-message">{errors.address}</span>}
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="city">City *</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    className={errors.city ? 'error' : ''}
                    placeholder="Enter city"
                  />
                  {errors.city && <span className="error-message">{errors.city}</span>}
                </div>
                <div className="form-group">
                  <label htmlFor="state">State *</label>
                  <select
                    id="state"
                    name="state"
                    value={formData.state}
                    onChange={handleInputChange}
                    className={errors.state ? 'error' : ''}
                  >
                    <option value="">Select State</option>
                    <option value="Tamil Nadu">Tamil Nadu</option>
                    <option value="Karnataka">Karnataka</option>
                    <option value="Kerala">Kerala</option>
                    <option value="Andhra Pradesh">Andhra Pradesh</option>
                    <option value="Telangana">Telangana</option>
                    <option value="Other">Other</option>
                  </select>
                  {errors.state && <span className="error-message">{errors.state}</span>}
                </div>
              </div>
            </div>

            {/* Farmer Specific Fields */}
            {userType === 'farmer' && (
              <div className="form-section">
                <h3><FaSeedling /> Farm Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="farmName">Farm Name *</label>
                    <input
                      type="text"
                      id="farmName"
                      name="farmName"
                      value={formData.farmName}
                      onChange={handleInputChange}
                      className={errors.farmName ? 'error' : ''}
                      placeholder="Enter your farm name"
                    />
                    {errors.farmName && <span className="error-message">{errors.farmName}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="farmSize">Farm Size (in acres) *</label>
                    <input
                      type="text"
                      id="farmSize"
                      name="farmSize"
                      value={formData.farmSize}
                      onChange={handleInputChange}
                      className={errors.farmSize ? 'error' : ''}
                      placeholder="e.g., 5 acres"
                    />
                    {errors.farmSize && <span className="error-message">{errors.farmSize}</span>}
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="cropTypes">Primary Crops *</label>
                    <input
                      type="text"
                      id="cropTypes"
                      name="cropTypes"
                      value={formData.cropTypes}
                      onChange={handleInputChange}
                      className={errors.cropTypes ? 'error' : ''}
                      placeholder="e.g., Empty, Coconut, Mango"
                    />
                    {errors.cropTypes && <span className="error-message">{errors.cropTypes}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="farmingExperience">Farming Experience *</label>
                    <select
                      id="farmingExperience"
                      name="farmingExperience"
                      value={formData.farmingExperience}
                      onChange={handleInputChange}
                      className={errors.farmingExperience ? 'error' : ''}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-2 years">0-2 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="6-10 years">6-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.farmingExperience && <span className="error-message">{errors.farmingExperience}</span>}
                  </div>
                </div>
                
                
                
                <div className="form-group">
                  <label htmlFor="currentChallenges">Current Farming Challenges</label>
                  <textarea
                    id="currentChallenges"
                    name="currentChallenges"
                    value={formData.currentChallenges}
                    onChange={handleInputChange}
                    placeholder="Describe any current challenges you face in farming"
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Worker/Contractor Specific Fields */}
            {userType === 'worker' && (
              <div className="form-section">
                <h3><FaTools /> Professional Information</h3>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="workerType">Worker Type *</label>
                    <select
                      id="workerType"
                      name="workerType"
                      value={formData.workerType}
                      onChange={handleInputChange}
                      className={errors.workerType ? 'error' : ''}
                    >
                      <option value="">Select Worker Type</option>
                      <option value="Sprayer">Sprayer</option>
                      <option value="Fencer">Fencer</option>
                      <option value="Driver">Driver</option>
                      <option value="Tractor Operator">Tractor Operator</option>
                      <option value="Harvesting Contractor">Harvesting Contractor</option>
                      <option value="General Farm Worker">General Farm Worker</option>
                      <option value="Irrigation Specialist">Irrigation Specialist</option>
                      <option value="Other">Other</option>
                    </select>
                    {errors.workerType && <span className="error-message">{errors.workerType}</span>}
                  </div>
                  <div className="form-group">
                    <label htmlFor="experience">Experience *</label>
                    <select
                      id="experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleInputChange}
                      className={errors.experience ? 'error' : ''}
                    >
                      <option value="">Select Experience</option>
                      <option value="0-1 years">0-1 years</option>
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                    {errors.experience && <span className="error-message">{errors.experience}</span>}
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="skills">Skills & Expertise *</label>
                  <textarea
                    id="skills"
                    name="skills"
                    value={formData.skills}
                    onChange={handleInputChange}
                    className={errors.skills ? 'error' : ''}
                    placeholder="Describe your skills and areas of expertise"
                    rows="3"
                  />
                  {errors.skills && <span className="error-message">{errors.skills}</span>}
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="vehicleOwned">Vehicle Owned</label>
                    <select
                      id="vehicleOwned"
                      name="vehicleOwned"
                      value={formData.vehicleOwned}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Vehicle</option>
                      <option value="Four Wheeler">Four Wheeler</option>
                      <option value="Tractor">Tractor</option>
                      <option value="None">None</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label htmlFor="availability">Availability</label>
                    <select
                      id="availability"
                      name="availability"
                      value={formData.availability}
                      onChange={handleInputChange}
                    >
                      <option value="">Select Availability</option>
                      <option value="Full Time">Full Time</option>
                      <option value="Part Time">Part Time</option>
                      <option value="Seasonal">Seasonal</option>
                      <option value="Weekend Only">Weekend Only</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="expectedSalary">Expected Daily Rate (₹)</label>
                    <input
                      type="number"
                      id="expectedSalary"
                      name="expectedSalary"
                      value={formData.expectedSalary}
                      onChange={handleInputChange}
                      placeholder="Enter expected daily rate"
                      min="0"
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="idProof">ID Proof Type</label>
                    <select
                      id="idProof"
                      name="idProof"
                      value={formData.idProof}
                      onChange={handleInputChange}
                    >
                      <option value="">Select ID Proof</option>
                      <option value="Aadhaar Card">Aadhaar Card</option>
                      <option value="Driving License">Driving License</option>
                      <option value="Voter ID">Voter ID</option>
                      <option value="PAN Card">PAN Card</option>
                      <option value="Passport">Passport</option>
                    </select>
                  </div>
                </div>
                
                <div className="form-group">
                  <label htmlFor="previousWork">Previous Work Experience</label>
                  <textarea
                    id="previousWork"
                    name="previousWork"
                    value={formData.previousWork}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="form-section">
              <button type="button" onClick={handleSubmit} className="btn btn-primary" style={{width: '100%', padding: '15px', fontSize: '18px'}}>
                {userType === 'farmer' ? 'Register My Farm' : 'Apply as Partner'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;