const express = require("express");
const router = express.Router();
const isAuth=require("../middlewares/auth");
const ogretmenControllers=require("../controllers/ogretmen_controllers");

router.get("/erisim",isAuth,ogretmenControllers.erisim_get);

router.get("/views/ogretmen/degerlendirogretmen.html",isAuth,ogretmenControllers.degerlendirogretmen_get);
router.post("/views/ogretmen/degerlendirogretmen.html",isAuth,ogretmenControllers.degerlendirogretmen_post);

router.get("/views/ogretmen/profilOgretmen.html",isAuth,ogretmenControllers.profilOgretmen_get);

router.get("/views/ogretmen/belgelerogretmen.html", isAuth,ogretmenControllers.ogretmenbelgegor_get);
router.post("/views/ogretmen/belgelerogretmen.html", isAuth,ogretmenControllers.ogretmenbelgegor_post);

module.exports=router;