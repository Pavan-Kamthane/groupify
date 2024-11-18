import React from 'react';
import { Box, Typography, Link as MuiLink, IconButton } from '@mui/material';

const Footer = () => {
    return (
        <Box
            component="footer"
            sx={{
                backgroundColor: 'primary.main',
                color: 'white',
                padding: '8px 0',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                boxShadow: '0 -2px 5px rgba(0, 0, 0, 0.2)',
                mt: 'auto', // Allow footer to move down to bottom of the content
            }}
        >
            <Typography variant="body2" align="center" sx={{ mx: 2, fontSize: 14, fontWeight: 500, letterSpacing: 0.5 }}>
                &copy; {new Date().getFullYear()} GroupiFy
            </Typography>
        </Box>
    );
};

export default Footer;
