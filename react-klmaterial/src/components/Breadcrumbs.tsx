import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Breadcrumbs.css';

interface BreadcrumbItem {
  label: string;
  path: string;
}

const Breadcrumbs: React.FC = () => {
  const location = useLocation();
  
  const pathMap: Record<string, string> = {
    '': 'Home',
    'materials': 'Materials',
    'roadmap': 'Roadmap',
    'about': 'About',
    'contact': 'Contact',
  };

  const generateBreadcrumbs = (): BreadcrumbItem[] => {
    const paths = location.pathname.split('/').filter(Boolean);
    const breadcrumbs: BreadcrumbItem[] = [{ label: 'Home', path: '/' }];

    const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
    const stripExtension = (s: string) => s.replace(/\.[^/.]+$/, '');

    let currentPath = '';
    paths.forEach((raw) => {
      // ignore repo base folder if present
      if (raw === 'klmaterial') return;

      // remove filename extensions (index.html -> index)
      const pathSegment = stripExtension(raw);

      // Skip index (we already show Home)
      if (pathSegment.toLowerCase() === 'index') return;

      currentPath += `/${pathSegment}`;
      const label = pathMap[pathSegment] || capitalize(pathSegment);

      breadcrumbs.push({
        label,
        path: currentPath,
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = generateBreadcrumbs();

  if (breadcrumbs.length <= 1) {
    return null;
  }

  return (
    <nav className="breadcrumbs" aria-label="Breadcrumb">
      <ol className="breadcrumbs-list">
        {breadcrumbs.map((crumb, index) => (
          <li key={crumb.path} className="breadcrumb-item">
            {index < breadcrumbs.length - 1 ? (
              <>
                <Link to={crumb.path} className="breadcrumb-link">
                  {crumb.label}
                </Link>
                <span className="breadcrumb-separator" aria-hidden="true">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 12L10 8L6 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </span>
              </>
            ) : (
              <span className="breadcrumb-current" aria-current="page">
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;
