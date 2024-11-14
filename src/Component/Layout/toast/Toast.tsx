import React, { useEffect } from 'react';

const Toast: React.FC<{ message: string, onClose: () => void }> = ({ message, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(onClose, 2000);
        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="fixed top-20 bg-blue-500 text-white p-4 rounded shadow-lg">
            {message}
        </div>
    );
};

export default Toast;
