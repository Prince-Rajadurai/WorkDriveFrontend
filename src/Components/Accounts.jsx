import "../Style/Accounts.css";
import { CiEdit } from "react-icons/ci";
import moment from "moment-timezone";
import { useState, useEffect } from "react";

export default function AccountsPage() {

    const timezones = moment.tz.names();

    const [fullName, setFullName] = useState("");
    const [email, setEmail] = useState("");
    const [timezone, setTimezone] = useState("");

    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [editMode, setEditMode] = useState(false);
    const [formError, setFormError] = useState({ field: "", message: "" });

    useEffect(() => { getDetails(); }, []);

    async function logout() {
        await fetch("http://localhost:8080/WorkDrive/LogoutServlet", {
            method: "POST",
            credentials: "include"
        });
        window.location.href = "/";
    }

    async function getDetails() {
        try {
            const response = await fetch("http://localhost:8080/WorkDrive/ProfileEditServlet", { method: "GET", credentials: "include" });
            const data = await response.json();

            if (data.StatusCode === 200) {
                setFullName(data.resource.FullName);
                setEmail(data.resource.Email);
                setTimezone(data.resource.TimeZone);
            }
        } catch {
            setFormError({ field: "", message: "Unable to load profile" });
        }
    }

    const handleEdit = () => {
        setPassword("");
        setConfirmPassword("");
        setFormError({ field: "", message: "" });
        setEditMode(true);
    };

    const handleCancel = async () => {
        await getDetails();
        setEditMode(false);
    };

    function validateForm() {

        const nameRegex = /^[A-Za-z ]+$/;

        if (fullName.trim().length < 3)
            return { field: "fullName", message: "Name must be at least 3 characters" };

        if (!nameRegex.test(fullName))
            return { field: "fullName", message: "Name can contain only letters and spaces" };

        if (timezones.indexOf(timezone) === -1)
            return { field: "timezone", message: "Invalid timezone selected" };

        if (password || confirmPassword) {

            if (password.length < 8)
                return { field: "password", message: "Password must be at least 8 characters" };

            if (!/[A-Z]/.test(password))
                return { field: "password", message: "Add uppercase letter" };

            if (!/[a-z]/.test(password))
                return { field: "password", message: "Add lowercase letter" };

            if (!/[0-9]/.test(password))
                return { field: "password", message: "Add number" };

            if (!/[!@#$%^&*(),.?\":{}|<>]/.test(password))
                return { field: "password", message: "Add special character" };

            if (/\s/.test(password))
                return { field: "password", message: "No spaces allowed" };

            if (password !== confirmPassword)
                return { field: "confirmPassword", message: "Passwords do not match" };
        }

        return { field: "", message: "" };
    }

    const handleSave = async (e) => {

        e.preventDefault();

        const error = validateForm();
        if (error.message) {
            setFormError(error);
            return;
        }

        setFormError({ field: "", message: "" });

        const response = await fetch("http://localhost:8080/WorkDrive/ProfileEditServlet", {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                name: fullName,
                password: password,
                confirmPassword: confirmPassword,
                timeZone: timezone
            })
        });

        const data = await response.json();
        console.log(data.message);

        setEditMode(false);
    };

    return (
        <div className="accountsPage">
            <div className="accountsContainer">

                <div className="account-heading">
                    <div><h2>Account Details</h2><p>Manage your account details</p></div>
                    {!editMode && <button className="editBtn" onClick={handleEdit}><CiEdit /> Edit Profile</button>}
                </div>

                <hr style={{ margin: "1.5vw 0" }} />

                <form className="form" onSubmit={handleSave}>

                    <div className="field">
                        <label>Full Name :</label>
                        {editMode ? <input value={fullName} onChange={(e) => setFullName(e.target.value)} style={{ borderColor: formError.field === "fullName" ? "red" : "" }} /> : <span>{fullName}</span>}
                    </div>

                    <div className="field">
                        <label>E-mail :</label>
                        {editMode ? <input type="text" value={email} disabled /> : <span>{email}</span>}
                    </div>

                    <div className="field">
                        <label>Password :</label>
                        {editMode ?
                            <div className="passwordGroup">
                                <input type="password" placeholder="New password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ borderColor: formError.field === "password" ? "red" : "" }} />
                                <input type="password" placeholder="Confirm password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} style={{ borderColor: formError.field === "confirmPassword" ? "red" : "" }} />
                            </div>
                            : <span>● ● ● ● ● ● ● ●</span>}
                    </div>

                    <div className="field">
                        <label>Timezone :</label>
                        {editMode ?
                            <select value={timezone} onChange={(e) => setTimezone(e.target.value)} style={{ borderColor: formError.field === "timezone" ? "red" : "" }}>
                                {timezones.map(zone => <option key={zone} value={zone}>{zone}</option>)}
                            </select>
                            : <span>{timezone}</span>}
                    </div>

                    {formError.message && <div className="errorText">{formError.message}</div>}

                    {editMode &&
                        <div className="changebuttons">
                            <button type="button" className="cancelbtn" onClick={handleCancel}>Cancel</button>
                            <button type="submit" className="savebtn">Save</button>
                        </div>
                    }

                     {!editMode &&  <button className="logout" onClick={logout}>Logout</button>}
                   

                </form>
            </div>
        </div>
    );
}
