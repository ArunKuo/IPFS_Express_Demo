const express = require("express");
const IPFS = require("ipfs-http-client");
const ipfs = new IPFS({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
const bodyParser = require("body-parser");
const fileupload = require("express-fileupload");
const flash = require("connect-flash");
const app = express();

// session config
app.use(require("express-session")({
    secret: "Granblue Fantasy is good",
    resave: false,
    saveUninitialized:false
}));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs")
app.use(fileupload());
app.use(flash());
app.use(function(req,res,next){
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    next();
});

// render the fileupload page
app.get("/", (req, res) => {
    res.render("index");
});

app.post("/", (req, res) => {
    if (!req.files) {
        req.flash("error","No files were uploaded.");
        res.redirect("/");
    } else {
        let sampleFile = req.files.sampleFile;
        ipfs.add(sampleFile.data, (err, data) => {
            if (err) {
                res.send(err);
            } else {
                let hash = data[0].hash;
                let url = "https://ipfs.infura.io/ipfs/"+hash;
                req.flash("success","URL: " + url);
                res.redirect("/");
            }
        })
    }
});

app.listen(3000, () => { console.log("Server Running") });