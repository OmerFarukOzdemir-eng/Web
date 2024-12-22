const express = require('express');
const app = express();
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const Kullanici = require('./models/kullanici.js');
const ogretmenRoutes = require('./routes/ogretmen.js');
const userRoutes = require('./routes/users.js');
const authRoutes = require('./routes/auth.js');
const sequelize = require('./data/db.js');
const locals = require('./middlewares/locals.js');
const cors = require('cors');

// CORS ayarı
app.use(cors());

// Template engine
app.set('view engine', 'ejs'); // Eğer ejs kullanıyorsanız

// Middleware
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(
  session({
    secret: 'hello world',
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60,
    },
    store: new SequelizeStore({
      db: sequelize,
    }),
  })
);

// Statik dosya yolları
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'node_modules')));

// Routes
app.use('/views/ogretmen', ogretmenRoutes);
app.use('/views/ogrenci', userRoutes);
app.use('/', authRoutes);

// Veritabanı senkronizasyonu
sequelize.sync({ force: false })
  .then(() => {
    console.log('Database synchronized');
  })
  .catch((err) => {
    console.error('Unable to sync database:', err);
  });

// Sunucu başlatma
app.listen(3000, () => {
  console.log('listening on port 3000');
});
