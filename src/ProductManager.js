const fs = require('fs');

// Creacion de clase
class ProductManager {
    constructor(path = './products.json') {
        this.path = path
        this.products = [];
        this.loadProduct();
        // Contador para asignar IDs
        this.contadorId = 1;       
    }   

        //Guardar productos en archivo JSON
        async saveProducts() {
            try {
                const data = JSON.stringify(this.products, null, '\t');
                await fs.promises.writeFile(this.path, data);
                console.log('Archivo guardado correctamente');
            } catch (error) {
                console.log('Error al guardar archivo:', error);
            }
        }



        //Cargar productos en archivo JSON

        async loadProduct(){
            try{
                const data = await fs.promises.readFile(this.path, 'utf-8')
                this.products = JSON.parse(data);
            } catch (error){
                console.log('Error al leer el archivo')     
            }
        }

        //Creacion de ID para productos     
        newId() {
            const maxId = this.products.reduce((max, product) => {
                return product.id > max ? product.id : max;
            }, 0);
        
            return maxId + 1;
        }
        


        // Agregar producto
        async addProduct(title, description, price, thumbnail, code, stock,category) {
            if (!title || !description || !price || !thumbnail || !code || !stock || !category ) {
                console.log("Error: Debe completar todos los campos")
                
            }

            // Validar que el código del producto no esté repetido
            if (this.products.some(product => product.code === code)) {
                console.log("Error: El código del producto ya existe");
                
            }


            // Crear un nuevo producto con un ID autoincrementable
            const newProduct = {
                id: this.newId(), 
                title,
                description,
                price,
                thumbnail,
                code,
                stock,
                category
            }

            // Agregar el nuevo producto al arreglo
            this.products.push(newProduct);
            console.log("Producto agregado:", newProduct);
            

            // Agregar el producto al archivo JSON
            await this.saveProducts();
            
        }

        // Obtener todos los productos
        getProducts(){
            return this.products;
        }

        // Obtener un producto por ID
        getProductById(id) {
            const product = this.products.find(product => product.id === id);
            if (product) {
                return product;
            } else {
                console.error("Error: Not found");
            }
        }
    
        // Update de producto
        async updateProduct(id, updatedFields) {
            const index = this.products.findIndex(p => p.id === id);
            if (index !== -1) {
                const updatedProduct = { ...this.products[index] };

            // Se actualizan los campos especificados
               for (const key in updatedFields) {
                   if (key in updatedProduct) {
                      updatedProduct[key] = updatedFields[key];
                   }
                }

            // Se actualiza el producto en el arreglo de productos
            this.products[index] = updatedProduct;

            // Se guarda la actualización en el archivo JSON
            try{
                await this.saveProducts();
                console.log("Producto actualizado:", updatedProduct.title);
            }catch (error){
                console.log("Error al guardar actualizacion")
            }
            } else {
                 console.log("Error: Producto no encontrado");
            }
        }

        // Borrado de un producto por ID
        async deleteProduct(id) {
            const index = this.products.findIndex(i => i.id === id);
            if (index !== -1) {
                this.products.splice(index, 1);
                await this.saveProducts();
                console.log("Producto eliminado con éxito");
            } else {
                console.log(`Error al Eliminar: Producto con id ${id} no encontrado`);
            }
        }
}



module.exports = ProductManager; 





/*
 // Proceso de Testing

 // Creación de la instancia de ProductManager
const productManager = new ProductManager();


// Agregar productos
productManager.addProduct("Casco de moto", "Casco de seguridad para motociclistas", 45000, "Sin imagen", "583921", 25),
productManager.addProduct("Chaqueta de cuero", "Chaqueta de cuero para motociclistas", 70000, "Sin imagen", "740856", 15);
productManager.addProduct("Guantes para moto", "Guantes de protección para motociclistas", 15000, "Sin imagen", "209743", 30);
productManager.addProduct("Botas para moto", "Botas de cuero para motociclistas", 30000, "Sin imagen", "365812", 14);
productManager.addProduct("Pantalones de moto", "Pantalones de protección para motociclistas", 25000, "Sin imagen", "918274", 17);
productManager.addProduct("Kit de limpieza para moto", "Kit completo para mantener tu moto limpia", 4500, "Sin imagen", "472630", 50);
productManager.addProduct("Aceite para moto", "Aceite de motor de alta calidad para motocicletas", 9000, "Sin imagen", "185943", 42);
productManager.addProduct("Candado para moto", "Candado de seguridad para motocicletas", 5000, "Sin imagen", "694127", 15);
productManager.addProduct("Cubremanos para moto", "Accesorio para proteger las manos del frío y el viento", 3000, "Sin imagen", "530871", 20);
productManager.addProduct("Protector de tanque", "Protector adhesivo para evitar rayones en el tanque de la moto", 5000, "Sin imagen", "817436", 40);
 */





