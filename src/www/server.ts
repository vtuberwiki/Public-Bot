import { Client } from "discord.js";
import express from "express";

const server = express();

export default async function webServer (client: Client) {

    server.listen(45600);
}