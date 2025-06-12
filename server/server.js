// Load environment variables first
require("dotenv").config();

// Environment Variable Validation
if (
  !process.env.RAZORPAY_KEY_ID ||
  !process.env.RAZORPAY_KEY_SECRET ||
  !process.env.MONGO_URI
) {
  console.error("❌ Error: Missing environment variables in .env file");
  process.exit(1);
}

// Imports
const express = require("express");
const mongoose = require("mongoose");
const Razorpay = require("razorpay");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

// App Initialization
const app = express();
const port = 9000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {})
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// Mongo Events
mongoose.connection.on("error", (err) => {
  console.error("❌ MongoDB connection error:", err);
});
mongoose.connection.on("disconnected", () => {
  console.log("⚠️ MongoDB disconnected");
});
process.on("SIGINT", () => {
  mongoose.connection.close(() => {
    console.log("MongoDB connection closed due to app termination");
    process.exit(0);
  });
});

// Razorpay Initialization
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID.trim(),
  key_secret: process.env.RAZORPAY_KEY_SECRET.trim(),
});
console.log("Razorpay initialized");

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Middleware
app.use(express.json({ limit: "10mb" }));
app.use(cors());

// Static Files
const publicPath = path.join(__dirname, "public");
if (!fs.existsSync(publicPath)) {
  fs.mkdirSync(publicPath, { recursive: true });
}
app.use(express.static(publicPath));

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Max 5MB
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
      return cb(new Error("Only image files are allowed!"), false);
    }
    cb(null, true);
  },
});

// Function to upload to Cloudinary
function uploadToCloudinary(buffer, folderName) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folderName },
      (error, result) => {
        if (result) resolve(result.secure_url);
        else reject(error);
      }
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });
}

//Signup page
var signupSchema = mongoose.Schema(
  {
    pname: String,
    phone: String,
    username: { type: String, unique: true },
    password: String,
    usertype: String,
  },
  { versionKey: false }
);
var SignupModel = mongoose.model("signup", signupSchema, "signup");

// Get order by ID
app.get("/api/getorderbyid", async (req, res) => {
  try {
    const orderid = req.query.orderid;

    if (!orderid) {
      return res.status(400).json({
        statuscode: 0,
        message: "Order ID is required",
      });
    }

    const order = await OrderModel.findOne({ _id: orderid });

    if (!order) {
      return res.status(404).json({
        statuscode: 0,
        message: "Order not found",
      });
    }

    res.status(200).json({
      statuscode: 1,
      message: "Order found",
      order: order,
    });
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({
      statuscode: 0,
      message: "Error fetching order",
      error: error.message,
    });
  }
});

// Get order products by order ID
app.get("/api/getorderproducts", async (req, res) => {
  try {
    const orderid = req.query.orderno;

    if (!orderid) {
      return res.status(400).json({
        statuscode: 0,
        message: "Order ID is required",
      });
    }

    // First, get the order to verify it exists
    const order = await OrderModel.findOne({ _id: orderid });

    if (!order) {
      console.error(`Order not found for ID: ${orderid}`);
      return res.status(404).json({
        statuscode: 0,
        message: "Order not found",
      });
    }

    // Then get all items for this order
    const items = await OrderItemModel.find({ orderid: orderid });

    if (!items || items.length === 0) {
      console.error(`No items found for order ${orderid}`);
      return res.status(404).json({
        statuscode: 0,
        message: "No items found for this order",
      });
    }

    // Transform items to match frontend expectations
    const transformedItems = items.map((item) => ({
      _id: item._id,
      ProdName: item.productname,
      Rate: item.rate,
      Qty: item.quantity,
      TotalCost: item.total,
      picture: item.picture,
    }));

    res.status(200).json({
      statuscode: 1,
      message: "Order items retrieved successfully",
      items: transformedItems,
    });
  } catch (error) {
    console.error("Error fetching order items:", error);
    res.status(500).json({
      statuscode: 0,
      message: "Error fetching order items",
      error: error.message,
    });
  }
});

app.post("/api/signup", async (req, res) => {
  var newrecord = new SignupModel({
    pname: req.body.name,
    phone: req.body.phone,
    username: req.body.uname,
    password: req.body.pass,
    usertype: "normal",
  });

  var result = await newrecord.save();

  if (result) {
    res.status(200).send({ statuscode: 1, msg: "Signup Successfull" });
  } else {
    res.status(500).send({ statuscode: 0, msg: "Signup not successfull" });
  }
});

//Login page
app.post("/api/login", async (req, res) => {
  var result = await SignupModel.find({
    username: req.body.uname,
    password: req.body.pass,
  })
    .select("-password")
    .select("-phone");
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, pdata: result[0] });
  }
});

//Search user
app.get("/api/searchuser", async (req, res) => {
  var result = await SignupModel.find({ username: req.query.un });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, searchdata: result });
  }
});

app.get("/api/getallusers", async (req, res) => {
  var result = await SignupModel.find().sort({ Name: 1 });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, membersdata: result });
  }
});

app.delete("/api/deluser/:uid", async (req, res) => {
  var result = await SignupModel.deleteOne({ _id: req.params.uid });
  if (result.deletedCount === 1) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

//Change password
app.put("/api/changepassword", async (req, res) => {
  try {
    var updateresult = await SignupModel.updateOne(
      { username: req.body.uname, password: req.body.currpass },
      { $set: { password: req.body.newpass } }
    );

    if (updateresult.modifiedCount === 1) {
      res.status(200).send({ statuscode: 1 });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
});

//Manage Category
var catSchema = mongoose.Schema(
  { catname: String, catpic: String },
  { versionKey: false }
);

var CatModel = mongoose.model("category", catSchema, "category");

app.post("/api/savecategory", upload.single("catpic"), async (req, res) => {
  let picturename = "noimage.jpg";

  if (req.file) {
    picturename = await uploadToCloudinary(req.file.buffer, "categories");
  }

  const newrecord = new CatModel({
    catname: req.body.catname,
    catpic: picturename,
  });

  const result = await newrecord.save();
  res.status(200).send({ statuscode: result ? 1 : 0 });
});

app.get("/api/getallcat", async (req, res) => {
  var result = await CatModel.find();

  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, catdata: result });
  }
});

app.put("/api/updatecategory", upload.single("catpic"), async (req, res) => {
  try {
    let picturename = req.body.oldpicname;

    if (req.file) {
      picturename = await uploadToCloudinary(req.file.buffer, "categories");
    }

    const updateresult = await CatModel.updateOne(
      { _id: req.body.cid },
      { $set: { catname: req.body.catname, catpic: picturename } }
    );

    res.status(200).send({ statuscode: updateresult.modifiedCount === 1 ? 1 : 0 });
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occurred" });
  }
});

app.delete("/api/delcat/:cid", async (req, res) => {
  var result = await CatModel.deleteOne({ _id: req.params.cid });
  if (result.deletedCount === 1) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

//Manage Sub category
var subcatSchema = mongoose.Schema(
  { subcatname: String, subcatpic: String, catid: String },
  { versionKey: false }
);

var SubCatModel = mongoose.model("subcategory", subcatSchema, "subcategory");

app.post("/api/savesubcategory", upload.single("subcatpic"), async (req, res) => {
  let picturename = "noimage.jpg";

  if (req.file) {
    picturename = await uploadToCloudinary(req.file.buffer, "subcategories");
  }

  const newrecord = new SubCatModel({
    subcatname: req.body.subcatname,
    subcatpic: picturename,
    catid: req.body.categoryid,
  });

  const result = await newrecord.save();
  res.status(200).send({ statuscode: result ? 1 : 0 });
});

app.get("/api/getallsubcat", async (req, res) => {
  var result = await SubCatModel.find({ catid: req.query.cid });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, subcatdata: result });
  }
});

app.put("/api/updatesubcategory", upload.single("subcatpic"), async (req, res) => {
  try {
    let picturename = req.body.oldpicname;

    if (req.file) {
      picturename = await uploadToCloudinary(req.file.buffer, "subcategories");
    }

    const updateresult = await SubCatModel.updateOne(
      { _id: req.body.subcatid },
      {
        $set: {
          subcatname: req.body.subcatname,
          subcatpic: picturename,
          catid: req.body.categoryid,
        },
      }
    );

    res.status(200).send({ statuscode: updateresult.modifiedCount === 1 ? 1 : 0 });
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occurred" });
  }
});

app.delete("/api/delsubcat/:sid", async (req, res) => {
  var result = await SubCatModel.deleteOne({ _id: req.params.sid });
  if (result.deletedCount === 1) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

//Manage Products
var prodSchema = mongoose.Schema(
  {
    catid: String,
    subcatid: String,
    pname: String,
    Rate: Number,
    Discount: Number,
    Stock: Number,
    Description: String,
    picture: String,
    addedon: String,
  },
  { versionKey: false }
);
var ProdModel = mongoose.model("product", prodSchema, "product");

app.post("/api/saveproduct", upload.single("picture"), async (req, res) => {
  try {
    let picturename = "noimage.jpg";

    if (req.file) {
      picturename = await uploadToCloudinary(req.file.buffer, "products");
    }

    const newrecord = new ProdModel({
      catid: req.body.catid,
      subcatid: req.body.subcatid,
      pname: req.body.pname,
      Rate: req.body.rate,
      Discount: req.body.dis,
      Stock: req.body.stock,
      Description: req.body.descp,
      picture: picturename,
      addedon: new Date(),
    });

    const result = await newrecord.save();
    console.log("Saved Product: ", result);
    res.status(200).send({ statuscode: result ? 1 : 0 });
  } catch (err) {
    console.error("Error uploading product:", err);
    res.status(500).send({ statuscode: -1, msg: "Upload failed" });
  }
});

app.get("/api/fetchprodsbycatid", async (req, res) => {
  var result = await SubCatModel.find({ catid: req.query.cid });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, subcatdata: result });
  }
});

app.get("/api/fetchprodsbysubcatid", async (req, res) => {
  var result = await ProdModel.find({ subcatid: req.query.sid });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, proddata: result });
  }
});

app.get("/api/getproddetails", async (req, res) => {
  try {
    const result = await ProdModel.find({ _id: req.query.pid });

    if (result.length === 0) {
      res.status(200).send({ statuscode: 0 });
    } else {
      res.status(200).send({ statuscode: 1, product: result[0] });
    }
  } catch (error) {
    console.error("Error fetching product details:", error);
    res.status(500).send({ statuscode: -1, message: "Internal server error" });
  }
});

app.delete("/api/delproduct/:id", async (req, res) => {
  var result = await ProdModel.deleteOne({ _id: req.params.id });
  if (result) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

// Update product
app.put("/api/updateproduct", upload.single("picture"), async (req, res) => {
  try {
    const { catid, subcatid, pname, rate, dis, stock, descp, oldpicname, pid } = req.body;

    const updateData = {
      catid,
      subcatid,
      pname,
      Rate: rate,
      Discount: dis,
      Stock: stock,
      Description: descp,
    };

    if (req.file) {
      updateData.picture = await uploadToCloudinary(req.file.buffer, "products");
    } else {
      updateData.picture = oldpicname;
    }

    const result = await ProdModel.updateOne(
      { _id: pid },
      { $set: updateData }
    );

    res.status(200).send({
      statuscode: result.modifiedCount > 0 ? 1 : 0,
      message: result.modifiedCount > 0
        ? "Product updated successfully"
        : "No changes made to the product"
    });
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).send({
      statuscode: -1,
      message: "Error updating product",
      error: error.message,
    });
  }
});


//Show Cart
var cartSchema = mongoose.Schema(
  {
    pid: String,
    picture: String,
    ProdName: String,
    Rate: Number,
    Qty: Number,
    TotalCost: Number,
    Username: String,
  },
  { versionKey: false }
);
var CartModel = mongoose.model("cart", cartSchema, "cart");
app.post("/api/savetocart", async (req, res) => {
  var newrecord = new CartModel({
    pid: req.body.pid,
    picture: req.body.picture,
    ProdName: req.body.pname,
    Rate: req.body.rate,
    Qty: req.body.qty,
    TotalCost: req.body.tc,
    Username: req.body.username,
  });

  var result = await newrecord.save();

  if (result) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

app.get("/api/getcart", async (req, res) => {
  try {
    var result = await CartModel.find({ Username: req.query.un });
    if (result.length === 0) {
      res.status(200).send({ statuscode: 0 });
    } else {
      res.status(200).send({ statuscode: 1, cartinfo: result });
    }
  } catch (e) {
    res.status(500).send({ statuscode: -1, errmsg: e.message });
  }
});

app.delete("/api/delcartitem/:uid", async (req, res) => {
  var result = await CartModel.deleteOne({ _id: req.params.uid });
  if (result.deletedCount === 1) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});
// Order Details Schema
const orderSchema = new mongoose.Schema(
  {
    saddress: String,
    billamt: Number,
    username: String,
    OrderDate: { type: Date, default: Date.now },
    PayMode: String,
    CardDetails: Object,
    OrderProducts: [Object],
    status: { type: String, default: "Placed" },
  },
  { versionKey: false }
);

const OrderModel = mongoose.model("finalorder", orderSchema, "finalorder");

// Order Items Schema
const orderItemSchema = new mongoose.Schema(
  {
    orderid: { type: mongoose.Schema.Types.ObjectId, ref: "finalorder" },
    productid: { type: String, required: true },
    productname: { type: String, required: true },
    rate: { type: Number, required: true },
    quantity: { type: Number, required: true },
    total: { type: Number, required: true },
    picture: String,
    username: { type: String, required: true },
    orderDate: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const OrderItemModel = mongoose.model(
  "orderitems",
  orderItemSchema,
  "orderitems"
);

// Export models for use in other files
module.exports = {
  OrderModel,
  OrderItemModel,
};

app.post("/api/saveorder", express.json(), async (req, res) => {
  try {
    // Validate required fields
    const requiredFields = ["saddr", "tbill", "uname", "pmode", "cartinfo"];
    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        statuscode: 0,
        message: "Missing required fields",
        missingFields: missingFields,
      });
    }

    // Validate cart data
    const { cartinfo } = req.body;
    if (!Array.isArray(cartinfo) || cartinfo.length === 0) {
      return res.status(400).json({
        statuscode: 0,
        message: "Invalid or empty cart data",
        cartData: cartinfo || "No cart data provided",
      });
    }

    // Validate each cart item
    const invalidItems = [];
    const validItems = [];

    for (const [index, item] of cartinfo.entries()) {
      if (!item.pid || !item.Qty || item.Qty <= 0) {
        invalidItems.push({
          index,
          item,
          reason: "Missing or invalid product ID or quantity",
        });
      } else {
        // Verify product exists and has sufficient stock
        try {
          const product = await ProdModel.findOne({ _id: item.pid });
          if (!product) {
            invalidItems.push({
              index,
              item,
              reason: "Product not found",
            });
          } else if (product.Stock < item.Qty) {
            invalidItems.push({
              index,
              item,
              reason: "Insufficient stock",
              availableStock: product.Stock,
            });
          } else {
            validItems.push({
              ...item,
              productName: product.pname,
              price: product.Rate,
            });
          }
        } catch (err) {
          console.error(`Error validating product ${item.pid}:`, err);
          invalidItems.push({
            index,
            item,
            reason: "Error validating product",
            error: err.message,
          });
        }
      }
    }

    // If there are invalid items but no valid ones, return error
    if (invalidItems.length > 0 && validItems.length === 0) {
      return res.status(400).json({
        statuscode: 0,
        message: "All items in cart are invalid",
        invalidItems,
        validItemsCount: validItems.length,
      });
    }

    // Use the provided amount from frontend as it includes any discounts
    const providedAmount = parseFloat(req.body.tbill);
    if (req.body.cartinfo && Array.isArray(req.body.cartinfo)) {
      req.body.cartinfo.forEach((frontendItem) => {
        const backendItem = validItems.find(
          (item) => item.pid === frontendItem.pid
        );
        if (backendItem) {
          backendItem.price = frontendItem.Rate;
        }
      });
    }

    // Recalculate with updated prices
    const calculatedBill = validItems.reduce((total, item) => {
      return total + item.price * item.Qty;
    }, 0);

    const difference = Math.abs(calculatedBill - providedAmount);
    // Verify the calculated bill matches the provided bill (with small rounding tolerance)
    if (difference > 1) {
      // Increased tolerance to 1 rupee for rounding errors
      const errorResponse = {
        statuscode: 0,
        message: "Bill amount mismatch after applying discounts",
        providedAmount: providedAmount,
        calculatedAmount: calculatedBill,
        difference: difference,
        details: {
          validItems: validItems.map((item) => ({
            name: item.pname,
            price: item.price,
            qty: item.Qty,
            subtotal: item.price * item.Qty,
          })),
          totalItems: validItems.length,
          calculatedTotal: calculatedBill,
          providedTotal: providedAmount,
        },
      };

      console.error(
        "Bill amount validation failed:",
        JSON.stringify(errorResponse, null, 2)
      );
      return res.status(400).json(errorResponse);
    }

    // Create order document
    const orderData = {
      saddress: req.body.saddr,
      billamt: calculatedBill,
      username: req.body.uname,
      OrderDate: new Date().toISOString(),
      PayMode: req.body.pmode,
      CardDetails: req.body.cardDetails || {},
      OrderProducts: validItems,
      status: "Placed",
    };

    const order = new OrderModel(orderData);
    const savedOrder = await order.save();

    if (!savedOrder) {
      throw new Error("Failed to save order to database");
    }

    // Save order items to orderitems collection
    const orderItems = validItems.map((item) => ({
      orderid: savedOrder._id,
      productid: item.pid,
      productname: item.ProdName || item.pname,
      rate: item.Rate || item.rate,
      quantity: item.Qty || item.quantity,
      total: item.Rate * item.quantity || item.rate * item.Qty || 0,
      picture: item.picture || "noimage.jpg",
      username: req.body.uname,
    }));

    try {
      const savedItems = await OrderItemModel.insertMany(orderItems);
      console.log("Order items saved successfully:", savedItems);
    } catch (err) {
      console.error("Error saving order items:", err);
      throw new Error("Failed to save order items");
    }

    // Update product stock
    await Promise.all(
      validItems.map((item) =>
        ProdModel.updateOne({ _id: item.pid }, { $inc: { Stock: -item.Qty } })
      )
    );

    // Clear user's cart
    await CartModel.deleteMany({ Username: req.body.uname });

    // Return success with order ID and any invalid items
    res.status(200).json({
      statuscode: 1,
      orderId: savedOrder._id,
      message: "Order placed successfully",
      invalidItems: invalidItems.length > 0 ? invalidItems : undefined,
      validItemsCount: validItems.length,
    });
  } catch (error) {
    console.error("Error in /api/saveorder:", error);
    res.status(500).json({
      statuscode: -1,
      message: "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

app.put("/api/updatestock", express.json(), async (req, res) => {
  try {
    // Validate request body and cart data
    if (
      !req.body ||
      !Array.isArray(req.body.cartinfo) ||
      req.body.cartinfo.length === 0
    ) {
      console.error("Invalid or empty cart data:", req.body);
      return res.status(400).json({
        statuscode: 0,
        message: "Invalid or empty cart data",
      });
    }

    const cartdata = req.body.cartinfo;
    let updateResults = [];

    // Process each item in the cart
    for (let item of cartdata) {
      if (!item.pid || item.Qty === undefined) {
        console.error("Invalid cart item:", item);
        continue; // Skip invalid items
      }

      try {
        const result = await ProdModel.updateOne(
          { _id: item.pid, Stock: { $gte: item.Qty } }, // Ensure sufficient stock
          { $inc: { Stock: -item.Qty } }
        );
        updateResults.push({
          pid: item.pid,
          success: result.modifiedCount === 1,
          matchedCount: result.matchedCount,
          modifiedCount: result.modifiedCount,
        });
      } catch (updateError) {
        console.error(
          `Error updating stock for product ${item.pid}:`,
          updateError
        );
        updateResults.push({
          pid: item.pid,
          success: false,
          error: updateError.message,
        });
      }
    }

    // Check if all updates were successful
    const allSuccessful = updateResults.every((r) => r.success);
    const anySuccessful = updateResults.some((r) => r.success);

    if (allSuccessful) {
      res.status(200).json({
        statuscode: 1,
        message: "All stock updates successful",
        results: updateResults,
      });
    } else if (anySuccessful) {
      res.status(207).json({
        // 207 Multi-Status
        statuscode: 2,
        message: "Partial updates completed",
        results: updateResults,
        warning: "Some items could not be updated",
      });
    } else {
      res.status(400).json({
        statuscode: 0,
        message: "Failed to update stock for all items",
        results: updateResults,
      });
    }
  } catch (e) {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
});

app.delete("/api/deletecart", async (req, res) => {
  var result = await CartModel.deleteMany({ Username: req.query.un });
  if (result.deletedCount >= 1) {
    res.status(200).send({ statuscode: 1 });
  } else {
    res.status(200).send({ statuscode: 0 });
  }
});

app.get("/api/getorderid", async (req, res) => {
  try {
    var result = await OrderModel.findOne({ username: req.query.un }).sort({
      OrderDate: -1,
    });
    if (result) {
      res.status(200).send({ statuscode: 1, orderdata: result });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (e) {
    res.status(500).send({ statuscode: -1, errmsg: e.message });
  }
});

app.get("/api/getallorders", async (req, res) => {
  var result = await OrderModel.find().sort({ OrderDate: -1 });
  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, ordersdata: result });
  }
});

app.get("/api/getuserorders", async (req, res) => {
  var result = await OrderModel.find({ username: req.query.un }).sort({
    OrderDate: -1,
  });

  if (result.length === 0) {
    res.status(200).send({ statuscode: 0 });
  } else {
    res.status(200).send({ statuscode: 1, ordersdata: result });
  }
});

app.get("/api/getorderproducts", async (req, res) => {
  try {
    const result = await OrderModel.findOne({ _id: req.query.orderno });

    if (!result) {
      res.status(200).send({ statuscode: 0 });
    } else {
      res.status(200).send({ statuscode: 1, items: result.OrderProducts });
    }
  } catch (error) {
    console.error("Error getting order products:", error);
    res
      .status(500)
      .send({ statuscode: -1, message: "Error getting order products" });
  }
});

app.put("/api/updatestatus", async (req, res) => {
  try {
    const updateresult = await OrderModel.updateOne(
      { _id: req.body.orderid },
      { $set: { status: req.body.newst } }
    );

    if (updateresult.modifiedCount === 1) {
      res.status(200).send({ statuscode: 1 });
    } else {
      res.status(200).send({ statuscode: 0 });
    }
  } catch (error) {
    console.error("Error updating status:", error);
    res.status(500).send({ statuscode: -1, message: "Error updating status" });
  }
});
app.get("/api/searchproducts", async (req, res) => {
  try {
    var searchtext = req.query.q;
    var result = await ProdModel.find({
      pname: { $regex: ".*" + searchtext, $options: "i" },
    });
    //result will become an array because find function returns an array
    if (result.length === 0) {
      res.status(200).send({ statuscode: 0 });
    } else {
      res.status(200).send({ statuscode: 1, proddata: result });
    }
  } catch {
    console.log(e);
    res.status(500).send({ statuscode: -1, msg: "Some error occured" });
  }
});

// Get latest products
app.get("/api/fetchnewprods", async (req, res) => {
  try {
    // Fetch the 12 most recent products, sorted by addedon date (newest first)
    const products = await ProdModel.find({}).sort({ addedon: -1 }).limit(12);

    if (products.length > 0) {
      res.status(200).send({ statuscode: 1, proddata: products });
    } else {
      res.status(200).send({ statuscode: 0, msg: "No products found" });
    }
  } catch (error) {
    console.error("Error fetching latest products:", error);
    res.status(500).send({ statuscode: 0, msg: "Error fetching products" });
  }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GEMINI_API_KEY);

app.post("/api/chat", async (req, res) => {
  const userMessage = req.body.message;

  if (!userMessage) {
    return res.status(400).json({ error: "Message is required." });
  }

  const lowerMessage = userMessage.toLowerCase();

  // 🎯 Fun, custom replies for Trend Haven brand awareness
  if (
    lowerMessage.includes("who are you") ||
    lowerMessage.includes("what's your name") ||
    lowerMessage.includes("your name") ||
    lowerMessage.includes("name")
  ) {
    return res.json({
      reply: `Heya! I'm *TrendBot*, the savage stylist of *Trend Haven*  
Serving looks harder than your Monday blues   
Ask me anything — fashion-related, of course.`,
    });
  }

  if (
    lowerMessage.includes("contact") ||
    lowerMessage.includes("manager") ||
    lowerMessage.includes("owner") ||
    lowerMessage.includes("founder") ||
    lowerMessage.includes("email") ||
    lowerMessage.includes("address") ||
    lowerMessage.includes("phone")
  ) {
    return res.json({
      reply: `Wanna speak to the legend behind the scenes?  
*Trend Haven* is managed by the *Harshul Chawla*.  
📞 Contact: 7814272742  
✉️ Email: harshulchawla1408@gmail.com
🏠 Address: 123, Model Town, Jalandhar, Punjab  
(But no fashion emergencies at 3 AM please 😴)`,
    });
  }

  if (
    lowerMessage.includes("what is trend haven") ||
    lowerMessage.includes("about trend haven") ||
    lowerMessage.includes("trend haven") ||
    lowerMessage.includes("what is this website") ||
    lowerMessage.includes("about this website") ||
    lowerMessage.includes("website") ||
    lowerMessage.includes("what is this site")
  ) {
    return res.json({
      reply: ` *Trend Haven* is your personal runway online ✨  
Outfits, vibes, and savage style tips — all curated with love and a little sass.  
So... ready to slay today? `,
    });
  }

  try {
    // 👗 Use Gemini for everything else
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(userMessage);
    const response = await result.response;
    const text = response.text();

    res.status(200).json({ reply: text });
  } catch (err) {
    console.error("Gemini Error:", err);
    res.status(500).json({
      error: "Fashion emergency! I'm offline for now. Try again soon.",
    });
  }
});

const crypto = require("crypto");

// Create Razorpay Order
app.post("/api/payment/order", async (req, res) => {
  try {
    let { amount, amountInRupees } = req.body;

    if (!amount || amount <= 0) {
      console.error("Invalid amount received:", amount);
      return res.status(400).json({
        success: false,
        error: "Invalid amount",
      });
    }

    // Convert amount to paise if it's in rupees
    const amountInPaise = amountInRupees ? Math.round(amount * 100) : amount;

    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
      payment_capture: 1,
    });

    res.status(200).json({
      success: true,
      ...order,
    });
  } catch (err) {
    console.error("Error creating Razorpay order:", err);
    res.status(500).json({
      success: false,
      error: "Failed to create order",
      details: err.message,
    });
  }
});

// Verify Razorpay Payment Signature
app.post("/api/payment/verify", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      console.error("Missing required fields in verification request");
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET.trim())
      .update(body.toString())
      .digest("hex");

    const isValid = expectedSignature === razorpay_signature;

    if (isValid) {
      console.log(
        `Payment verified successfully for order: ${razorpay_order_id}`
      );
      res.status(200).json({
        success: true,
        message: "Payment verified",
        orderId: razorpay_order_id,
        paymentId: razorpay_payment_id,
      });
    } else {
      console.error(`Invalid signature for order: ${razorpay_order_id}`);
      res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
  } catch (error) {
    console.error("Error in payment verification:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error during verification",
      error: error.message,
    });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
