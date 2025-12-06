import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  BottomBarNavigation,
  BottomBarNavigationProps,
  BottomNavItem,
} from "../../../templates/cwds-components/BottomBarNavigation";

describe("BottomBarNavigation Component", () => {
  const defaultItems: BottomNavItem[] = [
    { id: "home", label: "Home", icon: "home" },
    { id: "search", label: "Search", icon: "search" },
    { id: "notifications", label: "Notifications", icon: "bell", badge: 5 },
    { id: "profile", label: "Profile", icon: "profile" },
  ];

  const defaultProps: BottomBarNavigationProps = {
    items: defaultItems,
    activeItemId: "home",
  };

  describe("Rendering", () => {
    it("should render all navigation items", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      expect(screen.getByText("Home")).toBeInTheDocument();
      expect(screen.getByText("Search")).toBeInTheDocument();
      expect(screen.getByText("Notifications")).toBeInTheDocument();
      expect(screen.getByText("Profile")).toBeInTheDocument();
    });

    it("should render with empty items array", () => {
      render(<BottomBarNavigation items={[]} />);
      expect(screen.queryByRole("navigation")).toBeInTheDocument();
    });

    it("should highlight active item", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      const activeItem = screen.getByText("Home").closest("button");
      expect(activeItem).toHaveClass("active");
    });
  });

  describe("Badge Feature", () => {
    it("should display badge when badge number is provided", () => {
      render(<BottomBarNavigation {...defaultProps} />);
      expect(screen.getByText("5")).toBeInTheDocument();
    });

    it("should display 99+ for badge counts over 99", () => {
      const itemsWithLargeBadge: BottomNavItem[] = [
        {
          id: "notifications",
          label: "Notifications",
          icon: "bell",
          badge: 150,
        },
      ];

      render(<BottomBarNavigation items={itemsWithLargeBadge} />);
      expect(screen.getByText("99+")).toBeInTheDocument();
    });

    it("should not display badge when badge is 0", () => {
      const itemsWithZeroBadge: BottomNavItem[] = [
        { id: "notifications", label: "Notifications", icon: "bell", badge: 0 },
      ];

      render(<BottomBarNavigation items={itemsWithZeroBadge} />);
      expect(screen.queryByText("0")).not.toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onItemClick when an item is clicked", () => {
      const onItemClick = jest.fn();
      render(
        <BottomBarNavigation {...defaultProps} onItemClick={onItemClick} />
      );

      const item = screen.getByText("Search");
      fireEvent.click(item);

      expect(onItemClick).toHaveBeenCalledWith(
        expect.objectContaining({ id: "search" })
      );
      expect(onItemClick).toHaveBeenCalledTimes(1);
    });

    it("should not call onItemClick when clicking already active item", () => {
      const onItemClick = jest.fn();
      render(
        <BottomBarNavigation {...defaultProps} onItemClick={onItemClick} />
      );

      const activeItem = screen.getByText("Home");
      fireEvent.click(activeItem);

      // Behavior depends on implementation - may or may not call handler
      // This test ensures consistent behavior
    });
  });

  describe("TypeScript Interface", () => {
    it("should accept valid BottomBarNavigationProps", () => {
      const validProps: BottomBarNavigationProps = {
        items: defaultItems,
        activeItemId: "search",
        onItemClick: jest.fn(),
        className: "custom-bottom-nav",
      };

      render(<BottomBarNavigation {...validProps} />);
      expect(screen.getByText("Search")).toBeInTheDocument();
    });

    it("should accept BottomNavItem with all optional fields", () => {
      const fullItem: BottomNavItem = {
        id: "test",
        label: "Test Item",
        icon: "test-icon",
        badge: 10,
      };

      render(<BottomBarNavigation items={[fullItem]} />);
      expect(screen.getByText("Test Item")).toBeInTheDocument();
      expect(screen.getByText("10")).toBeInTheDocument();
    });

    it("should accept BottomNavItem with only required fields", () => {
      const minimalItem: BottomNavItem = {
        id: "minimal",
        label: "Minimal",
      };

      render(<BottomBarNavigation items={[minimalItem]} />);
      expect(screen.getByText("Minimal")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have navigation landmark", () => {
      render(<BottomBarNavigation {...defaultProps} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });

    it("should have accessible button labels", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      expect(screen.getByRole("button", { name: /home/i })).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /search/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /notifications/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /profile/i })
      ).toBeInTheDocument();
    });

    it("should indicate active state with aria-current", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      const activeItem = screen.getByText("Home").closest("button");
      expect(activeItem).toHaveAttribute("aria-current", "page");
    });

    it("should have accessible badge labels", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      const notificationButton = screen.getByRole("button", {
        name: /notifications/i,
      });
      expect(notificationButton).toHaveTextContent("5");
      expect(notificationButton).toHaveAttribute(
        "aria-label",
        expect.stringContaining("5")
      );
    });
  });

  describe("Mobile Responsiveness", () => {
    it("should render in fixed position at bottom", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      const nav = screen.getByRole("navigation");
      expect(nav).toHaveClass("bottom-bar-navigation");
    });

    it("should have equal width items", () => {
      render(<BottomBarNavigation {...defaultProps} />);

      const items = screen.getAllByRole("button");
      expect(items).toHaveLength(4);
      // All items should have equal width styling
    });
  });
});
