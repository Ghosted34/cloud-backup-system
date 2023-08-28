import * as http from "http";
import App from "./app.js";
import job from "./cronJob.js";

import { port as serverPort } from "./config/index.js";

const port = serverPort || 3070;

App.set("port", port);
const server = http.createServer(App);
server.listen(port);
job.start();

server.on("listening", function (): void {
  const addr = server.address();

  const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr?.port}`;
  console.log(`connected on  ${bind}`);
});

export default App;
