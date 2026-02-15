import { useEffect, useState } from 'react';
import './../Style/SignUp.css';
import Button from './../Components/Button';

import moment from 'moment-timezone';
import { Link, useNavigate } from "react-router-dom";

export default function SignUpPage() {

    const navigate = useNavigate();
    const timezones = moment.tz.names();

    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [termsAccepted, setTermsAccepted] = useState(false);
    const [selectedTimezone, setSelectedTimezone] = useState('Asia/Kolkata'); // default value

    const handleTimezoneChange = (e) => {
        setSelectedTimezone(e.target.value);
    };

    const [formError, setFormError] = useState({ field: '', message: '' });


    useEffect(() => {
        sessionCheck();
    }, []);

    async function sessionCheck() {
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/SessionCheckFilter", {
                method: "GET",
                credentials: "include"
            });
            const data = await response.json();
            if (data.message !== "Session exsist") {
                navigate("/");
            }

        } catch (err) {
            setError("Technical Issue");
        }
    }

    function validateForm() {
        if (fullName.trim().length < 3) {
            return { field: 'fullName', message: "Full Name must be at least 3 characters" };
        }

        if (!(/^[a-z0-9]+@[a-z0-9]+\.[a-z]{2,}$/).test(email)) {
            return { field: 'email', message: "Enter a valid e-mail address" };
        }

        if (password.length < 8) {
            return { field: 'password', message: "Password must be at least 8 characters" };
        } else if (!/[A-Z]/.test(password)) {
            return { field: 'password', message: "Password must contain at least one uppercase letter" };
        } else if (!/[a-z]/.test(password)) {
            return { field: 'password', message: "Password must contain at least one lowercase letter" };
        } else if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
            return { field: 'password', message: "Password must contain at least one special character" };
        }

        if (password !== confirmPassword) {
            return { field: 'confirmPassword', message: "Confirm Password does not match" };
        }

        if (!termsAccepted) {
            return { field: 'terms', message: "You must accept the Terms & Privacy Policy" };
        }
        if (timezones.indexOf(selectedTimezone) < 0) {
            return { field: 'timezone', message: "Time zone select tag is mismatched" }
        }
        return { field: '', message: '' };
    }

    async function handleSubmit(e) {
        e.preventDefault();

        const error = validateForm();

        if (error.message) {
            setFormError(error);
            return;
        }

        setFormError({ field: '', message: '' });

        try {

            const response = await fetch("http://localhost:8080/WorkDrive/SignupServlet", {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    password,
                    confirmPassword,
                    terms: termsAccepted,
                    timezone: selectedTimezone
                })
            });


            const data = await response.json();

            if (data.StatusCode !== 200) {
                setFormError({ field: "", message: data.message });
                return;
            }

            // navigating to home
            navigate('/home');

        } catch (err) {
            setFormError({ field: "", message: "Server not reachable" });
        }
    }

    return (
        <div id='mainContainer'>
            <form id='signUpContainer' onSubmit={handleSubmit}>
                <h1 id='title'>Sign Up</h1>
                <p id='titleDescription'>Join us by filling in the details below</p>

                <div className='inputField'>
                    <label htmlFor="fullName">Full Name</label>
                    <input
                        type="text"
                        id='fullName'
                        placeholder='Enter your full name'
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        style={{ borderColor: formError.field === 'fullName' ? 'red' : 'rgb(122,119,119)' }}
                    />
                </div>

                <div className='inputField'>
                    <label htmlFor="timezone">Select Timezone: </label>
                    <select name="timezone" id="timezone" value={selectedTimezone} onChange={handleTimezoneChange}>
                        {timezones.map((zone) => (
                            <option key={zone} value={zone}>
                                {zone}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='inputField'>
                    <label htmlFor="email">Email</label>
                    <input
                        type="text"
                        id='email'
                        placeholder='Enter your email'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        style={{ borderColor: formError.field === 'email' ? 'red' : 'rgb(122,119,119)' }}
                    />
                </div>

                <div className='inputField'>
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id='password'
                        placeholder='Create a password'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={{ borderColor: formError.field === 'password' ? 'red' : 'rgb(122,119,119)' }}
                    />
                </div>

                <div className='inputField'>
                    <label htmlFor="confirmPassword">Confirm Password</label>
                    <input
                        type="password"
                        id='confirmPassword'
                        placeholder='Confirm your Password'
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        style={{ borderColor: formError.field === 'confirmPassword' ? 'red' : 'rgb(122,119,119)' }}
                    />
                </div>

                <div id='termAndConditionBox'>
                    <input
                        type="checkbox"
                        id='termsAndCondition'
                        checked={termsAccepted}
                        onChange={(e) => setTermsAccepted(e.target.checked)}
                    />
                    <label htmlFor="termsAndCondition">
                        I agree the <a>Terms & Privacy Policy</a>
                    </label>
                </div>

                {formError.message && <p className="formError">{formError.message}</p>}

                <Button type="submit" className="submitButton">
                    Sign Up
                </Button>

                <p id='signInPage'>Already have an account? <Link to="/">Sign In</Link> </p>
            </form>
        </div>
    );
}
