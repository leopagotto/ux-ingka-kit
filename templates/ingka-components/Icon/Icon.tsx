import React, { useEffect, useState } from "react";

/**
 * Icon Component
 *
 * Displays IKEA Skapa icons from the Icons directory.
 * 600+ official IKEA design system icons available.
 *
 * @see https://npm.m2.blue.cdtapps.com/@ingka/ssr-icon
 */

export interface IconProps {
  /** Icon name (matches SVG filename without .svg extension) */
  name: string;

  /** Icon size */
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;

  /** Icon color (uses currentColor by default to inherit from parent) */
  color?: string;

  /** Additional CSS classes */
  className?: string;

  /** Accessible label for screen readers */
  "aria-label"?: string;

  /** Whether icon is decorative (hides from screen readers) */
  decorative?: boolean;
}

const sizeMap = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
};

/**
 * Icon component that renders IKEA Skapa SVG icons
 * Loads SVG icons from public/Icons/ folder
 */
export const Icon: React.FC<IconProps> = ({
  name,
  size = "md",
  color = "currentColor",
  className = "",
  "aria-label": ariaLabel,
  decorative = false,
}) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [error, setError] = useState<boolean>(false);

  // Get numeric size
  const numericSize = typeof size === "string" ? sizeMap[size] : size;

  // Load SVG content
  useEffect(() => {
    const loadSvg = async () => {
      try {
        const response = await fetch(`/Icons/${name}.svg`);
        if (!response.ok) throw new Error("Icon not found");
        const text = await response.text();
        setSvgContent(text);
        setError(false);
      } catch (e) {
        console.warn(`Icon "${name}" not found`);
        setError(true);
      }
    };
    loadSvg();
  }, [name]);

  // Accessibility attributes
  const ariaAttributes = decorative
    ? { "aria-hidden": true, role: "presentation" as const }
    : { "aria-label": ariaLabel || name, role: "img" as const };

  // Show placeholder or error state
  if (error) {
    return (
      <span
        className={`inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded ${className}`}
        style={{ width: numericSize, height: numericSize, color }}
        title={`Icon "${name}" not found`}
        {...ariaAttributes}
      >
        ?
      </span>
    );
  }

  // Loading state
  if (!svgContent) {
    return (
      <span
        className={`inline-block bg-gray-100 rounded animate-pulse ${className}`}
        style={{ width: numericSize, height: numericSize }}
      />
    );
  }

  // Render the SVG with proper styling
  return (
    <span
      className={`inline-flex items-center justify-center ${className}`}
      style={{ width: numericSize, height: numericSize, color }}
      {...ariaAttributes}
      dangerouslySetInnerHTML={{
        __html: svgContent
          .replace(/width="[^"]*"/, `width="${numericSize}"`)
          .replace(/height="[^"]*"/, `height="${numericSize}"`)
          .replace(/fill="[^"]*"/g, 'fill="currentColor"'),
      }}
    />
  );
};

/**
 * Common icon name constants for type safety
 */
export const IconNames = {
  // Actions
  ADD: "plus",
  REMOVE: "minus",
  CLOSE: "cross",
  CHECK: "checkmark",
  EDIT: "pencil",
  DELETE: "trash-can",
  SEARCH: "magnifying-glass",

  // Arrows
  ARROW_UP: "arrow-up",
  ARROW_DOWN: "arrow-down",
  ARROW_LEFT: "arrow-left",
  ARROW_RIGHT: "arrow-right",
  CHEVRON_UP: "chevron-up",
  CHEVRON_DOWN: "chevron-down",
  CHEVRON_LEFT: "chevron-left",
  CHEVRON_RIGHT: "chevron-right",

  // Navigation
  HOME: "home",
  MENU: "menu",
  LINK: "link",
  LINK_OUT: "link-out",

  // Status
  INFO: "information-circle",
  WARNING: "warning-triangle",
  ERROR: "cross-circle",
  SUCCESS: "checkmark-circle",

  // Media
  IMAGE: "image",
  VIDEO: "video",
  CAMERA: "camera",

  // Shopping
  CART: "shopping-bag",
  HEART: "heart",
  HEART_FILLED: "heart-filled",
  GIFT: "gift-box",

  // User
  PERSON: "person",
  PEOPLE: "people",

  // Communication
  MAIL: "mail",
  PHONE: "phone",
  CHAT: "chat",
  BELL: "bell",

  // Files
  DOCUMENT: "document",
  FOLDER: "folder",
  DOWNLOAD: "arrow-cloud-out",
  UPLOAD: "arrow-cloud-in",

  // Settings
  GEAR: "gear",
  FILTER: "filters",

  // Visibility
  SHOW: "visibility-show",
  HIDE: "visibility-hide",
} as const;

export type IconName = (typeof IconNames)[keyof typeof IconNames];
