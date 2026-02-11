import { cva, type VariantProps } from "class-variance-authority";
import type * as React from "react";
import { toTitleCase } from "@/utils/funcs";

import { cn } from "@/utils/tw";

/**
 * Defines the visual variants for the {@link AllergenBadge} component using `class-variance-authority`.
 * Includes base styles and specific styles for different dietary/allergen types.
 *
 * @property {object} variants - Defines the different visual styles for the badge.
 * @property {string} variants.variant.default - Default badge style.
 * @property {string} variants.variant.vegetarian - Style for vegetarian badges.
 * @property {string} variants.variant.vegan - Style for vegan badges.
 * @property {string} variants.variant.gluten_free - Style for gluten-free badges.
 * @property {string} variants.variant.kosher - Style for kosher badges.
 */
const badgeVariants = cva(
  "inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 border-transparent shadow",
  {
    variants: {
      variant: {
        default: "bg-primary hover:bg-primary/80 text-primary-foreground",
        vegetarian:
          "bg-emerald-700 hover:bg-emerald-700/80 text-primary-foreground",
        vegan: "bg-lime-700 hover:bg-lime-700/80 text-primary-foreground",
        gluten_free:
          "bg-orange-700 hover:bg-orange-700/80 text-primary-foreground",
        kosher: "bg-sky-700 hover:bg-sky-700/80 text-primary-foreground",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

/**
 * Props for the {@link AllergenBadge} component.
 * Extends standard HTML div attributes and CVA variant props.
 */
export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

/**
 * Renders a styled badge to indicate an allergen or dietary preference (e.g., Vegetarian, Vegan, Gluten-Free).
 * The style and text of the badge are determined by the `variant` prop.
 *
 * @param {BadgeProps} props - The properties for the AllergenBadge.
 * @param {string} [props.className] - Optional additional CSS classes to apply to the badge.
 * @param {("default" | "vegetarian" | "vegan" | "gluten_free" | "kosher")} [props.variant="default"] - The type of badge to render, determining its style and text content.
 *        The text displayed is the title-cased version of the variant name (e.g., "vegetarian" becomes "Vegetarian").
 * @returns {JSX.Element} The rendered allergen badge component.
 */
function AllergenBadge({
  className,
  variant,
  ...props
}: BadgeProps): JSX.Element {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props}>
      {toTitleCase(variant?.replace("_", "-") ?? "default")}
    </div>
  );
}

export { AllergenBadge, badgeVariants };
