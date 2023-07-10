import { client } from "../..";
import { Event } from "../../class/Builders";

export default new Event('ready', async () => {
    console.log('Loggged in as: ' + client.user?.tag);
});