import React, {Component, SyntheticEvent} from 'react';
import {Redirect} from 'react-router-dom';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../firebase'; 
import { log } from 'console';
import { axiosAuthApi } from '../axios/axiosInstances';

class Register extends Component {
    firstName = '';
    lastName = '';
    email = '';
    password = '';
    passwordConfirm = '';
    state = {
        redirect: false,
        notify: {
            show: false,
            message: '',
            isError: false
        }
    };   
    setNotify = (show:boolean, isError: boolean = false, message:any) => {
        this.setState({
            notify: {
                show: show,
                message: message,
                isError: isError
            }
        });
        
        // hide notification after 3s
        setTimeout(() => {
            this.setState({
                notify: {
                    show: false,
                    message: '',
                    isError: false
                }
            });
        }, 3000);
    };


    submit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (this.password.trim().length === 0 || this.passwordConfirm.trim().length === 0 || 
        this.email.trim().length === 0 ) {
            console.log("Passwords and email can not be empt")
            this.setNotify(true, true, "Passwords and email can not be empty");
            return;
        }

        if (this.password !== this.passwordConfirm) {
            console.error("Passwords do not match");
            this.setNotify(true, true, "Passwords do not match");
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                this.email,
                this.password
            );
            const user = userCredential.user;

            await updateProfile(user, {
                displayName: `${this.firstName}`
            });
                      
            axiosAuthApi.post('register',{
                first_name: this.firstName,
                    last_name: this.lastName,
                    email:this.email,                    
                    uid: user.uid,
                    provider:user.providerId
            }).then(response => {
                console.log('Success from auth-ms:', response.data);                 
              });
            this.setState({
                redirect: true
            });
        } catch (err:any) {
            console.error('Registration error:', err);
            this.setNotify(true, true, err.message  || "Failed to register");
        }
    }

    render() {
        if (this.state.redirect) {
            return <Redirect to={'/login'}/>;
        }

        return (
            <main className="form-signin">
                <form onSubmit={this.submit}>
                    <h1 className="h3 mb-3 fw-normal">Please register</h1>

                    <div className="form-floating">
                        <input className="form-control" placeholder="First Name"
                               onChange={e => this.firstName = e.target.value}
                        />
                        <label>First Name</label>
                    </div>

                    <div className="form-floating">
                        <input className="form-control" placeholder="Last Name"
                               onChange={e => this.lastName = e.target.value}
                        />
                        <label>Last Name</label>
                    </div>

                    <div className="form-floating">
                        <input type="email" className="form-control" placeholder="name@example.com"
                               onChange={e => this.email = e.target.value}
                        />
                        <label>Email address</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Password"
                               onChange={e => this.password = e.target.value}
                        />
                        <label>Password</label>
                    </div>

                    <div className="form-floating">
                        <input type="password" className="form-control" placeholder="Password Confirm"
                               onChange={e => this.passwordConfirm = e.target.value}
                        />
                        <label>Password Confirm</label>
                    </div>

                    <button className="w-100 btn btn-lg btn-primary" type="submit">Submit</button>
                </form>
            </main>
        );
    }
}

export default Register;
