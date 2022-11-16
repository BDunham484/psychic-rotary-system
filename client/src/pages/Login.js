import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../utils/mutations";
// import AUTH from '../utils/auth';

const Login = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });

    const [login, { error }] = useMutation(LOGIN_USER);

    //update state based on form input changes
    const handleChange = (event) => {
        const { name, value } = event.target;
        
        setFormState({
            ...formState,
            [name]: value,
        });
    };

    //submit form
    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            const { data } = await login({
                variables: { ...formState }
            });
            console.log(data);
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className='page-wrapper'>
            <form onSubmit={handleFormSubmit}>
                <input 
                placeholder='Your email'
                name='email'
                type='email'
                id='email'
                value={formState.email}
                onChange={handleChange}
                />
                <input 
                placeholder='******'
                name='password'
                type='password'
                id='password'
                vlaue={formState.passwod}
                onChange={handleChange}
                />
                <button type='submit'>Submit</button>
                {error && <div>Login Failed</div>}
            </form>
        </div>
    )
}

export default Login;