import { http, createConfig } from "wagmi";
import { injected } from "wagmi/connectors";
import { botchainMainnet, botchainTestnet } from "./botchain";

export const config = createConfig({
  chains: [botchainMainnet, botchainTestnet],
  connectors: [
    injected(),
  ],
  transports: {
    [botchainMainnet.id]: http("https://rpc.botchain.ai"),
    [botchainTestnet.id]: http("https://rpc.bohr.life"),
  },
  ssr: true,
});

declare module "wagmi" {
  interface Register {
    config: typeof config;
  }
}
