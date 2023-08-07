# OctoTread
OctoTread is a web app that uses the GitHub API to show you the most starred projects on GitHub over the last day, week, or month.

## Why
There are a few existing projects and web apps that do something similar to this. The [GitHub trending page](https://github.com/trending) allows you to see which projects were given the most stars over a period but there is no way to browse historical trending data.

[GitHunt](https://kamranahmed.info/githunt/), which is the inspiration for this project, allows one to look at the historical data but has a limited query to the GitHub search API. You can only filter on languages and only the first 30 projects are shown for a period.

## Features
- Support for most search query qualifiers in the [GitHub repository search API](https://docs.github.com/en/search-github/searching-on-github/searching-for-repositories). These can be customized using the search filters dropdown.
- Pagination support for each period that is loaded as well as the items loaded per page.
- Uses the [GitHub GraphQL API](https://docs.github.com/en/graphql) which should theorically result in quicker responses.

Note: GitHub requires an access token to use the GraphQL API. This is not the case with the REST API, where you are allowed to access public entities without a token. I'll probably look into adding an option to use the REST API to mitigate this.

# Development
OctoTread uses `vite` for building and bundling.

- `npm i` to install dependencies
- `npm run dev` to start the dev server
- `npm run preview` and `npm run build` to create a preview or bundle of the production environment respectively
- `npm run graphql-codegen` to generate GraphQL-related hooks and classes. This needs to be done whenever a `*.graphql` file is modified
- `npm run test` to run all tests

Additionally, linting has been configured with eslint and prettier. Use your IDE's linter integration to automatically format the file being modified. Alternatively, use `npm run lint` to lint files manually.

# Tech Stack
- MUI for components and styling
- Redux, RTK, and RTK Query for state management and API querying logic
- GraphQL code generation is done using the `@graphql-codegen` library along with the necessary extensions
- Vitest and React testing library for tests
- Azure functions to handle GitHub OAuth
