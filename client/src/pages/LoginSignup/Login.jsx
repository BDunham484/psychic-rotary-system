// @ts-ignore
import styles from './LoginSignup.module.css';
import { useState } from "react";
import { useMutation } from "@apollo/client";
import { LOGIN_USER } from "../../utils/mutations";
import Auth from '../../utils/auth';
import FormCard from "../../components/shared/FormCard/FormCard";

const Login = () => {
    const [formState, setFormState] = useState({ email: '', password: '' });
    const {
        loginSignupWrapper,
        loginSignupForm,
        loginSignupHeader,
        loginSignupFormLabel,
        formDiv,
        loginSignupInput,
        loginSignupButton,
    } = styles;

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

            Auth.login(data.login.token);
        } catch (e) {
            console.error(e);
        }
    };


    return (
        <div className={loginSignupWrapper}>
            <FormCard>
                <form
                    onSubmit={handleFormSubmit}
                    className={loginSignupForm}
                >
                    <h2 className={loginSignupHeader}>
                        LOGIN
                    </h2>
                    <div className={formDiv}>
                        <label
                            htmlFor="email"
                            className={loginSignupFormLabel}
                        >
                            Email
                        </label>
                        <input
                            placeholder='Your email'
                            name='email'
                            type='email'
                            id='email'
                            value={formState.email}
                            onChange={handleChange}
                            className={loginSignupInput}
                        />
                    </div>
                    <div className={formDiv}>
                        <label
                            htmlFor="password"
                            className={loginSignupFormLabel}
                        >
                            Password
                        </label>
                        <input
                            placeholder='********'
                            name='password'
                            type='password'
                            id='password'
                            value={formState.password}
                            onChange={handleChange}
                            className={loginSignupInput}
                        />
                    </div>
                    <button type='submit' className={loginSignupButton}>Submit</button>
                    {error && <div>Login Failed</div>}
                </form>
            </FormCard>
        </div>


    )
}

export default Login;