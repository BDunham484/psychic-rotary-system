// @ts-ignore
import styles from './LoginSignup.module.css';
import { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../../utils/mutations';
import Auth from '../../utils/auth';
import FormCard from '../../components/shared/FormCard/FormCard';

const Signup = () => {
    const [formState, setFormState] = useState({ username: '', email: '', password: '' });
    const {
        loginSignupWrapper,
        loginSignupForm,
        loginSignupHeader,
        loginSignupFormLabel,
        formDiv,
        loginSignupInput,
        loginSignupButton,
    } = styles;

    const [addUser, { error }] = useMutation(ADD_USER);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormState({
            ...formState,
            [name]: value,
        });
    };

    const handleFormSubmit = async event => {
        event.preventDefault();

        try {
            // Execute addUser mutation and pass in variable data from form
            const { data } = await addUser({
                variables: { ...formState }
            });

            Auth.login(data.addUser.token);
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
                        SIGN UP
                    </h2>
                    <div className={formDiv}>
                        <label
                            htmlFor='username'
                            className={loginSignupFormLabel}
                        >
                            Username
                        </label>
                        <input
                            placeholder='Your username'
                            name='username'
                            type='username'
                            id='username'
                            value={formState.username}
                            onChange={handleChange}
                            className={loginSignupInput}
                        />
                    </div>
                    <div className={formDiv}>
                        <label
                            htmlFor='email'
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
                            htmlFor='password'
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
                </form>
                {error && <div>Sign up failed</div>}
            </FormCard>

        </div>
    )
}

export default Signup;