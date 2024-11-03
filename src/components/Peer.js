import { useVideo } from "@100mslive/react-sdk";
import React from "react";
import { Box, Typography } from "@mui/material";

function Peer({ peer }) {
    const { videoRef } = useVideo({
        trackId: peer.videoTrack,
    });

    return (
        <Box className="peer-container" display="flex" flexDirection="column" alignItems="center" mb={2}>
            <video
                ref={videoRef}
                className={`peer-video ${peer.isLocal ? "local" : ""}`}
                autoPlay
                muted={peer.isLocal} // Mute local peer
                playsInline
                style={{
                    width: '100%', // Make the video take full width of the container
                    maxWidth: '600px', // Set a max width for larger screens
                    borderRadius: '10px', // Add some styling
                    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Optional: Add a shadow for better visibility
                }}
            />
            <Typography variant="subtitle1" align="center">
                {peer.name} {peer.isLocal ? "(You)" : ""}
            </Typography>
        </Box>
    );
}

export default Peer;
