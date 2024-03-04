import axios from 'axios';
export default async function getFeaturedProduct(featuredProductId) {
    try {
        const response = await axios.get("/api/products?id=" + featuredProductId)
        return response;

    } catch (error) {
        console.log(error);
    }
}