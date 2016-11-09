import express = require('express');
import {WebApi} from './server/api';


export = function () {
    let port = process.env.PORT || 4390;
    let api = new WebApi(express(), port);
    api.run();
}