import axios from 'axios';
import config from "../config/index.json";

const api = axios.create({
  baseURL: config.hostAPI
});

module.exports = {api};