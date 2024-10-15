# CosmWasm Tracing UI

## Run locally

This app expects a reachable [cosmwasm-tracing-api](https://github.com/confio/cosmwasm-tracing-api) node as the source of its tracing data.

### Setting up CosmWasm Tracing API

Follow [the instructions](https://github.com/confio/cosmwasm-tracing-api?tab=readme-ov-file#run_locally) on its repo's `README.md`.

### Running the UI

Copy the `.env.sample` in the root of this repo to a new `.env.local` file. There you will be able to configure the CosmWasm API URL.

Example `.env.local`:

```bash
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1
```

Then you can start this Node app in dev mode or prod mode by running `npm run dev` or `npm run start`, respectively, after installing its dependencies with `npm install`.
