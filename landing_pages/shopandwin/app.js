const mongoose = require('mongoose');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
//session
cookieSession = require('cookie-session');

//connect mongodb
mongoose.connect("mongodb://dom:rnJFYkOodIO7ujUoC7yWFJclY4XKbqlh9amWTkqPNN8m4fONpQDrOuPGgl0lYzFn2jmFDL2xET4ThgdTjuX0fA%3D%3D@dom.documents.azure.com:10255/dom_shop_and_win_abril_landingpage?ssl=true&replicaSet=globaldb", { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function callback () {
  console.log("DB is connected");
});
//controller
const api = require('./api');

//app uses
app.use(express.json());
app.use(cookieSession({ secret: '112jhsd8a783eh1jqjdhwe', name: 'dom_diwali_landingpage'})); //use sessions for Auth
app.use(express.static(`${__dirname}/dist/diwali/`));
app.use('/api', api);
app.use('/', (req, res, next)=>res.status(200).sendFile(`${__dirname}/dist/diwali/index.html`));


app.listen(port, ()=>console.log('Bism Allah, server running on port 3000'));