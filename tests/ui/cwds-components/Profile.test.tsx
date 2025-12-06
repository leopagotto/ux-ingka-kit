import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { Profile, ProfileProps } from "../../../templates/cwds-components/Profile";

describe("Profile Component", () => {
  const defaultProps: ProfileProps = {
    isOpen: true,
    userName: "Bill Lau",
    userRole: "Reverse Flow Specialist",
    userDepartment: "ILOFulfill Department, Amsterdam",
    userEmail: "bill.lau@ikea.com",
  };

  describe("Rendering", () => {
    it("should render when isOpen is true", () => {
      render(<Profile {...defaultProps} />);
      expect(screen.getByText("Bill Lau")).toBeInTheDocument();
    });

    it("should not render when isOpen is false", () => {
      render(<Profile {...defaultProps} isOpen={false} />);
      expect(screen.queryByText("Bill Lau")).not.toBeInTheDocument();
    });

    it("should display user name (required)", () => {
      render(<Profile {...defaultProps} />);
      expect(screen.getByText("Bill Lau")).toBeInTheDocument();
    });

    it("should display user role when provided", () => {
      render(<Profile {...defaultProps} />);
      expect(screen.getByText("Reverse Flow Specialist")).toBeInTheDocument();
    });

    it("should display user department when provided", () => {
      render(<Profile {...defaultProps} />);
      expect(
        screen.getByText("ILOFulfill Department, Amsterdam")
      ).toBeInTheDocument();
    });

    it("should display user email when provided", () => {
      render(<Profile {...defaultProps} />);
      expect(screen.getByText("bill.lau@ikea.com")).toBeInTheDocument();
    });

    it("should render without optional fields", () => {
      render(<Profile isOpen={true} userName="Jane Doe" />);
      expect(screen.getByText("Jane Doe")).toBeInTheDocument();
    });
  });

  describe("Interactions", () => {
    it("should call onSignOut when sign out button is clicked", () => {
      const onSignOut = jest.fn();
      render(<Profile {...defaultProps} onSignOut={onSignOut} />);

      const signOutButton = screen.getByRole("button", { name: /sign out/i });
      fireEvent.click(signOutButton);

      expect(onSignOut).toHaveBeenCalledTimes(1);
    });

    it("should call onSettingsClick when settings button is clicked", () => {
      const onSettingsClick = jest.fn();
      render(<Profile {...defaultProps} onSettingsClick={onSettingsClick} />);

      const settingsButton = screen.getByRole("button", { name: /settings/i });
      fireEvent.click(settingsButton);

      expect(onSettingsClick).toHaveBeenCalledTimes(1);
    });

    it("should call onProfileClick when profile link is clicked", () => {
      const onProfileClick = jest.fn();
      render(<Profile {...defaultProps} onProfileClick={onProfileClick} />);

      const profileLink = screen.getByRole("button", { name: /view profile/i });
      fireEvent.click(profileLink);

      expect(onProfileClick).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when close button is clicked", () => {
      const onClose = jest.fn();
      render(<Profile {...defaultProps} onClose={onClose} />);

      const closeButton = screen.getByRole("button", { name: /close/i });
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalledTimes(1);
    });

    it("should call onClose when clicking outside the dropdown", () => {
      const onClose = jest.fn();
      render(<Profile {...defaultProps} onClose={onClose} />);

      const overlay = screen.getByTestId("profile-overlay");
      fireEvent.click(overlay);

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("TypeScript Interface", () => {
    it("should accept valid ProfileProps with all fields", () => {
      const validProps: ProfileProps = {
        isOpen: true,
        userName: "Test User",
        userRole: "Tester",
        userDepartment: "QA Department",
        userEmail: "test@ikea.com",
        onSignOut: jest.fn(),
        onSettingsClick: jest.fn(),
        onProfileClick: jest.fn(),
        onClose: jest.fn(),
        className: "custom-profile",
      };

      render(<Profile {...validProps} />);
      expect(screen.getByText("Test User")).toBeInTheDocument();
    });

    it("should accept ProfileProps with only required fields", () => {
      const minimalProps: ProfileProps = {
        isOpen: true,
        userName: "Minimal User",
      };

      render(<Profile {...minimalProps} />);
      expect(screen.getByText("Minimal User")).toBeInTheDocument();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA role for dropdown", () => {
      render(<Profile {...defaultProps} />);
      expect(screen.getByRole("menu")).toBeInTheDocument();
    });

    it("should have accessible labels for action buttons", () => {
      render(
        <Profile
          {...defaultProps}
          onSignOut={jest.fn()}
          onSettingsClick={jest.fn()}
        />
      );

      expect(
        screen.getByRole("button", { name: /sign out/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /settings/i })
      ).toBeInTheDocument();
    });

    it("should have close button with accessible label", () => {
      render(<Profile {...defaultProps} />);
      expect(
        screen.getByRole("button", { name: /close/i })
      ).toBeInTheDocument();
    });
  });

  describe("Keyboard Navigation", () => {
    it("should close dropdown when Escape key is pressed", () => {
      const onClose = jest.fn();
      render(<Profile {...defaultProps} onClose={onClose} />);

      fireEvent.keyDown(document, { key: "Escape", code: "Escape" });

      expect(onClose).toHaveBeenCalledTimes(1);
    });
  });
});
