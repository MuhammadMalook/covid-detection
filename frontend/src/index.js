import React from 'react'
import ReactDOM from 'react-dom';
import {Provider} from "react-redux";
import store from './redux/store';

import App from './app'
import "./App.css"
import "bootstrap/dist/css/bootstrap.min.css"
import 'bootstrap/dist/js/bootstrap.bundle';
ReactDOM.render(
<Provider store={store}>
    <App/>
</Provider>
, document.getElementById('root'))
