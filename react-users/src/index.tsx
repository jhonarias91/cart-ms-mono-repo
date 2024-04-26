import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import axios from "axios";
import {configureStore} from "./redux/configureStore";
import {Provider} from "react-redux";
import dotenv from 'dotenv';

dotenv.config();

const usersMsBase = process.env.REACT_APP_USERS_MS_BASE_URL;
axios.defaults.baseURL = `${usersMsBase}/api/users`;

axios.defaults.withCredentials = true;

const store = configureStore()

ReactDOM.render(
    <React.StrictMode>
        <Provider store={store}>
            <App/>
        </Provider>
    </React.StrictMode>,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
