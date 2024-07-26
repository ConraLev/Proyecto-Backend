const express = require('express');
const handlebars = require('express-handlebars');
const passport = require('passport');
const path = require('path');
const cookieParser = require('cookie-parser');
const config = require('./config/config');
const initializeStrategy = require('./config/passport.config');
const initializeStrategyGit = require('./config/passport-github.config');
const sessionMiddleware = require('./sessions/mongoStorage');
const logger = require('./utils/logger');
const initializeWsServer = require('./routers/wsServer.Router');

const { errorHandler } = require('./services/errors/errorHandler');
const { createDAO: createProductDAO } = require('./dao/products');
const { createDAO: createCartDAO } = require('./dao/carts');
const { createDAO: createSessionDAO } = require('./dao/sessions');
const { createDAO: createViewsDAO } = require('./dao/views');
const { ProductService } = require('./services/Product.Service');
const { CartService } = require('./services/cart.Service');
const { SessionService } = require('./services/Session.Service');
const { ViewsService } = require('./services/views.Service');
const { ProductController } = require('./controllers/product.Controller');
const { CartController } = require('./controllers/cart.Controller');
const { SessionController } = require('./controllers/session.Controller');
const { ViewsController } = require('./controllers/views.Controller');
const { title } = require('process');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(sessionMiddleware);
app.use(errorHandler); 

const swaggerOptions = {
    definition: {
        openapi: '3.0.1',
        info:{
            title: 'eCommerce API Documentation',
            description: 'API documentation for the eCommerce project'
        }
    },
    apis: [
        `${__dirname}/docs/**/*.yaml`
        ]
}

const specs = swaggerJSDoc(swaggerOptions);
app.use('/apidocs', swaggerUi.serve, swaggerUi.setup(specs));

const httpServer = app.listen(config.PORT, (err) => {
    if (err) {
        logger.error(`Error al iniciar el servidor: ${err.message}`);
        return;
    }
    logger.info(`Servidor escuchando en http://localhost:${config.PORT}`);
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
    app.set('cartService', cartService); 
    app.set('sessionController', sessionController);
    app.set('viewsController', viewsController);
    app.set('cartController', cartController);

    const routes = [
        require('./routers/products.Router'),
        require('./routers/carts.Router'),
        require('./routers/views.Router'),
        require('./routers/sessions.Router'),
        require('./routers/users.Router') 
    ];

    for (const route of routes) {
        route.configure(app);
    }
})();

module.exports = app;

