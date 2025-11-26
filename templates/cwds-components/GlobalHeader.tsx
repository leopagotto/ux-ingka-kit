import React from 'react';
import './styles/cwds-tokens.css';

/**
 * CWDS Global Header Component
 *
 * Design Source: Figma - Ingka Co-worker Design Components
 * Node: 301:142
 *
 * This component uses @ingka/* UI primitives to implement the CWDS Global Header specification.
 * The Global Header is the main navigation bar that appears at the top of all internal IKEA applications.
 *
 * @example
 * <GlobalHeader
 *   appName="Warehouse Management"
 *   showSearch={true}
 *   showNotifications={true}
 *   showProfile={true}
 *   showAppSwitcher={true}
 *   userName="Bill Lau"
 *   userRole="Reverse Flow Specialist"
 *   notificationCount={3}
 *   onMenuClick={() => console.log('Menu clicked')}
 *   onSearchClick={() => console.log('Search clicked')}
 *   onNotificationClick={() => console.log('Notifications clicked')}
 *   onProfileClick={() => console.log('Profile clicked')}
 *   onAppSwitcherClick={() => console.log('App switcher clicked')}
 * />
 */

export interface GlobalHeaderProps {
  /** Application name displayed in the header */
  appName: string;

  /** User's display name */
  userName?: string;

  /** User's role/title */
  userRole?: string;

  /** Number of unread notifications (0-99+) */
  notificationCount?: number;

  /** Show/hide search icon */
  showSearch?: boolean;

  /** Show/hide notifications icon */
  showNotifications?: boolean;

  /** Show/hide user profile avatar */
  showProfile?: boolean;

  /** Show/hide app switcher icon */
  showAppSwitcher?: boolean;

  /** Callback when menu/hamburger icon is clicked */
  onMenuClick?: () => void;

  /** Callback when search icon is clicked */
  onSearchClick?: () => void;

  /** Callback when notification icon is clicked */
  onNotificationClick?: () => void;

  /** Callback when profile avatar is clicked */
  onProfileClick?: () => void;

  /** Callback when app switcher icon is clicked */
  onAppSwitcherClick?: () => void;

  /** Custom CSS class name */
  className?: string;
}

export const GlobalHeader: React.FC<GlobalHeaderProps> = ({
  appName,
  userName = 'User',
  userRole,
  notificationCount = 0,
  showSearch = true,
  showNotifications = true,
  showProfile = true,
  showAppSwitcher = true,
  onMenuClick,
  onSearchClick,
  onNotificationClick,
  onProfileClick,
  onAppSwitcherClick,
  className = ''
}) => {
  // Get user initials for avatar
  const getUserInitials = (name: string): string => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header
      className={`cwds-global-header ${className}`}
      role="banner"
      aria-label="Co-Worker Application Header"
      style={{
        backgroundColor: '#003E72',  // CWDS Primary Color (mandatory)
        color: '#FFFFFF',
        borderBottom: 'none',
        height: '64px',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        gap: '16px',
        position: 'fixed',  // Fixed position at top (CWDS spec)
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000
      }}
    >
      {/* Left Section: Menu + App Name */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <button
          onClick={onMenuClick}
          aria-label="Menu"
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF'
          }}
        >
          {/* Menu Icon - Replace with @ingka/icon when available */}
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M3 6h18M3 12h18M3 18h18" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
          </svg>
        </button>

        <h1 style={{
          fontSize: '16px',
          fontWeight: 700,
          color: '#FFFFFF',
          margin: 0
        }}>
          {appName}
        </h1>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Right Section: Icons */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {showSearch && (
          <button
            onClick={onSearchClick}
            aria-label="Search"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            {/* Search Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="11" cy="11" r="7" stroke="#FFFFFF" strokeWidth="2"/>
              <path d="M20 20l-4-4" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        )}

        {showNotifications && (
          <button
            onClick={onNotificationClick}
            aria-label="Notifications"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              color: '#FFFFFF'
            }}
          >
            {/* Bell Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 0 1-3.46 0" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            {notificationCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '4px',
                right: '4px',
                backgroundColor: '#E00751',
                color: '#FFFFFF',
                fontSize: '10px',
                fontWeight: 700,
                borderRadius: '999px',
                minWidth: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 4px'
              }}>
                {notificationCount > 99 ? '99+' : notificationCount}
              </span>
            )}
          </button>
        )}

        {showProfile && (
          <button
            onClick={onProfileClick}
            aria-label="Profile"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            {/* Avatar */}
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '50%',
              backgroundColor: '#FFFFFF',
              color: '#003E72',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: 700
            }}>
              {getUserInitials(userName)}
            </div>
          </button>
        )}

        {showAppSwitcher && (
          <button
            onClick={onAppSwitcherClick}
            aria-label="App Switcher"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#FFFFFF'
            }}
          >
            {/* App Grid Icon */}
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <rect x="4" y="4" width="6" height="6" rx="1" fill="#FFFFFF"/>
              <rect x="14" y="4" width="6" height="6" rx="1" fill="#FFFFFF"/>
              <rect x="4" y="14" width="6" height="6" rx="1" fill="#FFFFFF"/>
              <rect x="14" y="14" width="6" height="6" rx="1" fill="#FFFFFF"/>
            </svg>
          </button>
        )}
      </div>
    </header>
  );
};

export default GlobalHeader;
