    import { toast } from 'react-toastify';
    
    export const NotifyCustom = ({text , bar}) => toast(text, {
        position: "bottom-left",
        style: {
            backgroundColor: "rgb(215, 203, 155)",
            color: "#996515",
            maxWidth: "fit-content",
            padding: 10
        },
        hideProgressBar: bar || false
    });