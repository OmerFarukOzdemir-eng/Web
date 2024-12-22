const db = require("../data/db.js");
const stajkayit = require("../models/stajkayit.js");
const stajtipi = require("../models/stajtipi.js");
const stajbelgeler = require("../models/stajbelgeler.js");
const sunum = require("../models/sunum.js");
const kullanici = require("../models/kullanici.js");
const stajdegerlendirme = require("../models/stajdegerlendirme.js");
const stajdurum = require("../models/stajdurum");
const path = require("path");

const config = require("../config/config.js");

const erisim_get = async function (req, res) {
    try {
        res.sendFile(path.join(__dirname, "../views/ogretmen/goruntuleme.html"));
    } catch (err) {
        console.error(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

const degerlendirogretmen_get = async function (req, res) {
    const kullaniciNumaraOgretmen = req.session.kullaniciNumara;

    try {
        const sunumAra1 = await sunum.findAll({
            where: { kullaniciNumaraOgretmen: kullaniciNumaraOgretmen },
        });
        const stajTipi = await stajtipi.findAll();

        res.render("/views/ogretmen/degerlendirogretmen.html", {
            stajTipi,
            sunum: sunumAra1,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

const degerlendirogretmen_post = async function (req, res) {
    const kullaniciNumaraOgretmen = req.session.kullaniciNumara;
    const { kullaniciNumara, stajTipiID, durum, onaylananGun, eksikGun } = req.body;

    try {
        const kullaniciKontrol = await kullanici.findOne({ where: { kullaniciNumara } });

        if (!kullaniciKontrol) {
            return res.render("/views/ogretmen/degerlendirogretmen.html", {
                message: "Kullanıcı numarasına ait kayıt bulunamadı!",
                renk: "danger",
            });
        }

        const stajTipi = await stajtipi.findAll();
        const sunumAra1 = await sunum.findAll({ where: { kullaniciNumaraOgretmen } });
        const stajTipiAdi = await stajtipi.findOne({ where: { stajTipiID } });
        const durumAdi = await stajdurum.findOne({ where: { durumID: durum } });

        if (eksikGun > 0 && durum == 7) {
            return res.render("/views/ogretmen/degerlendirogretmen.html", {
                stajTipi,
                sunum: sunumAra1,
                message: "Eksik gün var ise staj durum geçti olamaz!",
                renk: "danger",
            });
        }

        if (eksikGun > onaylananGun) {
            return res.render("/views/ogretmen/degerlendirogretmen.html", {
                stajTipi,
                sunum: sunumAra1,
                message: "Eksik gün sayısı onaylanan gün sayısından büyük olamaz!",
                renk: "danger",
            });
        }

        if (eksikGun == 0 && durum != 7) {
            return res.render("/views/ogretmen/degerlendirogretmen.html", {
                stajTipi,
                sunum: sunumAra1,
                message: "Eksik yok ise staj durumu; kaldı veya eksik gün var olamaz!",
                renk: "danger",
            });
        }

        const degerlendirmeAra = await stajdegerlendirme.findOne({
            where: { kullaniciNumara, stajTipiID },
        });

        if (degerlendirmeAra) {
            degerlendirmeAra.kullaniciNumara = kullaniciNumara;
            degerlendirmeAra.stajTipiID = stajTipiID;
            degerlendirmeAra.durumID = durum;
            degerlendirmeAra.onaylananGun = onaylananGun;
            degerlendirmeAra.eksikGun = eksikGun;
            await degerlendirmeAra.save();

            return res.render("/views/ogretmen/degerlendirogretmen.html", {
                stajTipi,
                sunum: sunumAra1,
                message: "Değerlendirme Güncellendi",
                renk: "success",
            });
        }

        await stajdegerlendirme.create({
            kullaniciNumara,
            stajTipiID,
            durumID: durum,
            onaylananGun,
            eksikGun,
        });

        res.render("/views/ogretmen/degerlendirogretmen.html", {
            stajTipi,
            sunum: sunumAra1,
            message: "Değerlendirme Başarılı!",
            renk: "success",
        });
    } catch (err) {
        console.error(err);
        res.render("/views/ogretmen/degerlendirogretmen.html", {
            message: "Hatalı İşlem!",
            renk: "danger",
        });
    }
};

const profilOgretmen_get = async function (req, res) {
    try {
        const ogretmenstajkayittable = await stajkayit.findAll();
        res.render("/views/ogretmen/profilOgretmen.html", {
            stajdegerlendirme: ogretmenstajkayittable,
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

const ogretmenbelgegor_get = async function (req, res) {
    try {
        const stajTipi = await stajtipi.findAll();
        res.render("/views/ogretmen/belgelerogretmen.html", {
            stajTipi,
            kullaniciNumarasi: "---------",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

const ogretmenbelgegor_post = async function (req, res) {
    const { kullaniciNumarasi, stajTipiSecim } = req.body;
    const stajTipi = await stajtipi.findAll();

    try {
        const stajbelgelerara = await stajbelgeler.findOne({
            where: { kullaniciNumara, stajTipiID: stajTipiSecim },
        });

        if (stajbelgelerara) {
            const { basvuruForm, degerlendirmeFormu, stajRaporu } = stajbelgelerara;

            return res.render("/views/ogretmen/belgelerogretmen.html", {
                kullaniciNumarasi,
                stajTipi,
                basvuruForm,
                degerlendirmeFormu,
                stajRaporu,
                secim: stajTipiSecim,
            });
        }

        res.render("/views/ogretmen/belgelerogretmen.html", {
            stajTipi,
            message: "Kullanıcı staj bilgisi bulunamadı.",
            renk: "danger",
        });
    } catch (err) {
        console.error(err);
        res.status(500).send("Bir hata oluştu.");
    }
};

// İlgili dosya indirme işlevleri için aynı mantıkla düzenlemeler yapılabilir

module.exports = {
    profilOgretmen_get,
    degerlendirogretmen_get,
    degerlendirogretmen_post,
    ogretmenbelgegor_get,
    ogretmenbelgegor_post,
    // diğer indirme işlevlerini buraya ekleyebilirsiniz
    erisim_get,
};
