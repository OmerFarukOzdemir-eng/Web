const bcrypt=require("bcrypt");
const config = require("../config/config.js");
const kullanici = require("../models/kullanici.js");

const loading_get = async function (req, res) {
    try {
        const rol = req.session.rolID;
        if (rol === "ogrenci") {
            return res.redirect("../views/ogrenci/ogrencihome.html");
        } else if (rol === "akademisyen") {
            return res.redirect("../views/ogretmen/belgelerogretmen.html");
        } else {
            return res.status(403).send("Yetkisiz erişim.");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Bir hata oluştu.");
    }
};

const anasayfa_get=async function(req, res) {
    try {
        return res.render("../views/home-login/homepage.html", {
        });
    }
    catch(err) {
        console.log(err);
    }
}

const logout_get=async function(req, res) {
    try {
        await req.session.destroy();
        return res.redirect("/");
    }
    catch(err) {
        console.log(err);
    }
}

const login_get=async function(req, res) {
    try {
        res.render("../views/home-login/homepage.html", {
        });
    }
    catch(err) {
        console.log(err);
    }
}
const login_post = async function (req, res) {
    const { kullanıcıNumarası: numara, kullanıcıSifre: sifre } = req.body;

    try {
        const user = await kullanici.findOne({ where: { kullaniciNumara: numara } });
        if (!user) {
            return res.render("login.html", { message: "Kullanıcı Numarası Hatalı!" });
        }

        const match = await bcrypt.compare(sifre, user.kullaniciParola);
        if (!match) {
            return res.render("login.html", { message: "Şifre Hatalı!" });
        }

        req.session.isAuth = true;
        req.session.rolID = user.rolID;

        // Yönlendirme
        if (user.rolID === "ogrenci") {
            return res.redirect("/ogrenci/ogrencihome.html");  // Öğrenci sayfasına yönlendir
        } else if (user.rolID === "akademisyen") {
            return res.redirect("/ogretmen/belgelerogretmen.html");  // Akademisyen sayfasına yönlendir
        } else {
            return res.status(403).send("Yetkisiz kullanıcı.");
        }
    } catch (err) {
        console.log(err);
        return res.status(500).send("Bir hata oluştu.");
    }
};

const sifreSifirlama_get = async function (req, res) {
    try {
        res.render("../views/home-login/sifresifirlama.html", {});
    } catch (err) {
        console.log(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

const sifreSifirlama_post = async function (req, res) {
    const { kullaniciNumarası: numara, telefonNumarasi: telNo, kullaniciMail: email, yeniKullaniciSifre: yeniSifre, yeniKullaniciSifreTekrar } = req.body;

    try {
        const user = await kullanici.findOne({
            where: { kullaniciNumara: numara, kullaniciTelNo: telNo, kullaniciMail: email },
        });

        if (!user) {
            return res.render("../views/home-login/sifresifirlama.html", {
                message: "Girilen Bilgiler Hatalı!",
                renk: "danger",
            });
        }

        if (yeniSifre !== yeniSifreTekrar) {
            return res.render("../views/home-login/sifresifirlama.html", {
                message: "Girdiğiniz Şifreler Aynı Değil.",
                renk: "danger",
            });
        }

        const hashedPassword = await bcrypt.hash(yeniSifre, 10);
        user.kullaniciParola = hashedPassword;
        await user.save();

        emailService.sendMail({
            from: config.email.from,
            to: user.kullaniciMail,
            subject: "Şifreniz Güncellendi.",
            text: `Şifreniz Başarılı Bir Şekilde Güncellendi. Yeni Şifreniz: ${yeniSifre}`,
        });

        return res.render("../views/home-login/sifresifirlama.html", {
            message: "Şifreniz Güncellendi. Giriş Yapabilirsiniz.",
            renk: "success",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).send("Bir hata oluştu.");
    }
};

module.exports={
    anasayfa_get,
    login_get,
    login_post,
    logout_get,
    sifreSifirlama_get,
    sifreSifirlama_post,
    loading_get
}