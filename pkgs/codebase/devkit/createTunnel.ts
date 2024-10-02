import { ForwardOptions, ServerOptions, SshOptions, type TunnelOptions, createTunnel as create } from "tunnel-ssh";

interface TunnelOption {
  appName: string;
  environment: "debug" | "develop" | "main";
  port?: number;
}
export const createTunnel = async ({ appName, environment, port = 27017 }: TunnelOption) => {
  const tunnelOptions: TunnelOptions = { autoClose: true };
  const sshOptions: SshOptions = {
    host: `${appName}-${environment}.akamir.com`,
    port: 32767,
    username: "root",
    password: "akamir",
  };
  const serverOptions: ServerOptions = { port };
  const forwardOptions: ForwardOptions = {
    srcAddr: "0.0.0.0",
    srcPort: port,
    dstAddr: `mongo-0.mongo-svc.${appName}-${environment}`,
    dstPort: 27017,
  };
  const [server, client] = await create(tunnelOptions, serverOptions, sshOptions, forwardOptions);
  return `localhost:${port}`;
};
