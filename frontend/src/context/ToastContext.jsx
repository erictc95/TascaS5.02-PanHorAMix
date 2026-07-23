import { createContext, useContext, useState } from "react";

import Toast from "../components/common/Toast/Toast";

const ToastContext = createContext();

export function ToastProvider({ children }) {

    const [toast, setToast] = useState({

        visible: false,
        type: "success",
        title: "",
        message: ""

    });

    function showToast({

                           type = "success",
                           title,
                           message,
                           duration = 5000

                       }) {

        setToast({

            visible: true,
            type,
            title,
            message

        });

        setTimeout(() => {

            setToast(previous => ({

                ...previous,

                visible: false

            }));

        }, duration);

    }

    return (

        <ToastContext.Provider value={{ showToast }}>

            {children}

            <Toast

                visible={toast.visible}
                type={toast.type}
                title={toast.title}
                message={toast.message}

            />

        </ToastContext.Provider>

    );

}

export function useToast() {

    return useContext(ToastContext);

}