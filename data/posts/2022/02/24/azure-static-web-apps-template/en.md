---
keywords:
  - 開発
  - React
---

# Serverless Web Application with React + GraphQL on Azure Static Web Apps

There are two main points I want to convey in this article:

- The development experience with Azure Static Web Apps is excellent.
- The combination of TypeScript + React + GraphQL (Apollo Server, GraphQL Code Generator, React Query) is great.

Using these technology elements, I created a sample application called [azure-static-web-apps-template](https://github.com/morishin/azure-static-web-apps-template), and I would like to introduce it.

In addition to the above elements, I am using Vite as the build tool, React Router for routing, and Chakra UI as the UI framework.

---

## What’s Great About Azure Static Web Apps

Azure Static Web Apps is a service that provides a pleasant development experience, including static website hosting, serverless APIs, CI/CD, and VS Code plugins. What’s impressive is that not only is it an infrastructure service, but it also seamlessly integrates with GitHub for source code hosting, GitHub Actions for CI/CD, and VS Code as the editor, all of which are Microsoft products, providing a cohesive development experience.

### VS Code Extension

If you have an Azure account (subscription), you don’t need to operate the web console or CLI; you can simply click through the [Azure Static Web Apps VS Code extension](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps) to create the application runtime environment. Specifically, it handles creating the application on Azure, creating a repository on GitHub, and configuring GitHub Actions.

You can also view the status and logs of GitHub Actions from within VS Code, so there’s no need to open a browser, and you can configure project settings like environment variables directly from VS Code.

[![Image from Gyazo](https://i.gyazo.com/9b4966ee1630cc3f300336c39cea741f.png)](https://gyazo.com/9b4966ee1630cc3f300336c39cea741f)

### CI/CD and Pull Request Staging Environment

When you create a project from the extension mentioned above, it automatically generates GitHub Actions settings that execute CI (test) when a Pull Request is made and deploy to the staging environment, as well as executing CI (test) and deploying to the production environment when merging into the main branch. I didn’t set anything up myself. Amazing.

[![Image from Gyazo](https://i.gyazo.com/c7a974a98632fa67805e30e9c4195894.png)](https://gyazo.com/c7a974a98632fa67805e30e9c4195894)

### Local Development Environment

The `swa` command in the `@azure/static-web-apps-cli` package is excellent, allowing you to emulate both static pages and serverless functions locally to verify their operation. In the sample application, Apollo Server is started with the Azure Function emulator listening on port 7071, while the web page is started with Vite's dev server listening on port 3000. By executing the command

```sh
swa start http://localhost:3000 --api-location=http://localhost:7071
```

an application emulating the Azure Static Web Apps runtime environment is launched at `http://localhost:4280`. For example, when you access `http://localhost:4280/index.html` in a browser, it proxies to port 3000, where Vite receives the request, but when you access `http://localhost:4280/api/*`, it proxies to port 7071. Since the API is on the same host, you don’t have to worry about CORS, and it behaves the same as in production, making it very comfortable.

By the way, with Firebase Hosting + Cloud Functions, similar behavior can be achieved in the production environment through the [rewrite](https://firebase.google.com/docs/hosting/full-config?hl=en#rewrites) feature, but there are no tools provided for such proxying in the local development environment. I wish Firebase Hosting's emulator would handle that. When I was developing with Hosting, I struggled without it, so I created my own 😇

https://blog.morishin.me/posts/2021/02/12/rewriteproxy

Now, let's move on to the discussion of individual technology stacks.

## Backend Technology Elements

The backend is powered by Apollo Server running on Azure Functions. The `index.ts` looks like this, simply loading the GraphQL schema and resolvers to start Apollo Server.

```typescript
import { ApolloServer } from "apollo-server-azure-functions";
import { readFileSync } from "fs";
import { join } from "path";
import { resolvers } from "./resolvers";

const schemaPath = join(__dirname, "..", "schema.graphql");
const typeDefs = readFileSync(schemaPath, { encoding: "utf8" });

const server = new ApolloServer({
  typeDefs,
  resolvers,
  debug: process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development",
  playground: process.env.AZURE_FUNCTIONS_ENVIRONMENT === "Development",
});

export default server.createHandler();
```

The development work for the server involves writing the GraphQL schema and implementing the resolvers. The `schema.graphql` is defined like this, for example:

```graphql
type Item {
  id: ID!
  name: String!
  price: Int
  imageUrl: String
  itemUrl: String!
}

type Query {
  searchItems(query: String!): [Item!]!
}
```

The implementation of the resolver is written like this:

```typescript
import { Resolvers, Item } from "../generated/resolvers";

export const resolvers: Resolvers = {
  Query: {
    searchItems: async (_parent, args, _context, _info) => {
      const query = args.query;
      const results = await fetchItems(query); // Call some API
      return results.flat();
    },
  },
};
```

The `Resolvers` type that appears here is automatically generated by GraphQL Code Generator (`@graphql-codegen/typescript` and `@graphql-codegen/typescript-resolvers`) based on `schema.graphql`. This ensures that there are no missing implementations in the resolver and that the response types do not differ from the schema definitions. It’s fantastic!

If you need a new API when adding pages to the web application, you can add queries to `schema.graphql` and write the necessary logic in the resolvers. To check if the implementation works, [GraphQL Playground](https://github.com/graphql/graphql-playground) is convenient. If you enable it with the options when starting Apollo Server, in this app's case, you can use it by opening `http://localhost:4280/api/graphql` in your browser. You can write queries while viewing the schema in the browser and check the actual responses from the development server.

As a side note, when I change the GraphQL schema or the application implementation, I want TypeScript to build and restart the Azure Function emulator, so I use nodemon for that purpose. By writing a [configuration like this](https://github.com/morishin/azure-static-web-apps-template/blob/main/api/nodemon.json) and running `nodemon`, you can achieve that behavior.

## Frontend Technology Elements

The frontend is based on a project created with `yarn create vite <project-name> --template react-ts`. Since I am using React Router and Chakra UI, [App.tsx](https://github.com/morishin/azure-static-web-apps-template/blob/main/src/App.tsx) looks like this:

```typescript
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import { HomePage } from "./components/home/HomePage";
import { SearchPage } from "./components/search/SearchPage";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 300000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ChakraProvider theme={theme}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="search" element={<SearchPage />} />
          </Routes>
        </BrowserRouter>
      </ChakraProvider>
    </QueryClientProvider>
  );
}

export default App;
```

For the API client, I am using React Query, and the combination of GraphQL Code Generator and the React Query Plugin ([`@graphql-codegen/typescript-react-query`](https://www.graphql-code-generator.com/plugins/typescript-react-query)) has been very beneficial. I wrote `schema.graphql` during backend development, and based on that, I can also auto-generate the implementation of the API client.

Here’s an excerpt from the implementation of the [item search results page](https://github.com/morishin/azure-static-web-apps-template/blob/main/src/components/search/SearchPage.tsx) in the sample app, where `useSearchItemsQuery` is a function auto-generated from the schema.

```typescript
const graphqlClient = new GraphQLClient("/api/graphql");

export const SearchPage = () => {
  const params = useQueryParams();
  const { data, isLoading, isError } = useSearchItemsQuery(graphqlClient, { query: params.get("q") || "" });
  return (
    <Layout>
      <Box paddingTop={5}>
        {data ? <ItemGrid items={data?.searchItems} /> : isLoading ? <SkeletonGrid /> : isError ? "error" : null}
      </Box>
    </Layout>
  );
};
```

The argument object specifying the fields is typed, and the return value includes not only the API response but also states like `isLoading` and `isError`! It's very user-friendly. I have implemented such hook functions myself before, but it was quite challenging, and reinventing the wheel is unnecessary, so this is a great help. This alone is convenient, but React Query also has caching mechanisms and various other useful features, so I highly recommend it.

## Conclusion

I introduced an example of creating a serverless web application with Azure Static Web Apps. For simple requirements, this is quite a good configuration. By simple requirements, I mean scenarios where a database or user authentication is not necessary. If a small data store is needed, I think Cosmos DB would be easy to use with this configuration on Azure, but in that case, Firebase's Hosting + Cloud Functions + Firestore might be easier. Similarly, with AWS, you can use Amplify for a configuration of S3 + Lambda + Dynamo DB, but I feel that the development experience with Firebase is superior (although I have only touched Amplify a little in the past, so I am not certain). If the requirements involve needing an RDB like MySQL, it may become quite complicated to modify the CI/CD settings, so it might be better to use a mature full-stack framework rather than forcing a serverless configuration. Personally, I might keep the frontend as is and switch the API to Ruby on Rails, as it handles database migrations and such. Plus, ActiveRecord is powerful. From the perspective of compatibility with GraphQL, I also feel like using Prisma with TypeScript would be appealing. By the way, there is also official Microsoft educational content titled “[Build Full-Stack Applications with Azure Static Web Apps and Azure SQL Database](https://docs.microsoft.com/en-us/learn/modules/build-full-stack-apps/)”, so extending this configuration might not be out of the question. Returning to the topic of simple requirements that do not require a database, if you are using Next.js, hosting it on Vercel seems like a good option. Vercel cannot run a custom server in addition to the server that runs Next.js, but it seems possible to forcibly run Apollo Server using Next.js's API Routes, allowing you to fetch resources via GraphQL from the frontend application as in this case. Additionally, hosting on Vercel with Next.js allows for SSR (server-side rendering), which is another advantage.

I may have gotten a bit too enthusiastic at the end, but if the structure I introduced fits the use case of the application you want to create, please give it a try. The repository for the sample application is here.

https://github.com/morishin/azure-static-web-apps-template