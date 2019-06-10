import { HttpClient } from "./http-client";

const http = new HttpClient({
    baseUrl: "https://beta.elderosity.com"
})

export default  {
    login: async (username, password) => {
        // connect to get api token
    },
    refreshToken: () => {

    }


}
