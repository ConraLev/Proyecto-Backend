// const express = require('express');
// const handlebars = require('express-handlebars');
// const passport = require('passport');
// const path = require('path');
// const cookieParser = require('cookie-parser');
// const config = require('./config/config');
// const initializeStrategy = require('./config/passport.config');
// const initializeStrategyGit = require('./config/passport-github.config');
// const initializeWsServer = require('./routers/wsServer.Router');
// const sessionMiddleware = require('./sessions/mongoStorage');

// const { createDAO: createProductDAO } = require('./dao/products');
// const { createDAO: createCartDAO } = require('./dao/carts');
// const { createDAO: createSessionDAO } = require('./dao/sessions');
// const { ProductService } = require('./services/Product.Service');
// const { CartService } = require('./services/Cart.Service');
// const { SessionService } = require('./services/session.Service')
// const { ProductController } = require('./controllers/Product.Controller');
// const { CartController } = require('./controllers/Cart.Controller');
// const { SessionController } = require('./controllers/Session.Controller');

// const app = express();
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());
// app.use(sessionMiddleware);

// const httpServer = app.listen(config.PORT, () => {
//     console.log(`Servidor escuchando en http://localhost:${config.PORT}`);
// });

// const wsServer = initializeWsServer(httpServer);
// app.set('ws', wsServer);
// app.use(express.static(path.join(__dirname, '../public')));

// app.engine('handlebars', handlebars.engine());
// app.set('view engine', 'handlebars');
// app.set('views', path.join(__dirname, '../views'));

// initializeStrategy();
// initializeStrategyGit();
// app.use(passport.initialize());
// app.use(passport.session());

// (async () => {
//     const productDAO = await createProductDAO();
//     const productService = new ProductService(productDAO);
//     const productController = new ProductController(productService);

//     const cartDAO = await createCartDAO();
//     const cartService = new CartService(cartDAO);
//     const cartController = new CartController(cartService);

//     const sessionDAO = await createSessionDAO('mongo');
//     const sessionService = new SessionService(sessionDAO);
//     const sessionController = new SessionController(sessionService);

//     app.set('productController', productController);
//     app.set('cartController', cartController);
//     app.set('sessionController', sessionController);

//     const routes = [
//         require('./routers/products.Router'),
//         require('./routers/carts.Router'),
//         require('./routers/views.Router'),
//         require('./routers/sessions.Router')
//     ];

//     for (const route of routes) {
//         route.configure(app);
//     }
// })();

// module.exports = app;

const express = require('express');
const handlebars = require('express-handlebars');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const initializeStrategy = require('./config/passport.config');
const initializeStrategyGit = require('./config/passport-github.config');
const initializeWsServer = require('./routers/wsServer.Router');
const sessionMiddleware = require('./sessions/mongoStorage');

const { createDAO: createProductDAO } = require('./dao/products');
const { createDAO: createCartDAO } = require('./dao/carts');
const { createDAO: createSessionDAO } = require('./dao/sessions');
const { createDAO: createViewsDAO } = require('./dao/views');
const { ProductService } = require('./services/Product.Service');
const { CartService } = require('./services/cart.Service');
const { SessionService } = require('./services/Session.Service');
const { ViewsService } = require('./services/Views.Service');
const { ProductController } = require('./controllers/Product.Controller');
const { CartController } = require('./controllers/Cart.Controller');
const { SessionController } = require('./controllers/Session.Controller');
const { ViewsController } = require('./controllers/Views.Controller');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);

const httpServer = app.listen(config.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${config.PORT}`);
});

const wsServer = initializeWsServer(httpServer);
app.set('ws', wsServer);
app.use(express.static(path.join(__dirname, '../public')));

app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, '../views'));

initializeStrategy();
initializeStrategyGit();
app.use(passport.initialize());
app.use(passport.session());

(async () => {
    const productDAO = await createProductDAO();
    const productService = new ProductService(productDAO);
    const productController = new ProductController(productService);

    const cartDAO = await createCartDAO();
    const cartService = new CartService(cartDAO);
    const cartController = new CartController(cartService);

    const sessionDAO = await createSessionDAO('mongo');
    const sessionService = new SessionService(sessionDAO);
    const sessionController = new SessionController(sessionService);

    const viewsDAO = await createViewsDAO();
    const viewsService = new ViewsService(viewsDAO);
    const viewsController = new ViewsController(viewsService);

    app.set('productController', productController);
    app.set('cartController', cartController);
    app.set('sessionController', sessionController);
    app.set('viewsController', viewsController);

    const routes = [
        require('./routers/products.Router'),
        require('./routers/carts.Router'),
        require('./routers/views.Router'),
        require('./routers/sessions.Router')
    ];

    for (const route of routes) {
        route.configure(app);
    }
})();

module.exports = app;
