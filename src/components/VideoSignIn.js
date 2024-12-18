import React, { useState } from "react";
import { useHMSActions } from "@100mslive/react-sdk";
import { TextField, Button, Typography, Container, Paper, Snackbar, Select, MenuItem, FormControl, InputLabel } from "@mui/material";
import MuiAlert from '@mui/material/Alert';

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

function VideoSignIn() {
    const hmsActions = useHMSActions();
    const [inputValues, setInputValues] = useState({
        name: "",
        token: ""
    });
    const [role, setRole] = useState(""); // No default role selected
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [openSnackbar, setOpenSnackbar] = useState(false);

    const handleInputChange = (e) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [e.target.name]: e.target.value
        }));
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setRole(selectedRole);

        // Set token based on selected role
        if (selectedRole === "host") {
            setInputValues((prevValues) => ({
                ...prevValues,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmMiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NzYyNGZmZDM2ZDRjZmMxOTgxZTk1ZjUiLCJ1c2VyX2lkIjoiZDQ2ZTk1NjUtYTAyZS00MGM5LWIxMjAtODU4YTI4ODJkODA1IiwiZXhwIjoxNzM0NTgyNjczLCJqdGkiOiI5ZDRmM2I2Ny0zYWMyLTRlZmUtYWMyMC01ZDIzODcyOGU5YjEiLCJpYXQiOjE3MzQ0OTYyNzMsImlzcyI6IjY3MjY3MWYzNDk0NGYwNjczMTNhN2Y2YSIsIm5iZiI6MTczNDQ5NjI3Mywic3ViIjoiYXBpIn0.cgIIGey7rlg7yjmf3GPc3zAD1x1P0lV60Wyj6k6uyTQ"
            }));
        } else {
            setInputValues((prevValues) => ({
                ...prevValues,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmMiLCJyb2xlIjoiZ3Vlc3QiLCJyb29tX2lkIjoiNjc2MjRmZmQzNmQ0Y2ZjMTk4MWU5NWY1IiwidXNlcl9pZCI6ImJiOGU5YjE2LTZjNzMtNDMwMi1iMzZiLTYzNWU4MGY4M2RiNCIsImV4cCI6MTczNDU4MjY1OSwianRpIjoiNzU5MmVjYjQtYjNmMC00NGEyLTk0MjktNTNhMjNkOTNjOGE4IiwiaWF0IjoxNzM0NDk2MjU5LCJpc3MiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmEiLCJuYmYiOjE3MzQ0OTYyNTksInN1YiI6ImFwaSJ9.jSMFVF2rnF2Em2YkWm0ZLo2KhF5Vnp9Cs2SKuJ-edfM"
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(""); // Clear any previous errors

        // Basic validation
        if (!inputValues.name.trim() || !inputValues.token.trim()) {
            setError("Both fields are required.");
            setLoading(false);
            return;
        }

        try {
            await hmsActions.join({
                userName: inputValues.name,
                authToken: inputValues.token
            });
        } catch (err) {
            setError("Failed to join the meeting. Please check your token and try again.");
        } finally {
            setLoading(false);
        }

        // If successful, you might want to clear the input fields
        setInputValues({ name: "", token: "" });
    };

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={3} style={{ padding: '16px' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Join Meeting
                </Typography>
                <form onSubmit={handleSubmit}>
                    <FormControl fullWidth margin="normal">
                        <InputLabel id="role-select-label">Role</InputLabel>
                        <Select
                            labelId="role-select-label"
                            value={role}
                            onChange={handleRoleChange}
                            placeholder="Select Role"
                        >
                            <MenuItem value="host">Host</MenuItem>
                            <MenuItem value="guest">Guest</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        value={inputValues.name}
                        onChange={handleInputChange}
                        id="name"
                        name="name"
                        label="Your Name"
                        variant="outlined"
                    />
                    <TextField
                        required
                        fullWidth
                        margin="normal"
                        value={inputValues.token}
                        onChange={handleInputChange}
                        id="token"
                        name="token"
                        label="Auth Token"
                        variant="outlined"
                        disabled // Disable token field since it's auto-filled
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        style={{ marginTop: '16px' }}
                        disabled={loading} // Disable button while loading
                    >
                        {loading ? "Joining..." : "Join"}
                    </Button>
                </form>
                {/* Snackbar for displaying error messages */}
                <Snackbar open={error !== ""} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                    <Alert onClose={handleCloseSnackbar} severity="error">
                        {error}
                    </Alert>
                </Snackbar>
            </Paper>
        </Container>
    );
}

export default VideoSignIn;
