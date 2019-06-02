import { HttpClient } from "./http-client";
import { getSystemConfig } from "../../front/store/system";

const {nonce, apiRoot} = getSystemConfig();

const wpRestClient = new HttpClient({
    baseUrl: apiRoot,
    credentials: 'same-origin',
    headers: {
        common: {
            'X-WP-Nonce': nonce.api
        }
    }
});


export default wpRestClient;
