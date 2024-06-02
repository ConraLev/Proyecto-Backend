const express = require('express');
const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true }));

const handlebars = require('express-handlebars');
const passport = require('passport');
const config = require('./config/config');
const path = require('path');
const cookieParser = require('cookie-parser');
const initilizeStrategy = require('./config/passport.config');
const initializeStrategyGit = require('./config/passport-github.config');
const initializeWsServer = require('./routers/wsServer.Router');
const sessionMiddleware = require('./sessions/mongoStorage');

app.use(cookieParser())
app.use(sessionMiddleware)


const httpServer = app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${config.PORT}`    );
});

const wsServer = initializeWsServer(httpServer);

app.set('ws', wsServer);
app.use(express.static(`${__dirname}/../public`));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));
       
        
initilizeStrategy();
initializeStrategyGit();
app.use(passport.initialize());
app.use(passport.session()); 
        

const routes = [
    require('./routers/products.Router'),
    require('./routers/carts.Router'),
    require('./routers/views.Router'),
    require('./routers/sessions.Router')
];

for (const route of routes){
    route.configure(app)
}


module.exports = app;