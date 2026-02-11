"use client";

import {
  createContext,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
  useContext,
  useState,
} from "react";

/**
 * Defines the shape of the context data for managing the selected date.
 */
interface DateContextType {
  /**
   * The currently selected date.
   * It can be `undefined` if no date is selected or if the selection has been cleared.
   */
  selectedDate: Date | undefined;
  /**
   * A function to update the `selectedDate`.
   * This is the setter function obtained from `useState`.
   */
  setSelectedDate: Dispatch<SetStateAction<Date | undefined>>;
}

/**
 * React Context for managing the application's currently selected date.
 * This context provides the `selectedDate` and a function `setSelectedDate` to update it.
 * It is initialized with `undefined`, and consumers must ensure they are within a `DateProvider`.
 */
const DateContext = createContext<DateContextType | undefined>(undefined);

/**
 * Props for the `DateProvider` component.
 */
interface DateProviderProps {
  /**
   * The child components that will have access to the date context.
   */
  children: ReactNode;
}

/**
 * Provides the `DateContext` to its children components.
 * It initializes the `selectedDate` state with the current date and makes it,
 * along with the `setSelectedDate` function, available through the context.
 * @param {DateProviderProps} props - The props for the component.
 * @returns {JSX.Element} The provider component wrapping its children.
 */
export function DateProvider({ children }: DateProviderProps): JSX.Element {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date(),
  );

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
}

/**
 * Custom hook to access the `DateContext`.
 * This hook simplifies the process of consuming the `selectedDate` and `setSelectedDate`
 * from the context.
 *
 * @throws {Error} If used outside of a `DateProvider`, an error is thrown to indicate
 *                 that the context is not available.
 * @returns {DateContextType} The date context value, including `selectedDate` and `setSelectedDate`.
 */
export function useDate(): DateContextType {
  const context = useContext(DateContext);
  if (context === undefined) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
}
