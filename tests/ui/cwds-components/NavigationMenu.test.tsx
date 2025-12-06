import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import {
  NavigationMenu,
  NavigationMenuProps,
  NavigationMenuItem,
} from "../../../templates/cwds-components/NavigationMenu";

describe("NavigationMenu Component", () => {
  const defaultItems: NavigationMenuItem[] = [
    { id: "1", label: "Dashboard", icon: "home", href: "/dashboard" },
    { id: "2", label: "Reports", icon: "document", href: "/reports" },
    { id: "3", label: "Settings", icon: "gear", href: "/settings" },
  ];

  const defaultProps: NavigationMenuProps = {
    items: defaultItems,
    activeItemId: "1",
  };

  describe("Rendering", () => {
    it("should render all navigation items", () => {
      render(<NavigationMenu {...defaultProps} />);

      expect(screen.getByText("Dashboard")).toBeInTheDocument();
      expect(screen.getByText("Reports")).toBeInTheDocument();
      expect(screen.getByText("Settings")).toBeInTheDocument();
    });

    it("should render with empty items array", () => {
      render(<NavigationMenu items={[]} />);
      expect(screen.queryByRole("navigation")).toBeInTheDocument();
    });

    it("should highlight active item", () => {
      render(<NavigationMenu {...defaultProps} />);

      const activeItem = screen.getByText("Dashboard").closest("a");
      expect(activeItem).toHaveClass("active");
    });
  });

  describe("Navigation Items", () => {
    it("should render items with children (nested menus)", () => {
      const itemsWithChildren: NavigationMenuItem[] = [
        {
          id: "1",
          label: "Admin",
          children: [
            { id: "1-1", label: "Users", href: "/admin/users" },
            { id: "1-2", label: "Roles", href: "/admin/roles" },
          ],
        },
      ];

      render(<NavigationMenu items={itemsWithChildren} />);
      expect(screen.getByText("Admin")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onItemClick when an item is clicked", () => {
      const onItemClick = jest.fn();
      render(<NavigationMenu {...defaultProps} onItemClick={onItemClick} />);

      const item = screen.getByText("Reports");
      fireEvent.click(item);

      expect(onItemClick).toHaveBeenCalledTimes(1);
    });
  });

  describe("TypeScript Interface", () => {
    it("should accept valid NavigationMenuProps", () => {
      const validProps: NavigationMenuProps = {
        items: defaultItems,
        activeItemId: "2",
        onItemClick: jest.fn(),
        className: "custom-nav",
      };

      render(<NavigationMenu {...validProps} />);
      expect(screen.getByText("Reports")).toBeInTheDocument();
    });

    it("should accept NavigationMenuItem with all optional fields", () => {
      const fullItem: NavigationMenuItem = {
        id: "1",
        label: "Test",
        icon: "test-icon",
        href: "/test",
        children: [{ id: "1-1", label: "Sub Item", href: "/test/sub" }],
      };

      render(<NavigationMenu items={[fullItem]} />);
      expect(screen.getByText("Test")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have navigation landmark", () => {
      render(<NavigationMenu {...defaultProps} />);
      expect(screen.getByRole("navigation")).toBeInTheDocument();
    });
  });
});
