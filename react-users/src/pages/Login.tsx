import React, {SyntheticEvent, useState} from 'react';
import '../Login.css';
import axios from 'axios';
import {Redirect} from "react-router-dom";
import { useHistory } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase';
import {User} from "../models/user";
import { connect } from 'react-redux';
import { setUser } from '../redux/actions/setUserAction';

const mapDispatchToProps = (dispatch: any) => ({
  setUser: (user:User) => dispatch(setUser(user))
});

const Login = (props: any) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [redirect, setRedirect] = useState(false);
    const history = useHistory(); // useHistory to redirect

    const submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        try {
            if (email.trim().length !== 0 && password.trim().length != 0){
              signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                  // Usuario autenticado
                  const user = userCredential.user;

                  const userData:User = {
                    uid: user.uid, // ID único del usuario
                    first_name: user.displayName,
                    last_name:  "", // Firebase no provee el apellido, necesitarás un método para establecerlo
                    email: user.email, // Email del usuario
                    provider: user.providerData[0].providerId, // Proveedor de autenticación (e.g., 'password', 'google.com')                   
                    revenue:0
                  };
                  props.setUser(userData);
                  history.push('/');
                  user.getIdToken().then((tokenId) => {                                       
                  
/*        
                    axios({
                        method: 'post',
                        url: '/api/auth/login',
                        baseURL: process.env.REACT_APP_AUTH_MS_BASE_URL,
                        data:{
                            tokenId: tokenId
                        }                    
                      })
                    .then(response => {                      
                      history.push('/'); // Redireccionar al home después del login exitoso
                    })
                    .catch(error => {
                      console.error('Error:', error);
                    });
              */
                  }).catch((error) => {
                    console.error("Error getting thetoken ID", error);
                  });
                })
                .catch((error) => {
                  console.error("Error on auth", error);
                });
            }
        } catch (error) {
            console.error("Auth issue", error);
        }        
    }

    return (
        <main className="form-signin">
            <form onSubmit={submit}>
                <h1 className="h3 mb-3 fw-normal">Please sign in</h1>

                <div className="form-floating">
                    <input type="email" className="form-control" id="floatingInput" placeholder="name@example.com"
                           onChange={e => setEmail(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating">
                    <input type="password" className="form-control" id="floatingPassword" placeholder="Password"
                           onChange={e => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingPassword">Password</label>
                </div>

                <button className="w-100 btn btn-lg btn-primary" type="submit">Sign in</button>
            </form>
        </main>
    );
};

//export default Login;
export default connect(null, mapDispatchToProps)(Login);