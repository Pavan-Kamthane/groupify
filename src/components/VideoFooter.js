import React, { useState } from "react";
import { useAVToggle } from "@100mslive/react-sdk";
import {
    selectIsConnectedToRoom,
    useHMSActions,
    useHMSStore,
    selectPeers,
} from "@100mslive/react-sdk";
import {
    IconButton,
    Button,
    Typography,
    Box,
} from "@mui/material";
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import VideocamIcon from "@mui/icons-material/Videocam";
import VideocamOffIcon from "@mui/icons-material/VideocamOff";
import GroupIcon from "@mui/icons-material/Group";
import ScreenShareIcon from "@mui/icons-material/ScreenShare";
import StopScreenShareIcon from "@mui/icons-material/StopScreenShare"; // Import Stop icon
import ChatIcon from "@mui/icons-material/Chat";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import SettingsIcon from "@mui/icons-material/Settings";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

const VideoFooter = () => {
    const { isLocalAudioEnabled, isLocalVideoEnabled, toggleAudio, toggleVideo } = useAVToggle();
    const peers = useHMSStore(selectPeers);
    const userCount = peers.length;
    const isConnected = useHMSStore(selectIsConnectedToRoom);
    const hmsActions = useHMSActions();
    const [isScreenShareActive, setIsScreenShareActive] = useState(false); // Track screen share state

    const handleScreenShare = async () => {
        try {
            await hmsActions.startScreenShare();
            setIsScreenShareActive(true); // Set screen share state to active
        } catch (error) {
            console.error("Error starting screen share:", error);
        }
    };

    const handleStopScreenShare = async () => {
        try {
            await hmsActions.stopScreenShare();
            setIsScreenShareActive(false); // Set screen share state to inactive
        } catch (error) {
            console.error("Error stopping screen share:", error);
        }
    };

    return (
        <>
            <Box display="flex" justifyContent="center" alignItems="center" mb={2}>
                <IconButton onClick={toggleAudio} color="primary">
                    {isLocalAudioEnabled ? <MicOffIcon /> : <MicIcon />}
                </IconButton>
                <IconButton onClick={toggleVideo} color="primary">
                    {isLocalVideoEnabled ? <VideocamOffIcon /> : <VideocamIcon />}
                </IconButton>
            </Box>

            <Box display="flex" justifyContent="space-around" mb={2}>
                <Box display="flex" alignItems="center">
                    <GroupIcon />
                    <Typography variant="body1" ml={1}>{userCount}</Typography>
                </Box>

                <IconButton
                    color="primary"
                    onClick={isScreenShareActive ? handleStopScreenShare : handleScreenShare}
                >
                    {isScreenShareActive ? <StopScreenShareIcon /> : <ScreenShareIcon />}
                    <Typography variant="body1">{isScreenShareActive ? "Stop Screen Share" : "Share Screen"}</Typography>
                </IconButton>

                <IconButton color="primary">
                    <ChatIcon />
                    <Typography variant="body1">Chat</Typography>
                </IconButton>
                <IconButton color="primary">
                    <EmojiEmotionsIcon />
                    <Typography variant="body1">Reactions</Typography>
                </IconButton>
                <IconButton color="primary">
                    <SettingsIcon />
                    <Typography variant="body1">Settings</Typography>
                </IconButton>
                <IconButton color="primary">
                    <MoreHorizIcon />
                    <Typography variant="body1">More</Typography>
                </IconButton>
            </Box>

            <Box display="flex" justifyContent="center">
                {isConnected && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={() => hmsActions.leave()}
                    >
                        Leave
                    </Button>
                )}
            </Box>
        </>
    );
};

export default VideoFooter;
