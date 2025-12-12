import app from "./app.js";
import { PORT } from "./config/env.js";
import { connectMQTT } from "./core/mqtt.client.js";
app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
    connectMQTT();
});
//# sourceMappingURL=server.js.map