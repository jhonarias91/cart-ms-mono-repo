import React, {Dispatch, SyntheticEvent, useEffect, useState} from 'react';
import Layout from "../components/Layout";
import {connect} from "react-redux";
import {User} from "../models/user";
import {setUser} from "../redux/actions/setUserAction";
import { axiosUsersApi } from '../axios/axiosInstances';
import { getAuth } from "firebase/auth";
import { auth } from '../firebase'; 
import { updatePassword } from "firebase/auth";
import { useHistory } from "react-router-dom";
import * as firebaseAuth from 'firebase/auth';

const Profile = (props: any) => {
    const history = useHistory(); 
    const [first_name, setFirstName] = useState('');
    const [last_name, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password_confirm, setPasswordConfirm] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [error, setError] = useState('');


    useEffect(() => {
        setFirstName(props.user.first_name);
        setLastName(props.user.last_name);
        setEmail(props.user.email);
    }, [props.user]);


    const infoSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();
       var someChange: boolean = false;

        /**
         Update on firebase
         */
         if (email !== props.user.email) {
            someChange = true;
            try {                
                const authUser = auth.currentUser;
                if (authUser) {
                    await firebaseAuth.updateEmail(authUser, email);
                    setError('');
                    setSuccessMessage("Email updated!");
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.error?.message || "Failed to update email. Please try again.";
                console.error(errorMessage);
                setError(errorMessage);
                setSuccessMessage('');
            }   
            
            const updatedUser = {
                ...props.user,
                email: email  
            };
            props.setUser(updatedUser); // Dispatch the action to update user in Redux
        }
        if (first_name !== props.user.first_name || last_name !== props.user.last_name ) {
            someChange = true;
            try {                
                const authUser = auth.currentUser;
                if (authUser) {
                    await firebaseAuth.updateProfile(authUser, { 
                        displayName: `${first_name} - ${last_name}`
                      }); 
                    setError('');
                    setSuccessMessage("Name and last name updated in Firebase");
                    const updatedUser = {
                        ...props.user,
                        first_name: first_name,
                        last_name: last_name
                    };
                }
            } catch (error: any) {
                const errorMessage = error.response?.data?.error?.message || "Failed to update name. Please try again.";
                console.error(errorMessage);
                setError(errorMessage);
                setSuccessMessage('');
            }               
        }

        if (!someChange){
            setError('No info was changed!');
            setSuccessMessage('');
        }
/*
        const {data} = await axiosUsersApi.put('info', {
            first_name,
            last_name,
            email
            props.setUser(data);
        });
*/
        
    }

    const passwordSubmit = async (e: SyntheticEvent) => {
        e.preventDefault();

        if (password !==password_confirm) {
            console.error("Passwords do not match");  
            setError('Passwords do not match');
            setSuccessMessage('');          
            return;
        }
        const user = auth.currentUser;

        if (user) {
            try {
              await updatePassword(user, password);
                console.log("Password updated");                
                props.setUser(null); 
                localStorage.removeItem('firebaseToken');
                history.push('/');
            } catch (error: any) {
               const errorMessage = error.response?.data?.error?.message || "Failed to update password. Please try again.";
               console.log(errorMessage);              
               setError(errorMessage);
               setSuccessMessage('');
            }
          } else {
            console.log("Password updated");            
          }

        /*
        await axiosUsersApi.put('password', {
            password,
            password_confirm
        })
        */
    }

    return (
        <Layout>
            <h3>Account Information</h3>
            <form onSubmit={infoSubmit}>
                <div className="mb-3">
                    <label>First Name</label>
                    <input className="form-control"
                           defaultValue={first_name} onChange={e => setFirstName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Last Name</label>
                    <input className="form-control"
                           defaultValue={last_name} onChange={e => setLastName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Email</label>
                    <input className="form-control"
                           defaultValue={email} onChange={e => setEmail(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline-secondary" type="submit">Submit</button>
            </form>
            {error && <p className="text-danger">{error}</p>}
            {successMessage && <p className="text-success">{successMessage}</p>}
            <h3 className="mt-4">Change Password</h3>
            <form onSubmit={passwordSubmit}>
                <div className="mb-3">
                    <label>Password</label>
                    <input className="form-control"
                           onChange={e => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label>Password Confirm</label>
                    <input className="form-control"
                           onChange={e => setPasswordConfirm(e.target.value)}
                    />
                </div>
                <button className="btn btn-outline-secondary" type="submit">Submit</button>
            </form>
        </Layout>
    );
};

export default connect(
    (state: { user: User }) => ({
        user: state.user
    }),
    (dispatch: Dispatch<any>) => ({
        setUser: (user: User) => dispatch(setUser(user))
    })
)(Profile);
