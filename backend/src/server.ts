import app from "./app.js";
import { PORT } from "./config/env.js";

app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
