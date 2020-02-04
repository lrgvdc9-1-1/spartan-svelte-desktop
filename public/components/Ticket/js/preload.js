window.ipc = require('electron').ipcRenderer;
window.api = require('../../../configurations/api');
window.db  = require("../../../configurations/db");
window.client_status = false;
const {Pool} = require('pg');
window.Pool = Pool;

