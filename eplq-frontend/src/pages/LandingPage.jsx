import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-base-200 flex flex-col">
      {/* Hero Section */}
      <section className="pt-28 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Secure Location Queries with{' '}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              EPLQ
            </span>
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 text-base-content/80">
            Privacy-First Spatial Search System for Secure Point-of-Interest Discovery
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/login"
              className="btn btn-primary px-8 py-3 text-lg rounded-xl shadow-md hover:scale-105 transition-transform"
            >
              Get Started <span className="ml-2">→</span>
            </Link>
            <Link
              to="/register"
              className="btn btn-outline btn-primary px-8 py-3 text-lg rounded-xl hover:scale-105 transition-transform"
            >
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 md:px-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="card bg-base-100 shadow-md hover:shadow-lg transition-shadow duration-200 border border-base-300"
            >
              <div className="card-body items-center text-center">
                <div className="text-5xl mb-4">{feature.icon}</div>
                <h3 className="card-title text-2xl mb-2">{feature.title}</h3>
                <p className="text-base text-base-content/80">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Tech Stack Section */}
      <section className="py-20 bg-base-100 px-4 md:px-8">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-12">Modern Tech Stack</h2>
          <div className="flex flex-wrap justify-center gap-4">
            {techs.map((tech, index) => (
              <TechCard key={index} name={tech.name} color={tech.color} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral text-neutral-content py-8 px-4">
        <div className="container mx-auto text-center">
          <p className="mb-4">© 2024 EPLQ System. All rights reserved.</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <a href="#privacy" className="link link-hover">
              Privacy Policy
            </a>
            <a href="#terms" className="link link-hover">
              Terms of Service
            </a>
            <a href="#contact" className="link link-hover">
              Contact
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};

// TechCard Component
const TechCard = ({ name, color }) => (
  <div className={`badge badge-outline ${color} px-6 py-4 text-lg rounded-xl shadow-sm`}>
    {name}
  </div>
);

// Feature List
const features = [
  {
    icon: '🛡️',
    title: 'Military-Grade Encryption',
    description: 'All location data encrypted using AES-256 with secure key management',
  },
  {
    icon: '🔒',
    title: 'Privacy Preservation',
    description: 'Zero-knowledge queries that never expose user locations',
  },
  {
    icon: '🗺️',
    title: 'Spatial Efficiency',
    description: 'Geohash-based indexing for fast radius queries with 1km precision',
  },
];

// Tech List
const techs = [
  { name: 'React', color: 'text-primary' },
  { name: 'Node.js', color: 'text-secondary' },
  { name: 'MongoDB', color: 'text-accent' },
  { name: 'JWT', color: 'text-neutral' },
  { name: 'AES-256', color: 'text-info' },
  { name: 'Geohash', color: 'text-success' },
];

export default LandingPage;
