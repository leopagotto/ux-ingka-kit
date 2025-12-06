import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  AppSwitcher,
  AppSwitcherProps,
  App,
} from "../../../templates/cwds-components/AppSwitcher";

describe("AppSwitcher Component", () => {
  const defaultApps: App[] = [
    { id: "wms", name: "Warehouse Management", icon: "warehouse", url: "/wms" },
    {
      id: "pos",
      name: "Point of Sale",
      icon: "pos",
      url: "/pos",
      description: "POS System",
    },
    { id: "inv", name: "Inventory", icon: "inventory", url: "/inventory" },
  ];

  const defaultProps: AppSwitcherProps = {
    isOpen: true,
    apps: defaultApps,
  };

  describe("Rendering", () => {
    it("should render when isOpen is true", () => {
      render(<AppSwitcher {...defaultProps} />);
      expect(screen.getByText("Warehouse Management")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      render(<AppSwitcher {...defaultProps} isOpen={false} />);
      expect(
        screen.queryByText("Warehouse Management")
      ).not.toBeInTheDocument();
    });

    it("should render all apps", () => {
      render(<AppSwitcher {...defaultProps} />);

      expect(screen.getByText("Warehouse Management")).toBeInTheDocument();
      expect(screen.getByText("Point of Sale")).toBeInTheDocument();
      expect(screen.getByText("Inventory")).toBeInTheDocument();
    });

    it("should render app descriptions when provided", () => {
      render(<AppSwitcher {...defaultProps} />);
      expect(screen.getByText("POS System")).toBeInTheDocument();
    });

    it("should render with empty apps array", () => {
      render(<AppSwitcher isOpen={true} apps={[]} />);
      // Should show empty state
      expect(screen.getByText(/no applications/i)).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onAppClick when an app is clicked", () => {
      const onAppClick = jest.fn();
      render(<AppSwitcher {...defaultProps} onAppClick={onAppClick} />);

      const app = screen.getByText("Point of Sale");
      fireEvent.click(app);

      expect(onAppClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "pos" })
      );
      expect(onAppClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when close button is clicked", () => {
      const onClose = jest.fn();
      render(<AppSwitcher {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when clicking outside the modal", () => {
      const onClose = jest.fn();
      render(<AppSwitcher {...defaultProps} onClose={onClose} />);

      const overlay = screen.getByTestId("app-switcher-overlay");
      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should not close when clicking inside the modal content", () => {
      const onClose = jest.fn();
      render(<AppSwitcher {...defaultProps} onClose={onClose} />);

      const modalContent = screen.getByText("Warehouse Management");
      fireEvent.click(modalContent);

      expect(onClose).not.toHaveBeenCalled();
    });
  });

  describe("TypeScript Interface", () => {
    it("should accept valid AppSwitcherProps", () => {
      const validProps: AppSwitcherProps = {
        isOpen: true,
        apps: defaultApps,
        onAppClick: jest.fn(),
        onClose: jest.fn(),
        className: "custom-switcher",
      };

      render(<AppSwitcher {...validProps} />);
      expect(screen.getByText("Warehouse Management")).toBeInTheDocument();
    });

    it("should accept App with all optional fields", () => {
      const fullApp: App = {
        id: "test",
        name: "Test App",
        icon: "test-icon",
        url: "/test",
        description: "Test Description",
      };

      render(<AppSwitcher isOpen={true} apps={[fullApp]} />);
      expect(screen.getByText("Test App")).toBeInTheDocument();
      expect(screen.getByText("Test Description")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role for modal", () => {
      render(<AppSwitcher {...defaultProps} />);
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    it("should have close button with accessible label", () => {
      render(<AppSwitcher {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });

    it("should trap focus inside modal when open", () => {
      render(<AppSwitcher {...defaultProps} />);
      const modal = screen.getByRole("dialog");
      expect(modal).toHaveAttribute("aria-modal", "true");
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close modal when Escape key is pressed", () => {
      const onClose = jest.fn();
      render(<AppSwitcher {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
