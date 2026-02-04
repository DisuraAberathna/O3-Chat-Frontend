import React, { createContext, useContext, useState, useCallback } from 'react';
import CustomAlert from './CustomAlert';

const AlertContext = createContext(null);

export const useAppAlert = () => {
    const context = useContext(AlertContext);
    if (!context) {
        throw new Error('useAppAlert must be used within an AlertProvider');
    }
    return context;
};

export const AlertProvider = ({ children }) => {
    const [alertConfig, setAlertConfig] = useState({
        visible: false,
        title: '',
        message: '',
        type: 'info',
        confirmText: 'OK',
    });

    const showAlert = useCallback((title, message, type = 'info', confirmText = 'OK') => {
        setAlertConfig({
            visible: true,
            title,
            message,
            type,
            confirmText,
        });
    }, []);

    const hideAlert = useCallback(() => {
        setAlertConfig((prev) => ({ ...prev, visible: false }));
    }, []);

    return (
        <AlertContext.Provider value={{ showAlert, hideAlert }}>
            {children}
            <CustomAlert
                visible={alertConfig.visible}
                title={alertConfig.title}
                message={alertConfig.message}
                type={alertConfig.type}
                confirmText={alertConfig.confirmText}
                onClose={hideAlert}
            />
        </AlertContext.Provider>
    );
};
