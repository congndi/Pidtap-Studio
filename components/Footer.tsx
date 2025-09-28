import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-gray-900/50 backdrop-blur-sm border-t border-gray-700 mt-12">
            <div className="w-full max-w-4xl mx-auto px-4 py-8">
                {/* Main footer content */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left mb-8">
                    {/* Column 1: About */}
                    <div className="space-y-2">
                        <h3 className="text-xl font-bold text-white">Pidtap Studio</h3>
                        <p className="text-gray-400 text-sm">
                            Khai phá tiềm năng sáng tạo vô hạn của bạn với sức mạnh của trí tuệ nhân tạo.
                        </p>
                    </div>

                    {/* Column 2: Quick Links */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-sm">Khám phá</h4>
                        <ul className="text-gray-400 text-sm space-y-1">
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Sáng tạo từ Ý tưởng</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">Sáng tạo từ Hình ảnh</a></li>
                            <li><a href="#" className="hover:text-indigo-400 transition-colors">AI Gen</a></li>
                        </ul>
                    </div>

                    {/* Column 3: Contact Info */}
                    <div className="space-y-2">
                        <h4 className="font-semibold text-gray-200 uppercase tracking-wider text-sm">Liên hệ</h4>
                        <ul className="text-gray-400 text-sm space-y-2">
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <i className="fa-solid fa-user w-4 text-center text-indigo-400"></i>
                                <span>Nguyễn Vĩnh Phát</span>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <i className="fa-solid fa-phone w-4 text-center text-indigo-400"></i>
                                <a href="tel:0386865151" className="hover:text-indigo-400 transition-colors">0386865151</a>
                            </li>
                            <li className="flex items-center justify-center md:justify-start gap-3">
                                <i className="fa-solid fa-location-dot w-4 text-center text-indigo-400"></i>
                                <span>Giá Rai, Cà Mau</span>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom bar */}
                <div className="border-t border-gray-700 pt-6 flex flex-col sm:flex-row justify-between items-center gap-2 text-sm text-gray-500">
                    <p>&copy; {new Date().getFullYear()} Pidtap Studio. All rights reserved.</p>
                    <p>
                        Thiết kế bởi <a href="#" className="font-semibold text-indigo-400 hover:underline">Nguyễn Vĩnh Phát</a>
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;