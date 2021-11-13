const express = require("express");
const app = express();

const port = 5005;
app.use(express.json());

app.use(require("./routes"));

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
