const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/database");
const { initializeRoles, getRoles } = require("./config/roles");
const verifyJWT = require("./middlewares/verifyJWTMiddleware");

const app = express();
const port = 5000;

const startServer = async () => {
  try {
    await connectDB();
    await initializeRoles();

    const authRoutes = require("./routes/authRoutes");
    const languageRoutes = require("./routes/languageRoutes");
    const roleRoutes = require("./routes/roleRoutes");
    const levelRoutes = require("./routes/levelRoutes");
    const applicationStateRoutes = require("./routes/applicationStateRoutes");

    app.use(express.urlencoded({ extended: true }));
    app.use(cors());
    app.use(bodyParser.json());

    app.use("/auth", authRoutes);

    app.use(verifyJWT);

    app.use("/languages", languageRoutes);
    app.use("/roles", roleRoutes);
    app.use("/levels", levelRoutes);
    app.use("/applicationStates", applicationStateRoutes);

    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
