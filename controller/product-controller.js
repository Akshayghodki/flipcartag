import Product from '../model/product-schema.js';

export const getProducts = async (request, response) => {
    try {
        const products = await Product.find({});
        response.status(200).json(products);
    } catch (error) {
        response.status(500).json({ message: error.message });
    }
};

export const getProductById = async (request, response) => {
    try {
        const products = await Product.findOne({ 'id': request.params.id });
        response.status(200).json(products);
    }catch (error) {
        response.status(500).json({message : error.message})
    }
}



// import { response } from 'express';
// import Product from '../model/product-schema.js'

// export const getProducts = async() => {
// try {
//     const products = await Product.find({});

//     response.status(200).json(products);
// } catch (error) {
//   response.status(500).json({message : error.message});
// }
// }