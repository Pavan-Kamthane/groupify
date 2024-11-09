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
    const [role, setRole] = useState("guest"); // Default role
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
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmMiLCJyb2xlIjoiaG9zdCIsInJvb21faWQiOiI2NzJlZDM1YWUxYzc3ZmNjNGMyNzczYmQiLCJ1c2VyX2lkIjoiMjc3ZmQyYmYtM2QzMi00YmU4LWI3N2UtZDIzNmY4NmY2ZjA0IiwiZXhwIjoxNzMxMjA4NDExLCJqdGkiOiI5ZTVkNGNjZi0xMTc5LTRiYzItYTlkOC05N2Y3YWI5MTE1ODUiLCJpYXQiOjE3MzExMjIwMTEsImlzcyI6IjY3MjY3MWYzNDk0NGYwNjczMTNhN2Y2YSIsIm5iZiI6MTczMTEyMjAxMSwic3ViIjoiYXBpIn0.FJGhDoo8KDYRoPdN2sqOynAO12r2zzh4OJwxlp8xvOQ"
            }));
        } else {
            setInputValues((prevValues) => ({
                ...prevValues,
                token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ2ZXJzaW9uIjoyLCJ0eXBlIjoiYXBwIiwiYXBwX2RhdGEiOm51bGwsImFjY2Vzc19rZXkiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmMiLCJyb2xlIjoiZ3Vlc3QiLCJyb29tX2lkIjoiNjcyZWQzNWFlMWM3N2ZjYzRjMjc3M2JkIiwidXNlcl9pZCI6ImQ3YThmMTdjLTEyNDItNGVlMi1iZDNkLTY1M2FlN2ZjM2IyOSIsImV4cCI6MTczMTIwODQ0NSwianRpIjoiMzVlOGE2ZWYtYjQ1OS00YjM3LWFkMGQtNzQyYWFkNmY4OGFjIiwiaWF0IjoxNzMxMTIyMDQ1LCJpc3MiOiI2NzI2NzFmMzQ5NDRmMDY3MzEzYTdmNmEiLCJuYmYiOjE3MzExMjIwNDUsInN1YiI6ImFwaSJ9.OYQjfL8HJJc_9STY-SXEsxl_tQKsIPJedkpyw5UZxTg"
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
                        >
                            <MenuItem value="">Select Role</MenuItem>
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
