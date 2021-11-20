require("dotenv").config();
const express = require("express");
const nonce = require("nonce")();
const cookie = require("cookie");
const querystring = require("querystring");
const crypto = require("crypto");
const request = require("request-promise");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const dbConfig = require("./config/db.config.js");
const mongoose = require("mongoose");
let template_schema;
let template_model;

const connectWithDB = async () => {
  await mongoose
    .connect(dbConfig.url, {
      useUnifiedTopology: true,
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
    })
    .then((connection) => {
      console.log(`Connected with Database: ${connection.connection.name}`);
    })
    .catch((err) => {
      console.error(err);
      process.exit(0);
    });
};
connectWithDB();

app.get("/", (req, res) => {
  console.log(req.query.shop);
  console.log(req.query);
  res.send(`Hello App ${req.query.shop}`);
});

app.get("/auth", (req, res) => {
  console.log("Auth Request");
  const shop = req.query.shop; // Shop Name passed in URL
  if (shop) {
    const state = nonce();
    console.log(state);
    console.log(process.env.SHOPIFY_API_KEY);
    const redirectUri = process.env.TUNNEL_URL + "/auth/callback"; // Redirect URI for shopify Callback
    const installUri =
      "https://" +
      shop +
      "/admin/oauth/authorize?client_id=" +
      process.env.SHOPIFY_API_KEY +
      "&scope=" +
      process.env.SCOPES +
      "&state=" +
      state +
      "&redirect_uri=" +
      redirectUri; // Install URL for app install

    res.cookie("state", state);
    res.redirect(installUri);
  } else {
    return res
      .status(400)
      .send(
        "Missing shop parameter. Please add ?shop=your-development-shop.myshopify.com to your request"
      );
  }
});

app.get("/auth/callback", (req, res) => {
  console.log("Callback Request");
  const { shop, hmac, code, state } = req.query;
  const stateCookie = cookie.parse(req.headers.cookie).state;
  console.log(state + stateCookie);

  if (state !== stateCookie) {
    return res.status(403).send("Request origin cannot be verified");
  }

  if (shop && hmac && code) {
    const map = Object.assign({}, req.query);
    delete map["signature"];
    delete map["hmac"];
    const message = querystring.stringify(map);
    const providedHmac = Buffer.from(hmac, "utf-8");
    const generatedHash = Buffer.from(
      crypto
        .createHmac("sha256", process.env.SHOPIFY_API_SECRET)
        .update(message)
        .digest("hex"),
      "utf-8"
    );
    let hashEquals = false;

    try {
      hashEquals = crypto.timingSafeEqual(generatedHash, providedHmac);
    } catch (e) {
      hashEquals = false;
    }

    if (!hashEquals) {
      return res.status(400).send("HMAC validation failed");
    }
    const accessTokenRequestUrl =
      "https://" + shop + "/admin/oauth/access_token";
    const accessTokenPayload = {
      client_id: process.env.SHOPIFY_API_KEY,
      client_secret: process.env.SHOPIFY_API_SECRET,
      code,
    };
    request
      .post(accessTokenRequestUrl, {
        json: accessTokenPayload,
      })
      .then((accessTokenResponse) => {
        const accessToken = accessTokenResponse.access_token;
        const shopRequestUrl =
          "https://" + shop + "/admin/api/2019-07/shop.json";
        const shopRequestHeaders = {
          "X-Shopify-Access-Token": accessToken,
        };

        request
          .get(shopRequestUrl, {
            headers: shopRequestHeaders,
          })
          .then((shopResponse) => {
            res.redirect("https://" + shop + "/admin/apps");
          })
          .catch((error) => {
            res.status(error.statusCode).send(error.error.error_description);
          });
      })
      .catch((error) => {
        res.status(error.statusCode).send(error.error.error_description);
      });
  } else {
    res.status(400).send("Required parameters missing");
  }
});

app.post("/api/save", (req, res) => {
  let newData = new template_model({ data: req.body.data });
  newData
    .save()
    .then((success) => {
      console.log(success);
    })
    .catch((error) => {
      console.log(error);
    });
  res.send({ success: "New Template Stored Successfully." });
});

app.listen(port, () => {
  template_schema = mongoose.Schema({ data: JSON });
  template_model = mongoose.model("email-template", template_schema);
  console.log(`Server is running on port ${port}.`);
});
