import test from "node:test";
import assert from "node:assert/strict";
import axios from "axios";
import getLatestProducts from "../src/lib/getLatestProducts.js";
import getFeaturedProduct from "../src/lib/getFeaturedProduct.js";

test("fetch helpers return usable data, including an empty catalog", async () => {
    const original = axios.defaults.adapter;
    try {
        axios.defaults.adapter = async () => ({ data: { products: [] } });
        assert.deepEqual(await getLatestProducts(), []);
        const product = { _id: "65e0e41de24fe35cc0b6dc08", title: "Demo" };
        axios.defaults.adapter = async () => ({ data: { product } });
        assert.deepEqual(await getFeaturedProduct(product._id), product);
    } finally { axios.defaults.adapter = original; }
});

test("failed requests reach the component instead of returning undefined", async () => {
    const original = axios.defaults.adapter;
    try {
        const error = new Error("Network unavailable");
        axios.defaults.adapter = async () => { throw error; };
        await assert.rejects(getLatestProducts(), error);
        await assert.rejects(getFeaturedProduct("missing"), error);
        const missing = new axios.AxiosError("Not found", undefined, undefined, undefined, { status: 404 });
        axios.defaults.adapter = async () => { throw missing; };
        await assert.rejects(getFeaturedProduct("missing"), value => value.response.status === 404);
    } finally { axios.defaults.adapter = original; }
});

test("malformed successful responses are reported as errors", async () => {
    const original = axios.defaults.adapter;
    try {
        axios.defaults.adapter = async () => ({ data: {} });
        await assert.rejects(getLatestProducts(), /Invalid product response/);
        await assert.rejects(getFeaturedProduct("missing"), /Invalid product response/);
    } finally { axios.defaults.adapter = original; }
});

test("requests have a timeout and support cancellation on navigation", async () => {
    const original = axios.defaults.adapter;
    const controller = new AbortController();
    try {
        axios.defaults.adapter = async config => {
            assert.equal(config.signal, controller.signal);
            assert.equal(config.timeout, 15000);
            return { data: { products: [], product: { _id: "demo" } } };
        };
        await getLatestProducts(controller.signal);
        await getFeaturedProduct("demo", controller.signal);
        controller.abort();
        await assert.rejects(getLatestProducts(controller.signal), error => axios.isCancel(error));
        await assert.rejects(getFeaturedProduct("demo", controller.signal), error => axios.isCancel(error));
    } finally { axios.defaults.adapter = original; }
});
