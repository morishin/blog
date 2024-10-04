---
keywords:
  - 開発
  - React
---

# Azure Static Web Apps で作る React + GraphQL なサーバレスウェブアプリケーション

この記事で言いたいことは2つあって、

- Azure Static Web Apps の開発体験が良い
- TypeScript + React + GraphQL (Apollo Server, GraphQL Code Generator, React Query) の組み合わせが良い

です。

これらの技術要素を使って https://github.com/morishin/azure-static-web-apps-template というサンプルアプリを作成したので、その紹介をします。

https://github.com/morishin/azure-static-web-apps-template

上記の要素に加え、ビルドツールとして Vite、ルーティングに React Router、UI フレームワークに Chakra UI を利用しています。

---

## Azure Static Web Apps のここがすごい

Azure Static Web Apps は静的ウェブサイトのホスティングとサーバレスな API、CI/CD や VS Code プラグインを含むいい感じの開発体験を提供してくれるサービスです。何がすごいってインフラサービスだけでなく、ソースコードのホスティングとしての GitHub、CI/CD としての GitHub Actions、エディタとしての VS Code、その全てが Microsoft 製品で、それぞれの機能がシームレスに繋がりいい感じの開発体験が提供されているところです。

### VS Code 拡張

Azure アカウント (サブスクリプション) を持っていれば、ウェブコンソールや CLI の操作は必要無く、[Azure Static Web Apps の VS Code 拡張](https://marketplace.visualstudio.com/items?itemName=ms-azuretools.vscode-azurestaticwebapps)からポチポチすればアプリケーションの実行環境の作成が完了します。具体的には Azure 側へのアプリケーションの作成、GitHub へのリポジトリ作成、GitHub Actions の設定などを行なってくれます。

GitHub Actions のステータスやログなども VS Code 上から見えるのでブラウザを開かなくてもよいし、環境変数などのプロジェクトの設定も VS Code 上から行えます。

[![Image from Gyazo](https://i.gyazo.com/9b4966ee1630cc3f300336c39cea741f.png)](https://gyazo.com/9b4966ee1630cc3f300336c39cea741f)

### CI/CD と Pull Request ステージング環境

↑の拡張からプロジェクトを作成したときに自動生成される GitHub Actions の設定で、Pull Request を出した時の CI (test) 実行とステージング環境へのデプロイ、また main ブランチへのマージ時の CI (test) 実行とプロダクション環境へのデプロイが行われます。自分では何も設定してません。やばい。

[![Image from Gyazo](https://i.gyazo.com/c7a974a98632fa67805e30e9c4195894.png)](https://gyazo.com/c7a974a98632fa67805e30e9c4195894)

### ローカル開発環境

`@azure/static-web-apps-cli` パッケージにある `swa` コマンドが優秀で、静的ページとサーバレス関数の両方をローカルでエミュレートして動作を確認することができます。サンプルアプリでは Apollo Server を Azure Function のエミュレータで起動してポート7071番で listen、ウェブページは Vite の dev server で起動してポート3000番で listen していて、そこで

```sh
swa start http://localhost:3000 --api-location=http://localhost:7071
```

という風にコマンドを実行すると `http://localhost:4280` に Azure Static Web Apps の実行環境をエミュレートしたアプリが立ちます。例えばブラウザで `http://localhost:4280/index.html` にアクセスすると3000番へプロキシして Vite がリクエストを受けますが、`http://localhost:4280/api/*` にアクセスすると7071番へプロキシしてくれます。API も同じホストになることで CORS を気にしなくてもよくなるし、本番環境とも同じ挙動でとても快適です。

ちなみに Firebase Hosting + Cloud Functions だと、本番環境では[リライト](https://firebase.google.com/docs/hosting/full-config?hl=ja#rewrites) 機能によって同様の挙動が実現できますが、ローカルの開発環境ではこのようなプロキシをやってくれるツールは用意されていません。Firebase Hosting のエミュレータがやってくれればなと思いますが。Hosting を使って開発をしていた頃はそれが無くて困ったので自分で作りました😇

https://blog.morishin.me/posts/2021/02/12/rewriteproxy

Azure すごい話はこのへんにして、個々の技術スタックの話へ移ります。

## バックエンドの技術要素

バックエンドは Apollo Server を Azure Functions で起動しています。`index.ts` はこのようになっていて、GraphQL スキーマとリゾルバを読み込んで Apollo Server を起動しているだけです。

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

サーバの開発作業は GraphQL スキーマを書くこととリゾルバの実装を書くことの2つです。`schema.graphql` は例えばこんな感じで定義します。

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

これに対してリゾルバの実装をこんな感じで書きます。

```typescript
import { Resolvers, Item } from "../generated/resolvers";

export const resolvers: Resolvers = {
  Query: {
    searchItems: async (_parent, args, _context, _info) => {
      const query = args.query;
      const results = await fetchItems(query); // どこかの API を叩くなど
      return results.flat();
    },
  },
};
```

ここに登場する `Resolvers` 型は `schema.graphql` を元に GraphQL Code Generator (`@graphql-codegen/typescript` と ``@graphql-codegen/typescript-resolvers``) が自動生成してくれています。なので resolver の実装漏れは起きないし、レスポンスの型がスキーマ定義と違うという事態も起き得ません。最高〜！

ウェブアプリにページを追加するなどして新しく API が必要になれば `schema.graphql` にクエリを追加して、リゾルバに必要なロジックを書いていきます。書いた実装が動くかどうかを確認するには [GraphQL Playground](https://github.com/graphql/graphql-playground) が便利で、Apollo Server を起動するときのオ[プション](https://github.com/morishin/azure-static-web-apps-template/blob/90a552292a653475aa122163a4974b350e74ca99/api/graphql/index.ts)で有効化しておけばこのアプリの例では `http://localhost:4280/api/graphql` をブラウザで開くことで使えます。ブラウザでスキーマを見ながらクエリを書き、開発サーバの実際のレスポンスを確認することができます。

小ネタですが GraphQL スキーマやアプリの実装を変更した時に TypeScript のビルドを行なって Azure Function のエミュレータを再起動してほしいので、その用途で nodemon を使っています。[こういう設定](https://github.com/morishin/azure-static-web-apps-template/blob/main/api/nodemon.json)を書いておいて `nodemon` を実行するとそんな感じの挙動が実現できます。

## フロントエンドの技術要素

フロントエンドは `yarn create vite <プロジェクト名> --template react-ts` で作成したプロジェクトをベースにしています。React Router や Chakra UI を使うので [App.tsx](https://github.com/morishin/azure-static-web-apps-template/blob/main/src/App.tsx) はこんな感じになっています。

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

API クライアントには React Query を利用していますが、GraphQL Code Generator と React Query Plugin ([`@graphql-codegen/typescript-react-query`](https://www.graphql-code-generator.com/plugins/typescript-react-query)) の組み合わせがとてもよかったです。バックエンドの開発で `schema.graphql` を書きましたが、それを元に API クライアントの実装も自動生成することができます。

サンプルアプリの[アイテム検索結果ページの実装](https://github.com/morishin/azure-static-web-apps-template/blob/main/src/components/search/SearchPage.tsx)の抜粋ですが、この `useSearchItemsQuery` がスキーマから自動生成された関数です。

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

フィールドを指定する引数オブジェクトは型付けされており、また戻り値は API レスポンスの他に `isLoading`, `isError` といった状態も合わせて返してくれます！非常に使いやすいですね。こういうフック関数を自前実装したこともありましたが結構大変だし再発明は無駄なので助かります。これだけでも便利なのですが React Query には他にもキャッシュ機構があったりさまざまな便利機能が備わっているのでかなりおすすめです。

## おわりに

Azure Static Web Apps でサーバレスなウェブアプリケーションを作成する例を紹介しました。シンプルな要件であれば割と良い構成じゃないでしょうか。シンプルな要件というのはデータベースやユーザー認証が必要無いようなものをイメージしています。ちょっとしたデータストアが必要な場合 Azure でこの構成なら Cosmos DB が使いやすいように思いますが、それなら Firebase の Hosting + Cloud Functions + Firestore の方が楽な気がします。同様に AWS でも Amplify で S3 + Lambda + Dynamo DB という構成が取れますが開発体験は Firebase の勝ちな気がしています (Amplify は過去にちょっとしか触ったことないので不確か)。MySQL のような RDB が必要という要件の場合は CI/CD の設定に手を入れる必要も出てきてまあまあ大変なので無理にサーバレスな構成を取るよりは成熟したフルスタックフレームワークを利用する方が良いかもしれません。自分ならフロントエンドはそのままで API を Ruby on Rails にしちゃうかなあ。DB のマイグレーションとかまで面倒を見てくれるので。あと ActiveRecord が強力ですし。GraphQL との相性という観点では TypeScript で Prisma を使いたい気もするけど。ちなみに Microsoft 公式の教材コンテンツに「[Azure Static Web Apps と Azure SQL Database を使用してフルスタック アプリケーションをビルドする](https://docs.microsoft.com/ja-jp/learn/modules/build-full-stack-apps/)」というのもあるのでこの構成のまま拡張するのもナシではなさそうでした。データベースが不要なシンプルな要件というのに話を戻すと、もし Next.js を使うのであれば Vercel でホスティングするのも良さそうです。Vercel は Next.js を動かすサーバの他に[カスタムサーバ](https://nextjs.org/docs/advanced-features/custom-server)を動かすことはできませんが、Next.js の API Routes を使って無理やり(?) Apollo Server を動かしたりもできるようなので、今回のようにフロントエンドアプリから GraphQL でリソースを取得したりすることはできそうです。Next.js で Vercel だと SSR (サーバサイドレンダリング) ができるのも利点ですね。

最後はオタク早口になってしまいましたが、もし作りたいアプリのユースケースに今回紹介した構成がフィットしそうなら使ってみてください。サンプルアプリのリポジトリはこちらです。

https://github.com/morishin/azure-static-web-apps-template

