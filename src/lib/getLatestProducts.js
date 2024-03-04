import axios from 'axios';
export default async function getLatestProducts() {
    try {
        const response = await axios.get("/api/products")
        return response;

    } catch (error) {
        console.log(error);
    }
}