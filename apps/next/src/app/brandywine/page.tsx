import { RestaurantPage } from "@/components/restaurant-page";
import { HallEnum } from "@/utils/types";

export default function BrandywinePage(): React.JSX.Element {
  return <RestaurantPage hall={HallEnum.BRANDYWINE} />;
}
