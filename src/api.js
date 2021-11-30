import axios from 'axios';
import config from "../config/config.json";

const api = axios.create({
  baseURL: config.hostAPI
});

module.exports = {api};