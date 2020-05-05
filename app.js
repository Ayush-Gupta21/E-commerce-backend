require("dotenv").config();

const express      = require("express");
const app          = express();
const mongoose     = require("mongoose");
const port         = process.env.PORT || 5000;
const bodyParser   = require("body-parser");
const cookieParser = require("cookie-parser");
const cors         = require("cors");

//My Routes
const authRoutes     = require("./routes/auth");
const userRoutes     = require("./routes/user");
const categoryRoutes = require("./routes/category");
const productRoutes  = require("./routes/product");
const orderRoutes = require("./routes/order");
const stripeRoutes = require("./routes/stripePayment");
const paypalRoutes = require("./routes/paypalRoutes");



//DB CONNECTION
// mongodb+srv://Ayush-Gupta21:ayush@cluster0-0w3w5.mongodb.net/test?

mongoose.connect(process.env.DATABASE,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(()=>{
    console.log("MONGODB CONNECTED");
});

//MIDDLEWARES
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());

//USING ROUTES
app.use("/api", authRoutes);
app.use("/api", userRoutes);
app.use("/api", categoryRoutes);
app.use("/api", productRoutes);
app.use("/api", orderRoutes);
app.use("/api", stripeRoutes);
app.use("/api", paypalRoutes);





app.listen(port,()=>{
    console.log(`app listening at port ${port}`);
})