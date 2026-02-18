import { RestaurantPage } from "@/components/ui/restaurant/restaurant-page";
import { HallEnum } from "@/utils/types";

export default function AnteateryPage(): React.JSX.Element {
  return <RestaurantPage hall={HallEnum.ANTEATERY} />;
}
