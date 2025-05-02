import { Sequelize  } from "sequelize";
import { initUserModel } from "../models/User";
import { initMovieModel } from "../models/Movie";
import { initHallModel } from "../models/Hall";

export const sequelize = new Sequelize({
    dialect: "sqlite", 
    storage: process.env.DB_PATH || "data/database.sqlite",
});
 
initUserModel(sequelize);
initMovieModel(sequelize);
initHallModel(sequelize);

export async function syncDb(): Promise<void> {
    try {
        await sequelize.sync({force: true});
        console.log("Database syncronized successfully");
    }
    catch (error) {
        console.error("Error syncing database: ", error);
    }
}



