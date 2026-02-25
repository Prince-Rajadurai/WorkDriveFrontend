import moment from 'moment-timezone';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import NavBar from '../Components/NavBar';
import Button from './../Components/Button';
import './../Style/SignUp.css';

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
                navigate("/smartdrive/signup");
            } else {
                navigate("/smartdrive/home");
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
            navigate('/smartdrive/home');

        } catch (err) {
            setFormError({ field: "", message: "Server not reachable" });
        }
    }

    return (
        <div>
            <NavBar></NavBar>
            <div className="template">
                <div className="left">
                    <div className="contentWrapper">
                        <div className="contentArea">
                            <h1>Elevate Your Team's<br />Collective<br />Intelligence</h1>
                            <p>Step into a unified workspace where files aren't just stored—they're put to work. Join thousands of teams using our secure cloud to break down silos, streamline collaboration, and keep every project moving forward. Start your journey toward a more organized, productive, and connected future today.</p>
                        </div>
                        <div className="imageArea">
                            <img src="../src/assets/signUp.png" alt="Image" />
                        </div>
                    </div>
                </div>
                <div className="right">
                    <div className="signUpArea">
                        <h1 id='title'>Start using SmartDrive</h1>
                        <p id='titleDescription'>Join us to manage your files effectively.</p>
                        <form id='signUpContainer' onSubmit={handleSubmit}>

                            <label htmlFor="fullName">Full Name</label>
                            <input
                                type="text"
                                id='fullName'
                                placeholder='Enter your full name'
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                style={{ borderColor: formError.field === 'fullName' ? 'red' : 'rgb(122,119,119)' }}
                            />

                            <label htmlFor="timezone">Select Timezone </label>
                            <select name="timezone" id="timezone" value={selectedTimezone} onChange={handleTimezoneChange}>
                                {timezones.map((zone) => (
                                    <option key={zone} value={zone}>
                                        {zone}
                                    </option>
                                ))}
                            </select>

                            <label htmlFor="email">Email</label>
                            <input
                                type="text"
                                id='email'
                                placeholder='Enter your email'
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderColor: formError.field === 'email' ? 'red' : 'rgb(122,119,119)' }}
                            />

                            <label htmlFor="password">Password</label>
                            <input
                                type="password"
                                id='password'
                                placeholder='Create a password'
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderColor: formError.field === 'password' ? 'red' : 'rgb(122,119,119)' }}
                            />

                            <label htmlFor="confirmPassword">Confirm Password</label>
                            <input
                                type="password"
                                id='confirmPassword'
                                placeholder='Confirm your password'
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ borderColor: formError.field === 'confirmPassword' ? 'red' : 'rgb(122,119,119)' }}
                            />

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

                            <p id='signInPage'>Already have an account? <Link to="/smartdrive/signin">Sign In</Link> </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
