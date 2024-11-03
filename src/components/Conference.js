import { selectPeers, useHMSStore, useHMSActions } from "@100mslive/react-sdk";
import React from "react";
import Peer from "./Peer";
import { Grid, Paper, Typography, Box } from "@mui/material";

function Conference() {
    const peers = useHMSStore(selectPeers);
    const hmsActions = useHMSActions();

    return (
        <Box
            style={{
                width: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#121212',
                color: '#ffffff',
                overflow: 'hidden',
                padding: '20px',
            }}
        >
            <Typography variant="h4" align="center" gutterBottom>
                Conference Room
            </Typography>

            <Grid container spacing={2} justifyContent="center" style={{ flexGrow: 1, width: '100%' }}>
                {peers.map((peer) => (
                    <Grid item xs={12} sm={6} md={4} key={peer.id}>
                        <Paper elevation={3} style={{ padding: '10px', backgroundColor: '#1e1e1e', color: '#ffffff' }}>
                            <Peer peer={peer} />
                        </Paper>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}

export default Conference;
