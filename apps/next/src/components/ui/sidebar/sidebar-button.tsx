import { Button } from "../shadcn/button"
import { ChevronRight } from "lucide-react";
import Link from "next/link";

/**
 * Props for the {@link SidebarButton} component.
 */
interface SidebarButtonProps {
  /**
   * The icon component to display on the left side of the button.
   * Should be a React component type, e.g., a Lucide icon.
   */
  Icon: React.ElementType;
  /**
   * The text label for the button.
   */
  title: string;
  /**
   * The URL or path the button should navigate to when clicked.
   * If `deactivated` is true, this link will be disabled.
   */
  href: string;
  /**
   * Optional. If true, the button will be styled as deactivated
   * and will not navigate to the `href`.
   */
  deactivated?: boolean;
}

/**
 * Renders a button used within the sidebar for navigation.
 * It includes an icon, a title, and a chevron to indicate navigation.
 * The button can be deactivated.
 *
 * @param {SidebarButtonProps} props - The properties for the sidebar button.
 * @returns {JSX.Element} The rendered sidebar button component.
 */
export default function SidebarButton({ Icon, title, href, deactivated }: SidebarButtonProps): JSX.Element {
  return (
    <Button variant={deactivated ? "deactivated" : "ghost"} className="justify-between [&_svg]:size-5" asChild>
      <Link href={deactivated ? "#" : href}>
        <div className="flex gap-3 items-center">
          <Icon className="stroke-1" />
          <span className="text-md">{title}</span>
        </div>
        <ChevronRight className="stroke-1" />
      </Link>
    </Button>
  );
}
