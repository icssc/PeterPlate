function formatMealDividerTitle(title: string): string {
  return title
    .toLowerCase()
    .split(" ")
    .map((word) => {
      return word
        .split("/")
        .map((subWord) => subWord.charAt(0).toUpperCase() + subWord.slice(1))
        .join("/");
    })
    .join(" ");
}

/**
 * Renders a prominent divider with a title, typically used to separate
 * different meal categories or sections in a list of food items.
 * @param {object} props - The properties for the meal divider.
 * @param {string} props.title - The title text to display for the meal section.
 *                               This will be rendered as a large heading above a horizontal rule.
 * @returns {JSX.Element} A div element containing a heading and a bottom border.
 */
export default function MealDivider({ title }: { title: string }): JSX.Element {
  return (
    <div className="border-b-2">
      <h1 className="font-bold text-3xl">{formatMealDividerTitle(title)}</h1>
    </div>
  );
}
