
import { toast } from 'react-toastify';
    //pass anything as undefined as a String
    export const NotifyCustom = ({text , bar ,theme,autoClose,transition, closeOnClick, pauseOnHover ,position , draggable , progress ,style , progressStyle, onClick ,icon}) => toast(text, {
        position: position || "bottom-left", // top-left, top-right, top-center, bottom-left, bottom-right, bottom-center
        style: style || {
            backgroundColor: "rgb(215, 203, 155)",
            color: "#996515",
            maxWidth: "fit-content",
            padding: 10
        },
        hideProgressBar: bar || false,
        theme: theme || undefined, // light, dark, coloured
        autoClose: autoClose || 5000, // ?ms (In milliSeconds)
        transition: transition || undefined, // bounce, flip, slide, zoom
        closeOnClick: closeOnClick || true,
        pauseOnHover: pauseOnHover || true,
        draggable: draggable || true,
        progress: progress || 0, // up to 1 for full bar
        progressStyle: progressStyle || undefined, // css
        onClick: onClick || undefined, //function for an click event
        icon: icon || false,
    });