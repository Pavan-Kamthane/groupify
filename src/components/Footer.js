import React from 'react';
import { Box, Typography, Link as MuiLink, IconButton } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';

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
                &copy; {new Date().getFullYear()} GroupiFy. Created by <strong>Pavan Kamthane</strong>
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mx: 2 }}>
                <MuiLink href="https://www.linkedin.com/in/pavankamthane/" target="_blank" color="inherit" underline="hover">
                    <IconButton size="small" color="inherit" aria-label="LinkedIn">
                        <LinkedInIcon />
                    </IconButton>
                </MuiLink>
                <MuiLink href="https://github.com/Pavan-Kamthane" target="_blank" color="inherit" underline="hover">
                    <IconButton size="small" color="inherit" aria-label="GitHub">
                        <GitHubIcon />
                    </IconButton>
                </MuiLink>
            </Box>
        </Box>
    );
};

export default Footer;
