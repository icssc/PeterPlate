# PeterPlate

<pre style="color: green;">
 ███████████            █████                       ███████████  ████             █████
▒▒███▒▒▒▒▒███          ▒▒███                       ▒▒███▒▒▒▒▒███▒▒███            ▒▒███
 ▒███    ▒███  ██████  ███████    ██████  ████████  ▒███    ▒███ ▒███   ██████   ███████    ██████
 ▒██████████  ███▒▒███▒▒▒███▒    ███▒▒███▒▒███▒▒███ ▒██████████  ▒███  ▒▒▒▒▒███ ▒▒▒███▒    ███▒▒███
 ▒███▒▒▒▒▒▒  ▒███████   ▒███    ▒███████  ▒███ ▒▒▒  ▒███▒▒▒▒▒▒   ▒███   ███████   ▒███    ▒███████
 ▒███        ▒███▒▒▒    ▒███ ███▒███▒▒▒   ▒███      ▒███         ▒███  ███▒▒███   ▒███ ███▒███▒▒▒
 █████       ▒▒██████   ▒▒█████ ▒▒██████  █████     █████        █████▒▒████████  ▒▒█████ ▒▒██████
▒▒▒▒▒         ▒▒▒▒▒▒     ▒▒▒▒▒   ▒▒▒▒▒▒  ▒▒▒▒▒     ▒▒▒▒▒        ▒▒▒▒▒  ▒▒▒▒▒▒▒▒    ▒▒▒▒▒   ▒▒▒▒▒▒
</pre>

[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/icssc/PeterPlate)
[![Production](https://github.com/icssc/PeterPlate/actions/workflows/deploy-prod.yml/badge.svg)](https://github.com/icssc/PeterPlate/actions/workflows/deploy-prod.yml)
## About

Navigating UCI's dining options at Brandywine and the Anteatery is now simpler and more informed with PeterPlate. This comprehensive menu viewer, available as a website and mobile app, is designed to enhance your campus dining experience. UCI students use PeterPlate to plan their daily meals and track progress toward their nutritional goals.

Key features of PeterPlate include:

- **_Detailed Menu Viewer_**: Browse current and upcoming menus, allowing you
  to strategically plan your meal swipes and never miss your favorite dishes.
- **_Allergen and Dietary Information_**: Make informed choices with easy
  access to comprehensive ingredient and allergen details for every meal.
- **_Event Calendar_**: Stay updated on special dining hall events and limited-time offerings.
- **_Dish Ratings_**: Contribute your own feedback to help fellow Anteaters discover the best of campus dining.

![A screenshot of the PeterPlate website homepage.](./peterplate-screenshot.jpg)

## Technology

PeterPlate consists of a Next.JS frontend with a shared backend. A summary of the libraries used in each are listed below.

### Frontend

- [Next.js](https://nextjs.org) - Full-stack React framework used for the website.
- [shad/cn](https://ui.shadcn.com/) - A library of fully customizable, plug-n-play components for use with React.
- [Zustand](https://github.com/pmndrs/zustand) - State management library for React apps.

### Backend

- [Drizzle](https://drizzle.dev/) - ORM for Postgres.
- [AWS](https://aws.amazon.com/) - RDS and Lambda.
- [Serverless Framework](https://www.serverless.com/) - Framework for cloud resources such as AWS Lambda.
- [tRPC](https://trpc.io/) - Typesafe remote procedure calls to access the underlying Postgres database.

### Tooling

- [Turborepo](https://turborepo.com) - High-performance build system for monorepo scaling.
- [Tailwind](https://tailwindcss.com) - A utility-first CSS framework.
- [TypeScript](https://www.typescriptlang.org) - JavaScript with type-checking.

### Schema ER Diagram

```mermaid
erDiagram
   push_tokens {
      token text
   }

   favorites {
      user_id text
      dish_id text
      restaurant restaurant_id_enum
      created_at timestamp
      updated_at timestamp
   }

   ratings {
      user_id text PK,FK
      dish_id text PK,FK
      restaurant restaurant_id_enum
      rating real
      created_at timestamp
      updated_at timestamp
   }

   dishes {
      id text PK
      num_ratings integer
      total_rating integer
      created_at timestamp
      updated_at timestamp
   }

   users {
      id text PK
      name text
      email text
      emailVerified boolean
      hasOnboarded boolean
      image text
      created_at timestamp
      updated_at timestamp
   }

   diet_restrictions {
      dish_id text PK,FK
      contains_eggs boolean
      contains_fish boolean
      contains_milk boolean
      contains_peanuts boolean
      contains_sesame boolean
      contains_shellfish boolean
      contains_soy boolean
      contains_tree_nuts boolean
      contains_wheat boolean
      is_gluten_free boolean
      is_halal boolean
      is_kosher boolean
      is_locally_grown boolean
      is_organic boolean
      is_vegan boolean
      is_vegetarian boolean
      created_at timestamp
      updated_at timestamp
   }

   logged_meals {
      id uuid PK
      user_id text FK
      dish_id text FK
      servings real
      eaten_at timestamp
   }

   user_allergies {
      userId text PK,FK
      allergy allergy PK
   }

   user_dietary_preferences {
      userId text PK,FK
      preference preference PK
   }

   user_goals {
      user_id text PK,FK
      calorie_goal integer
      protein_goal integer
      carb_goal integer
      fat_goal integer
   }

   restaurant_id_enum

   restaurant_name_enum

   allergy

   preference

   favorites }o--|| users : refers
   favorites }o--|| dishes : refers
   favorites }o--|| restaurant_id_enum : refers

   ratings }o--|| users : refers
   ratings }o--|| dishes : refers
   ratings }o--|| restaurant_id_enum : refers

   dishes ||--|| diet_restrictions : refers
   logged_meals }o--|| users : refers
   logged_meals }o--|| dishes : refers
   user_allergies }o--|| users : refers
   user_allergies }o--|| allergy : refers
   user_dietary_preferences }o--|| users : refers
   user_dietary_preferences }o--|| preference : refers
   user_goals ||--|| users : refers

```

## Getting Started

### Pre-requisites

1. Install `Node.js`. This allows you to run JavaScript on your computer (outside of a browser).
   This is best done with a version manager that allows you to easily switch between
   Node.js versions based on the requirements of different projects.
   Try using any of the following.

   - [nvm](https://github.com/nvm-sh/nvm) - Node-Version-Manager.
   - [fnm](https://github.com/Schniz/fnm) - Fast-Node-Manager.
   - [nvm-windows](https://github.com/coreybutler/nvm-windows)

   If none of those work for any reason, you can defer to your Operating System's
   package manager or [the downloads from the official website](https://nodejs.org/en/download).
   We will be using the latest LTS version, 20.10.0, lts/iron.

2. Install `pnpm`. This is our package manager of choice for this project.
   It's responsible for installing, uninstalling, and keeping track of the app's dependencies.
   `npm install --global pnpm`

3. Make sure to have `docker` installed, which can be installed from [the official website](https://www.docker.com/get-started/). It will allow you to
   - run the local postgres database required for backend functions.
   - run backend tests that rely on Testcontainers.

### Developing

1. Clone the PeterPlate repository from GitHub.
   `git clone https://github.com/icssc/PeterPlate.git`

2. Navigate to the root directory and change your node version to the one specified in the .nvmrc by running
   `nvm use` or `fnm use`. In particular, we will be using Node v20.

3. While still in the root directory and install the dependencies by running
   `cd PeterPlate && pnpm install`

4. To start a local Postgres container database run the `docker compose up` in the root directory. This will automatically set up and run a test database using docker.

5. Open another terminal. If you made any database changes, run `pnpm db:generate` to generate a migration file. Run `pnpm db:migrate` to apply the migration files to the docker database.
   
6. In the root file, create a new file called `.env` based on the example variables given in `.env.example`. Do the same in `apps/next`. Ensure that all variables are nonempty to run the app properly.

7. Start local development by running `pnpm dev` in the root directory. This will start the server in `apps/server` and the client in `apps/next`.
   The tRPC procedures are available on <http://localhost:3000/><router.procedure\>?input={field: value}

   ```sh
   # example
   http://localhost:3000/events.get
   ```

8.  View the local website at [http://localhost:3000](http://localhost:3000). As you make changes to the Next.js application, those changes will be automatically
   reflected on the local website.

### Troubleshooting

Sometimes, you may run into errors when trying to run some of the commands listed above. Here are some things that can help fix this:

Reinstall packages

- Run `rm -force node_modules` and `pnpm install` to reinstall all packages in the project

Ensure Node is correct version

- Node v20 (latest of that version)
- Check by running `node -v`
- If not, download/switch to v20, by running:
  - `fnm install v20` or `nvm install v20`
  - `fnm use 20` or `nvm use 20`

### Testing

Run `npx turbo test` at the root of the project.

**Database**

Run the following command to pull data for the week into your local database.

```sh
pnpm dev:data
```

If you want to check the contents of the database, run the following command in the root directory (while the server is not running).

```sh
pnpm db:studio
```

### Adding Workspaces

To add a new package run `turbo gen workspace` and follow the prompts.
