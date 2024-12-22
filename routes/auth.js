const express = require("express");
const router = express.Router();

const authControllers=require("../controllers/auth_controllers.js");


router.get("/views/home-login/loading.html",authControllers.loading_get);

//cikis
router.get("/cikis",authControllers.logout_get);

//Sifre Sifirlama
router.get("/views/home-login/sifresifirlama.html",authControllers.sifreSifirlama_get);
router.post("/views/home-login/sifresifirlama.html",authControllers.sifreSifirlama_post);

//giris
router.get("/views/home-login/login.html",authControllers.login_get);
router.post("/views/home-login/login.html",authControllers.login_post);

//anasayfa
router.get("/",authControllers.anasayfa_get);


module.exports=router;