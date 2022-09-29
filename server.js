const  express = require('express');
const  env = require('dotenv').config()
const  ejs = require('ejs');
const  path = require('path');
const  app = express();
const  bodyParser = require('body-parser');
const  mongoose = require('mongoose');
const  session = require('express-session');
const  MongoStore = require('connect-mongo')(session);  
// const fileUpload = require('express-fileupload');
// const  morgan= require('morgan');
const  methodoverride  = require('method-override')
app.use(methodoverride('_method'))
const multer = require('multer');
const flash = require('connect-flash')
const passport = require('passport')
const {initializingPassport} = require('./config/passportConfig.js')
// global.__basedir = __dirname + "/..";
// const DB = "mongodb+srv://Mindbrick:password@mindbrick.zdiyp2p.mongodb.net/employe/?retryWrites=true&w=majority"
// const DB="mongodb://localhost:27017/swapnil"
// const db= "mongodb+srv://<DB_USER_NAME>:<DB_PASSWORD>@cluster0-vatbg.mongodb.net/registrationFormHeruko?retryWrites=true&w=majority"
// const DB= "mongodb+srv://shu810:shu810@cluster0.xpyca.mongodb.net/swapnil?retryWrites=true&w=majority"
const DB= "mongodb+srv://Mindbrick:Password@mindbrick.zdiyp2p.mongodb.net/swapnil?retryWrites=true&w=majority"

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}, (err) => {
  if (!err) {
    console.log('MongoDB Connection Succeeded.');
  } else {
    console.log('Error in DB connection : ' + err);
  }
});

const  db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
});
app.use(session({
  secret: 'work hard',
  resave: true,
  saveUninitialized:false,                                              
  store: new MongoStore({
    mongooseConnection: db,
    auto_reconnect: true,
    cookie: {maxAge:1000*60*60*24}
  })
}));
initializingPassport(passport)
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())
app.use(function(req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');	
// app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static(__dirname + '/views'));
// app.use(express.static(`${__dirname}/upload`));
app.set('view engine', 'ejs');
require('./routes/admin')(app)
require('./routes/index')(app)
require('./routes/project')(app)



app.use(function (req, res, next) {
  const  err = new Error('File Not Found');
  err.status = 404;
  next(err);
});

// error handler
// define as the last app.use callback
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.send(err.message);
});


const PORT = process.env.PORT || 3000;
const baseurl = "https://iding.herokuapp.com/"
app.listen(PORT, function () {
  console.log('Server is started on http://127.0.0.1:'+baseurl+PORT);
});




