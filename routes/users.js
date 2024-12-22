const express = require("express");
const router = express.Router();
const isAuth=require("../middlewares/auth");
const userControllers=require("../controllers/user_controllers.js");
const fileUpload = require("../helpers/file-upload");

router.get("/views/ogrenci/ogrencihome.html",isAuth,userControllers.ogrencihome_get);

router.get("/views/ogrenci/ogrencistaj1basvur.html",isAuth,userControllers.ogrencistaj1basvur_get);
router.post("/views/ogrenci/ogrencistaj1basvur.html",isAuth,userControllers.ogrencistaj1basvur_post);

router.get("/views/ogrenci/ogrencistaj1basvurubelgesi.html",isAuth,userControllers.ogrencistaj1basvurubelgesi_get);
router.post("/views/ogrenci/ogrencistaj1basvurubelgesi.html", fileUpload.upload.single("basvuruform"), isAuth, userControllers.ogrencistaj1basvurubelgesi_post);
router.get("/download-1basvuru",isAuth,userControllers.downloadstaj1basvuru);

router.get("/views/ogrenci/ogrencistaj1degerlendirme.html",isAuth,userControllers.ogrencistaj1degerlendirme_get);
router.post("/views/ogrenci/ogrencistaj1degerlendirme.html", fileUpload.upload.single("degerlendirmeFormu"), isAuth, userControllers.ogrencistaj1degerlendirme_post);
router.get("/download-1degerlendirme",isAuth,userControllers.downloadstaj1degerlendirme);

router.get("/views/ogrenci/ogrencistaj1rapor.html",isAuth,userControllers.ogrencistaj1rapor_get);
router.post("/views/ogrenci/ogrencistaj1rapor.html",fileUpload.upload.single("stajRaporu"),isAuth, userControllers.ogrencistaj1rapor_post);
router.get("/download-1rapor",isAuth,userControllers.downloadstaj1rapor);

router.get("/views/ogrenci/profilOgrenci",isAuth,userControllers.profilOgrenci_get);


router.get("/pdfstaj1",isAuth,userControllers.staj1pdf_get);


module.exports = router;


