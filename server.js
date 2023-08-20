const mongoose = require("mongoose");

const app = require("./app");

const DB_HOST="mongodb+srv://OlhaYastrebova:N5SugRgyKZ9SLr3T@cluster0.jio5oz9.mongodb.net/db_contacts?retryWrites=true&w=majority"
// const { DB_HOST, PORT = 3000 } = process.env;
mongoose.set("strictQuery", true);

mongoose
  .connect(DB_HOST)
  .then(() => {
    app.listen(3000)
    // app.listen(PORT, () => {
    //   console.log(`Server running. Use our API on port: ${PORT}`);
    // });
    console.log("Database connect success");
  })
  .catch((error) => {
    console.log(error.message);
    process.exit(1);
  });

 