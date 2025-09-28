import React, { useState, useEffect } from 'react';

const Header: React.FC = () => {
    const [currentDateTime, setCurrentDateTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentDateTime(new Date());
        }, 1000); // Cập nhật mỗi giây

        // Dọn dẹp interval khi component bị unmount
        return () => {
            clearInterval(timer);
        };
    }, []); // Mảng phụ thuộc rỗng đảm bảo hiệu ứng chỉ chạy một lần khi mount

    const formattedTime = currentDateTime.toLocaleTimeString('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
    });

    const formattedDate = currentDateTime.toLocaleDateString('vi-VN', {
        weekday: 'long',
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    });


    return (
        <header className="bg-gray-800/30 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-10">
            <div className="w-full max-w-4xl mx-auto px-4 py-4 flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold animated-gradient-text">Pidtap Studio</h1>
                    <p className="text-indigo-300">Phòng sáng tạo AI</p>
                </div>
                <div className="text-right">
                    <p className="font-mono text-2xl text-white tracking-wider">{formattedTime}</p>
                    <p className="text-sm text-gray-400">{formattedDate}</p>
                </div>
            </div>
        </header>
    );
};

export default Header;