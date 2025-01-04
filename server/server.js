const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB } = require("./db/database");
const { initializeRoles, getRoles } = require("./config/roles");
const verifyJWT = require("./middlewares/verifyJWTMiddleware");
const cookieParser = require("cookie-parser");

const app = express();
const port = 5000;

// Funkcja startująca serwer
const startServer = async () => {
  try {
    // Połącz się z bazą danych
    await connectDB();

    // Inicjalizuj role
    await initializeRoles();

    // Pobierz routy
    const authRoutes = require("./routes/authRoutes");
    const languageRoutes = require("./routes/languageRoutes");
    const roleRoutes = require("./routes/roleRoutes");
    const levelRoutes = require("./routes/levelRoutes");
    const applicationStateRoutes = require("./routes/applicationStateRoutes");

    // Ustaw middleware do obsługi formularzy
    app.use(express.urlencoded({ extended: true }));

    // Middleware do obsługi CORS
    app.use(
      cors({
        origin: "http://localhost:3000",
        credentials: true,
      })
    );

    // Ustaw middleware do obsługi JSON
    app.use(bodyParser.json());

    // Ustaw middleware do obsługi cookie
    app.use(cookieParser());

    // Ustaw routy prezed weryfikacją JWT
    app.use("/auth", authRoutes);

    // Ustaw middleware do weryfikacji JWT
    app.use(verifyJWT);

    // Ustaw routy po weryfikacji JWT
    app.use("/languages", languageRoutes);
    app.use("/roles", roleRoutes);
    app.use("/levels", levelRoutes);
    app.use("/applicationStates", applicationStateRoutes);

    // Nasłuchuj na porcie
    app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

// Uruchom serwer
startServer();
