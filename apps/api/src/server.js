import app from "./app.js";
import { env } from "./config/env.js";

app.listen(env.PORT, () => {
console.log(`Analyteca API is running on port ${env.PORT}`);
});
