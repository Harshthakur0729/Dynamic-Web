import app from "./src/app.js";
import config from "./src/config/config.js";
import connectDB from "./src/config/Db.js";




app.listen(config.PORT, () => {
    connectDB()
    console.log(`Server is running Port ${config.PORT}`);
})