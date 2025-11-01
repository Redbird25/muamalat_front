import React, {useEffect, useMemo, useRef, useState} from 'react';
import {Outlet, useLocation} from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const MasterLayout = () => {
  const [isSidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();
  const previousOverflow = useRef('');

  const layoutClassName = useMemo(() => {
    const classes = ['master-layout'];
    if (isSidebarCollapsed) {
      classes.push('master-layout--collapsed');
    }
    if (isMobileSidebarOpen) {
      classes.push('master-layout--mobile-open');
    }
    return classes.join(' ');
  }, [isSidebarCollapsed, isMobileSidebarOpen]);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const media = window.matchMedia('(max-width: 1024px)');
    const handleChange = (event) => {
      if (event.matches) {
        setSidebarCollapsed(false);
      } else {
        setMobileSidebarOpen(false);
      }
    };

    handleChange(media);
    if (media.addEventListener) {
      media.addEventListener('change', handleChange);
    } else {
      media.addListener(handleChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', handleChange);
      } else {
        media.removeListener(handleChange);
      }
    };
  }, []);

  useEffect(() => {
    if (!isMobileSidebarOpen) {
      document.body.style.overflow = previousOverflow.current || '';
      previousOverflow.current = '';
      return;
    }

    previousOverflow.current = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = previousOverflow.current || '';
      previousOverflow.current = '';
    };
  }, [isMobileSidebarOpen]);

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  const toggleSidebarCollapsed = () => {
    setSidebarCollapsed(prev => !prev);
  };

  const toggleMobileSidebar = () => {
    setMobileSidebarOpen(prev => !prev);
  };

  const closeMobileSidebar = () => {
    setMobileSidebarOpen(false);
  };

  return (
    <div className={layoutClassName}>
      <Sidebar
        collapsed={isSidebarCollapsed}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={closeMobileSidebar}
      />
      {isMobileSidebarOpen ? (
        <button
          type="button"
          className="master-layout__overlay"
          aria-label="Закрыть меню"
          onClick={closeMobileSidebar}
        />
      ) : null}
      <div className="master-layout__main">
        <Topbar
          onToggleSidebar={toggleSidebarCollapsed}
          onToggleSidebarMobile={toggleMobileSidebar}
          isSidebarCollapsed={isSidebarCollapsed}
          isMobileSidebarOpen={isMobileSidebarOpen}
        />
        <div className="master-layout__content">
          <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default MasterLayout;
