require('dotenv').config()
const express = require('express');
const exphbs  = require('express-handlebars');
const session = require("express-session");
const ExpressOIDC = require("@okta/oidc-middleware").ExpressOIDC;
const { v4: uuidv4 } = require('uuid');
var cache = require('memory-cache');

const app = express()

var hbs = exphbs.create({
    // Specify helpers which are only registered on this instance.
    helpers: {
        jwt: function (token){
            var atob = require('atob');
            if (token != null) {
                var base64Url = token.split('.')[1];
                var base64 = base64Url.replace('-', '+').replace('_', '/');
                return JSON.stringify(JSON.parse(atob(base64)), undefined, '\t');
            } else {
                return 'error'
            }
        }
    }
});
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use("/static", express.static("static"));
app.use(session({
    secret: process.env.SESSION_SECRET,
    saveUninitialized: false,
    resave: true
  }))

let oidc = new ExpressOIDC({
    issuer: process.env.OKTA_OAUTH2_ISSUER,
    client_id: process.env.OKTA_OAUTH2_CLIENT_ID_WEB,
    client_secret: process.env.OKTA_OAUTH2_CLIENT_SECRET_WEB,
    appBaseUrl: process.env.BASE_URI,
    scope: process.env.SCOPES
});

app.use(oidc.router);

const router = express.Router();

router.get("/", async function(req,res) {
    res.render("index", {name: process.env.DEMO_NAME, image:process.env.DEMO_IMAGE, logo:process.env.DEMO_LOGO});
})

router.get("/verification", oidc.ensureAuthenticated(), async function(req,res) {
    var cacheid = Math.floor(100000000 + Math.random() * 900000000);
    cache.put(cacheid,req.userContext.tokens.access_token)
    res.render("complete",{name: process.env.DEMO_NAME, image:process.env.DEMO_IMAGE, logo:process.env.DEMO_LOGO, verificationLink:process.env.BASE_URI+'/verify?id='+cacheid, cacheid: cacheid, oktaorg: process.env.OKTA_ORG});
})

router.get("/verify", oidc.ensureAuthenticated(), async function(req,res) {
    var token = cache.get(req.query.id)
    //handle cache misses
    res.render("verify",{name: process.env.DEMO_NAME, image:process.env.DEMO_IMAGE, logo:process.env.DEMO_LOGO, token: token, nocode: (token == null)});
})

app.use(router)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Cross Channel Auth started on '+PORT))