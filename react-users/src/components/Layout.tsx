import React, {Dispatch, useEffect, useState} from 'react';
import Nav from "./Nav";
import Header from "./Header";
import {Redirect, useLocation} from "react-router-dom";
import {User} from "../models/user";
import {setUser} from "../redux/actions/setUserAction";
import {connect} from "react-redux";
import { axiosUsersApi } from '../axios/axiosInstances';
import 'firebase/auth';
import { onAuthStateChanged,getAuth } from "firebase/auth";

const Layout = (props: any) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const location = useLocation();

    useEffect(() => {
        (
            async () => {
                try {
        //const {data} = await axiosUsersApi.get('user');
        //props.setUser(data);
        const auth = getAuth(); // Get the Firebase Auth instance
        const token = localStorage.getItem('firebaseToken');
     
        if (token) {
            // Listen for authentication state changes
            const unsubscribe = onAuthStateChanged(auth, (user) => {
                if (user) {
                    setIsLoggedIn(true);

                    const userData:User = {
                        uid: user.uid, // ID único del usuario
                        first_name: user.displayName,
                        last_name:  "", 
                        email: user.email, 
                        provider: user.providerData[0].providerId, 
                        revenue:0
                      };
                      props.setUser(userData);
                      console.log(userData);
                } else {
                    setIsLoggedIn(false);
                }
            });

            // Clean up the listener when the component unmounts
            return () => unsubscribe();
        }
                } catch (e) {
                    console.log(e);
                }
            }
        )();
    }, []);

    let header;

    if (location.pathname === '/' || location.pathname === '/backend') {
        header = <Header/>;
    }

    return (
        <div>
            <Nav/>

            <main>

                {header}

                <div className="album py-5 bg-light">
                    <div className="container">

                        {props.children}

                    </div>
                </div>
            </main>
        </div>
    );
};

const mapStateToProps = (state: { user: User }) => ({
    user: state.user
})

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    setUser: (user: User) => dispatch(setUser(user))
})

export default connect(mapStateToProps, mapDispatchToProps)(Layout);
