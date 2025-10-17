import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import fencingImg from './assert/fencing.jpg';
import mango from './assert/Mango AMC.jpg';
import water from './assert/Water Tank Construction.jpg';
import drip from './assert/Drip Irrigation.webp';
import coconut from './assert/Coconut Plantation.jpg';
import farm from './assert/Farm Shed Construction.jpg';

const projects = [
  {
    id: 1,
    title: "Fencing Project",
    description: "2.5 Acres – Done in 3 Days",
    location: "Erode",
    image: fencingImg,
    category: "fencing"
  },
  { 
    id: 2,
    title: "Mango AMC",
    description: "600 Trees – April Cycle",
    location: "Salem",
    image: mango,
    category: "amc"
  },
  {
    id: 3,
    title: "Water Tank Construction",
    description: "15,000 Litre – Built in 7 Days",
    location: "Coimbatore",
    image: water,
    category: "construction"
  },
  {
    id: 4,
    title: "Drip Irrigation Setup",
    description: "5 Acres – Completed in 5 Days",
    location: "Madurai",
    image: drip,
    category: "irrigation"
  },
  {
    id: 5,
    title: "Coconut Plantation",
    description: "200 Trees – Planted in 2 Days",
    location: "Tirupur",
    image: coconut,
    category: "planting"
  },
  {
    id: 6,
    title: "Farm Shed Construction",
    description: "1000 sq.ft – Built in 15 Days",
    location: "Pollachi",
    image: farm,
    category: "construction"
  }
];

export default function ProjectsPage() {
  return (
    <div className="projects-page">
      <section className="page-header">
        <h1>Past Projects</h1>
        <p>See some of our completed work for farmers</p>
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
    </div>
  );
}
