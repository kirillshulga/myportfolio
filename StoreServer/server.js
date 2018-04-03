const express         = require('express');
const MongoClient     = require('mongodb').MongoClient;
const mustacheExpress = require('mustache-express');
const bodyParser      = require('body-parser');
const db              = require('./config/db');
//const session         = require('express-session');
const app             = express();
const port            = 8000;

app.engine('mustache', mustacheExpress());
app.set('view engine', 'mustache');
app.set('views', 'views');

//app.use(session({
//    secret: "tobeornottobe",
//    name: "views",
//    cookie: { secure:true, httpOnly: true, maxAge:60000}
//}))

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

MongoClient.connect(db.url, (err, database) => {
  if (err) return console.log(err)
  require('./app/routes')(app, database);
  app.listen(port, () => {
    console.log('We are live on ' + port);
  });               
})
