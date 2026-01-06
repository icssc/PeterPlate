// queries.ts
//
// This file contains the literals of various queries we've found useful on the
// endpoint, as well as the endpiont and the headers.

export const graphQLEndpoint: string =
  "https://api.elevate-dxp.com/api/mesh/c087f756-cc72-4649-a36f-3a41b700c519/graphql?";

export const graphQLHeaders = {
  "User-Agent":
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:141.0) Gecko/20100101 Firefox/141.0",
  Referer: "https://uci.mydininghub.com/",
  "content-type": "application/json",
  store: "ch_uci_en",
  "magento-store-code": "ch_uci",
  "magento-website-code": "ch_uci",
  "magento-store-view-code": "ch_uci_en",
  "x-api-key": "ElevateAPIProd",
  Origin: "https://uci.mydininghub.com",
};

export const getLocationQuery = `
query getLocation(
  $locationUrlKey: String!
  $sortOrder: Commerce_SortOrderEnum
) {
  getLocation(campusUrlKey: "campus", locationUrlKey: $locationUrlKey) {
    commerceAttributes {
      maxMenusDate
      children {
        id
        uid
        name
        position
      }
    }
    aemAttributes {
      hoursOfOperation {
        schedule
      }
      name
    }
  }
  Commerce_mealPeriods(sort_order: $sortOrder) {
    name
    id
    position
  }
  Commerce_attributesList(entityType: CATALOG_PRODUCT) {
    items {
      code
      options {
        value
        label
      }
    }
  }
}
`;
export type GetLocationQueryVariables = {
  locationUrlKey: "brandywine" | "the-anteatery";
  sortOrder: "ASC" | "DESC";
};

export const AEMEventListQuery = `
query AEM_eventList($filter: AEM_EventModelFilter) {
  AEM_eventList(filter: $filter) {
    items {
      title
      subtitle
      description {
        markdown
      }
      startDate
      endDate
      startTime
      endTime
    }
  }
}
`;
export type AEMEventListQueryVariables = {
  campus: {
    _expressions: {
      _operator: "EQUALS" | "EQUALS_NOT";
      value: "campus";
    };
  };
  location: {
    name: {
      _expressions: {
        _operator: "EQUALS" | "EQUALS_NOT";
        value: "The Anteatery" | "Brandywine";
      };
    };
  };
};

export type AEMEventListQueryRestaurant =
  AEMEventListQueryVariables["location"]["name"]["_expressions"]["value"];

export const GetLocationRecipesDailyQuery = `
query getLocationRecipes(
  $locationUrlKey: String!
  $date: String!
  $mealPeriod: Int
  $viewType: Commerce_MenuViewType!
) {
  getLocationRecipes(
    campusUrlKey: "campus"
    locationUrlKey: $locationUrlKey
    date: $date
    mealPeriod: $mealPeriod
    viewType: $viewType
  ) {
    locationRecipesMap {
      stationSkuMap {
        id
        skus
      }
    }
    products {
      items {
        sku
        name
        images {
          url
        }
        attributes {
          name
          value
        }
      }
    }
  }
}
`;
export type GetLocationRecipesDailyVariables = {
  date: string;
  locationUrlKey: "brandywine" | "the-anteatery";
  mealPeriod: number | null;
  viewType: "DAILY";
};

export const GetLocationRecipesWeeklyQuery = `
query getLocationRecipes(
  $locationUrlKey: String!
  $date: String!
  $mealPeriod: Int
  $viewType: Commerce_MenuViewType!
) {
  getLocationRecipes(
    campusUrlKey: "campus"
    locationUrlKey: $locationUrlKey
    date: $date
    mealPeriod: $mealPeriod
    viewType: $viewType
  ) {
    locationRecipesMap {
      dateSkuMap {
        date
        stations {
          id
          skus {
            simple
          }
        }
      }
    }
    products {
      items {
        sku
        name
        images {
          url
        }
        attributes {
          name
          value
        }
      }
    }
  }
}
`;
export type GetLocationRecipesWeeklyVariables = {
  date: string;
  locationUrlKey: "brandywine" | "the-anteatery";
  mealPeriod: number | null;
  viewType: "WEEKLY";
};
