const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { connectDB, pool } = require("./db/database");
const languageRoutes = require("./routes/languageRoutes");
const roleRoutes = require("./routes/roleRoutes");

const app = express();
const port = 5000;

connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(bodyParser.json());

app.use("/languages", languageRoutes);
app.use("/roles", roleRoutes);

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${port}`);
});
