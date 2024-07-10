import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const toastMessageSuccess = (message: string) => {
    toast.success(message, {
        position: "top-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    // toast.configure();
};
export const toastMessageError = (message: string) => {
    toast.error(message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
    });
    // toast.configure();
};
