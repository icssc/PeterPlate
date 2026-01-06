/**
 * Props for the {@link SidebarDivider} component.
 */
interface SidebarDividerProps {
  /**
   * The title text to display for the divider.
   */
  title: string;
}

/**
 * Renders a styled text divider, typically used in a sidebar to group related navigation items.
 * @param {SidebarDividerProps} props - The properties for the sidebar divider.
 * @returns {JSX.Element} A span element styled as a section divider with a title.
 */
export default function SidebarDivider({
  title,
}: SidebarDividerProps): JSX.Element {
  return <span className="text-sm text-zinc-600 mt-4">{title}</span>;
}
