// const { fakerES: faker } = require('@faker-js/faker');

// const generateMockProducts = (count = 100) => {
//     let products = [];
//     for (let i = 0; i < count; i++) {
//         products.push({
//             id: faker.database.mongodbObjectId(),
//             name: faker.commerce.productName(),
//             price: faker.commerce.price(),
//             description: faker.commerce.productDescription(),
//             category: faker.commerce.department(),
//             image: faker.image.imageUrl()
//         });
//     }
//     return products;
// };

// module.exports = generateMockProducts;

const { fakerES: faker } = require('@faker-js/faker');

const generateMockProducts = (count = 100) => {
    let products = [];
    for (let i = 0; i < count; i++) {
        products.push({
            _id: faker.datatype.uuid(),
            name: faker.commerce.productName(),
            price: faker.commerce.price(),
            description: faker.commerce.productDescription(),
            category: faker.commerce.department(),
            image: faker.image.imageUrl()
        });
    }
    return products;
};

module.exports = generateMockProducts;
