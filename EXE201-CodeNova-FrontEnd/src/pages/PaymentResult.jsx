import React, { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Dùng layout chung
import LanguageSwitcher from '../components/LanguageSwitcher';

export default function PaymentResult() {
  const [searchParams] = useSearchParams();
  const [message, setMessage] = useState('Đang kiểm tra kết quả giao dịch...');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const resultCode = searchParams.get('resultCode');
    const momoMessage = decodeURIComponent(searchParams.get('message') || '');

    if (resultCode === '0') {
      setIsSuccess(true);
      setMessage(momoMessage || 'Giao dịch thành công! Vui lòng chờ trong giây lát để hệ thống cập nhật token.');
    } else {
      setIsSuccess(false);
      setMessage(`Giao dịch thất bại: ${momoMessage} (Mã lỗi: ${resultCode})`);
    }
  }, [searchParams]);

  return (
    <div className="flex min-h-screen bg-blue-600">
      <LanguageSwitcher />
      <Sidebar />
      <main className="flex-1 flex justify-center items-center p-8 bg-gradient-to-br from-blue-50 to-blue-200">
        <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-sm rounded-2xl shadow-lg p-8 text-center">

          {isSuccess ? (
            <div className="text-green-500 w-20 h-20 mx-auto mb-4">
              {/* Icon Success */}
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
          ) : (
            <div className="text-red-500 w-20 h-20 mx-auto mb-4">
              {/* Icon Fail */}
              <svg fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
          )}

          <h1 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-gray-800' : 'text-red-600'}`}>
            {isSuccess ? 'Thanh toán thành công' : 'Thanh toán thất bại'}
          </h1>

          <p className="text-gray-600 mb-8">{message}</p>

          <Link
            to="/tokens"
            className="bg-black text-white py-2 px-6 rounded-full hover:bg-gray-800 transition"
          >
            Quay lại trang Gói
          </Link>
        </div>
      </main>
    </div>
  );
}