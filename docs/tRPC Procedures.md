
Taking a look inside the `./packages/api/src` folder we find something like this:

```
📂packages/src  
 ┣ 📂dishes  
 ┣ 📂events  
 ┣ 📂menus    
 ┣ 📂periods  
 ┣ 📂ratings  
 ┣ 📂restaurants  
 ┣ 📂stations
 ┣ 📂users
 ...
```

Each folder corresponds to a set of tRPC procedures that handles one major feature.

Within each subfolder, we find 2-4 `.ts` files that looks something like this:

```
📂dishes  
 ┣ 📜router.test.ts  
 ┣ 📜router.ts  
 ┣ 📜services.test.ts  
 ┗ 📜services.ts
```

- The `router.ts` file contains tRPC procedures that exported via the tRPC router.
- The `services.ts` file contains helper functions that are used in the tRPC procedures mentioned above
- The files with extension `.test.ts` contain tests that run when running `turbo test`. See ***creating tests*** for more information.
- For our tRPC functions, we use Zod to define and validate schemas for input variables at runtime.

We will now go into detail about each individual tRPC procedure.

## Dishes

#### Procedures

`dish/get` (`getDishProcedure`)
	Queries the `dishes` table for a dish
- Input: `string` (dishId)

`dish/rate` (`RateDishProcedure`)
	Updates the rating of a given dish when users submit a rating
- Input: `RatingSchema`
#### Services

`upsertDish`
	Attempts to inserts one dish entry into the `dishes` table, along with its `NutritionInfo` and `DietRestrictions`. Upon conflict with `dishes.id`, the old entry is updated with new info.
- Input: `DishWithRelations`
- Returns upserted dish on success

`upsertDishToMenu`
	Attempts to inserts a relation in the `dishesToMenu` table. Upon conflict with (`dishesId`, `menusId`) the old relation is updated.
- Input: `DishToMenu`
## Events

#### Procedures

`event/upcoming`
	Queries the `events` table for all events that are happening today or later.
- Input: None
#### Services

`upsertEvent`
	Attempts to inserts one event entry into the `events` table. Upon conflict with (`events.title`, `events.start`, `events.restaurantId`), the old entry is updated with new info.
- Input: `Event`

`upsertEvents`
	Attempts to insert multiple events into the `events` table. Upon conflict old entries are updated.
- Input: `DishToMenu`
- Returns list of successfully upserted events
## Menus

#### Services

`upsertMenu`
	Attempts to inserts one menu entry into the `menus` table. Upon conflict with `menus.id`, the old entry is updated with new info.
- Input: `Menu`

## Periods

#### Services

`upsertPeriod`
	Attempts to inserts one period entry into the `periods` table. Upon conflict with `periods.id`, the old entry is updated with new info.
- Input: `Period`

## Ratings

#### Services

`upsertRatings`
	Attempts to inserts one rating entry into the `ratings` table. Upon conflict with (`ratings.userId`, `ratings.dishId`), the old entry is updated with new info.
- Input: `Rating`

## Restaurants

#### Services

`upsertRestaurant`
	Attempts to inserts one restaurant entry into the `restaurants` table. Upon conflict with `restaurants.id`, the old entry is updated with new info.
- Input: `Restaurant`

`getRestaurantsByDate`
	Queries the database for information on both restaurants corresponding to a given date.
- Input: `Date`
- Returns: `PeterPlateData`
## Stations

#### Services

`upsertStation`
	Attempts to inserts one station entry into the `stations` table. Upon conflict with `stations.id`, the old entry is updated with new info.
- Input: `Station`

## Users

#### Services

`getUser`
	Queries the `users` table for a user along with their ratings and pins
- Input: `string` (userId)
- Returns: {`User`, `Pin[]`, `Rating[]`}

`upsertUser`
	Attempts to inserts one user entry into the `users` table. Upon conflict with `users.id`, the old entry is updated with new info.
- Input: `User`

You may also notice there is `api/src/server` subfolder in this directory. This subfolder contains components relating the the Lambda serverless functions this app performs (see Serverless Functions)
