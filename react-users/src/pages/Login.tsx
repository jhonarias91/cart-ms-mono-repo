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
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

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
                    last_name:  "", 
                    email: user.email, 
                    provider: user.providerData[0].providerId, 
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

      //Google auth
    const signInWithGoogle = async () => {
      const provider = new GoogleAuthProvider();
      try {
        const userCredential = await signInWithPopup(auth, provider);
        const user = userCredential.user;
  
        const userData: User = {
          uid: user.uid,
          first_name: user.displayName,
          last_name: "",
          email: user.email,
          provider: user.providerData[0].providerId,
          revenue: 0
        };
  
        props.setUser(userData);
        console.log(userData);
        history.push('/');
      } catch (error) {
        console.error("Error on auth", error);
      }
    };
  
    //end Google

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
                <button
                  className="btn btn-lg btn-google"
                  onClick={signInWithGoogle}
                  style={{
                    maxWidth: '50px', 
                    width: 'auto', 
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '10px auto', 
                    padding: '0.375rem 0.75rem', 
                  }}
                >
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/120px-Google_%22G%22_logo.svg.png?20230822192911"
                alt="Google Icon"
                style={{ marginRight: '10px' }}
              />
              Sign in with Gooogle
      </button>
                
            </form>
        </main>
    );
};

//export default Login;
export default connect(null, mapDispatchToProps)(Login);