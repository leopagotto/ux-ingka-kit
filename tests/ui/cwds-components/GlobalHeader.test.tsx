import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  GlobalHeader,
  GlobalHeaderProps,
} from "../../../templates/cwds-components/GlobalHeader";

describe("GlobalHeader Component", () => {
  const defaultProps: GlobalHeaderProps = {
    appName: "Test Application",
    userName: "John Doe",
    userRole: "Developer",
  };

  describe("Rendering", () => {
    it("should render the component with required props", () => {
      render(<GlobalHeader {...defaultProps} />);
      expect(screen.getByText("Test Application")).toBeInTheDocument();
    });

    it("should display user name when provided", () => {
      render(<GlobalHeader {...defaultProps} />);
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    it("should display user role when provided", () => {
      render(<GlobalHeader {...defaultProps} />);
      expect(screen.getByText("Developer")).toBeInTheDocument();
    });

    it("should render without optional props", () => {
      render(<GlobalHeader appName="Minimal App" />);
      expect(screen.getByText("Minimal App")).toBeInTheDocument();
    });
  });

  describe("Search Feature", () => {
    it("should show search icon when showSearch is true", () => {
      render(<GlobalHeader {...defaultProps} showSearch={true} />);
      const searchButton = screen.getByRole("button", { name: /search/i });
      expect(searchButton).toBeInTheDocument();
    });

    it("should hide search icon when showSearch is false", () => {
      render(<GlobalHeader {...defaultProps} showSearch={false} />);
      const searchButton = screen.queryByRole("button", { name: /search/i });
      expect(searchButton).not.toBeInTheDocument();
    });

    it("should call onSearchClick when search icon is clicked", () => {
      const onSearchClick = jest.fn();
      render(
        <GlobalHeader
          {...defaultProps}
          showSearch={true}
          onSearchClick={onSearchClick}
        />
      );

      const searchButton = screen.getByRole("button", { name: /search/i });
      fireEvent.click(searchButton);

      expect(onSearchClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Notifications Feature", () => {
    it("should show notifications icon when showNotifications is true", () => {
      render(<GlobalHeader {...defaultProps} showNotifications={true} />);
      const notificationButton = screen.getByRole("button", {
        name: /notification/i,
      });
      expect(notificationButton).toBeInTheDocument();
    });

    it("should hide notifications icon when showNotifications is false", () => {
      render(<GlobalHeader {...defaultProps} showNotifications={false} />);
      const notificationButton = screen.queryByRole("button", {
        name: /notification/i,
      });
      expect(notificationButton).not.toBeInTheDocument();
    });

    it("should display notification count badge", () => {
      render(
        <GlobalHeader
          {...defaultProps}
          showNotifications={true}
          notificationCount={5}
        />
      );
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display 99+ for notification counts over 99", () => {
      render(
        <GlobalHeader
          {...defaultProps}
          showNotifications={true}
          notificationCount={150}
        />
      );
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should call onNotificationClick when notifications icon is clicked", () => {
      const onNotificationClick = jest.fn();
      render(
        <GlobalHeader
          {...defaultProps}
          showNotifications={true}
          onNotificationClick={onNotificationClick}
        />
      );

      const notificationButton = screen.getByRole("button", {
        name: /notification/i,
      });
      fireEvent.click(notificationButton);

      expect(onNotificationClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Profile Feature", () => {
    it("should show profile avatar when showProfile is true", () => {
      render(<GlobalHeader {...defaultProps} showProfile={true} />);
      const profileButton = screen.getByRole("button", { name: /profile/i });
      expect(profileButton).toBeInTheDocument();
    });

    it("should hide profile avatar when showProfile is false", () => {
      render(<GlobalHeader {...defaultProps} showProfile={false} />);
      const profileButton = screen.queryByRole("button", { name: /profile/i });
      expect(profileButton).not.toBeInTheDocument();
    });

    it("should call onProfileClick when profile is clicked", () => {
      const onProfileClick = jest.fn();
      render(
        <GlobalHeader
          {...defaultProps}
          showProfile={true}
          onProfileClick={onProfileClick}
        />
      );

      const profileButton = screen.getByRole("button", { name: /profile/i });
      fireEvent.click(profileButton);

      expect(onProfileClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("App Switcher Feature", () => {
    it("should show app switcher when showAppSwitcher is true", () => {
      render(<GlobalHeader {...defaultProps} showAppSwitcher={true} />);
      const appSwitcherButton = screen.getByRole("button", {
        name: /app switcher/i,
      });
      expect(appSwitcherButton).toBeInTheDocument();
    });

    it("should hide app switcher when showAppSwitcher is false", () => {
      render(<GlobalHeader {...defaultProps} showAppSwitcher={false} />);
      const appSwitcherButton = screen.queryByRole("button", {
        name: /app switcher/i,
      });
      expect(appSwitcherButton).not.toBeInTheDocument();
    });

    it("should call onAppSwitcherClick when app switcher is clicked", () => {
      const onAppSwitcherClick = jest.fn();
      render(
        <GlobalHeader
          {...defaultProps}
          showAppSwitcher={true}
          onAppSwitcherClick={onAppSwitcherClick}
        />
      );

      const appSwitcherButton = screen.getByRole("button", {
        name: /app switcher/i,
      });
      fireEvent.click(appSwitcherButton);

      expect(onAppSwitcherClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("Menu Feature", () => {
    it("should call onMenuClick when menu button is clicked", () => {
      const onMenuClick = jest.fn();
      render(<GlobalHeader {...defaultProps} onMenuClick={onMenuClick} />);

      const menuButton = screen.getByRole("button", { name: /menu/i });
      fireEvent.click(menuButton);

      expect(onMenuClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("TypeScript Interface", () => {
    it("should accept valid GlobalHeaderProps", () => {
      const validProps: GlobalHeaderProps = {
        appName: "Valid App",
        userName: "Test User",
        userRole: "Tester",
        notificationCount: 10,
        showSearch: true,
        showNotifications: true,
        showProfile: true,
        showAppSwitcher: true,
        onMenuClick: jest.fn(),
        onSearchClick: jest.fn(),
        onNotificationClick: jest.fn(),
        onProfileClick: jest.fn(),
        onAppSwitcherClick: jest.fn(),
      };

      render(<GlobalHeader {...validProps} />);
      expect(screen.getByText("Valid App")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA labels for buttons", () => {
      render(
        <GlobalHeader
          {...defaultProps}
          showSearch={true}
          showNotifications={true}
          showProfile={true}
          showAppSwitcher={true}
        />
      );

      expect(screen.getByRole("button", { name: /menu/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /search/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /notification/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /profile/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /app switcher/i })
      ).toBeInTheDocument();
    });
  });
});
