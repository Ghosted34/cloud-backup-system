import * as http from "http";
import App from "./app.js";
import { port as serverPort } from "./config/index.js";
const port = serverPort || 3070;
App.set("port", port);
const server = http.createServer(App);
server.listen(port);
server.on("listening", function () {
    const addr = server.address();
    const bind = typeof addr === "string" ? `pipe ${addr}` : `port ${addr === null || addr === void 0 ? void 0 : addr.port}`;
    console.log(`connected on  ${bind}`);
});
export default App;
