import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { signIn } = useAuth();

  return (
    <div className="fixed inset-0 bg-[#121212] z-40 flex flex-col p-6 items-center justify-center">
      <div className="max-w-md w-full mx-auto bg-[#1E1E1E] rounded-2xl shadow-lg p-8">
        <div className="flex flex-col items-center">
          <div className="w-32 h-32 mb-6">
            <svg width="128" height="128" viewBox="0 0 128 128" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="128" height="128" rx="64" fill="#FF3B30"/>
              <circle cx="64" cy="64" r="48" stroke="#FFD700" strokeWidth="2"/>
              <path d="M49.58 81H43.193L58.721 47H65.344L80.872 81H74.485L62.185 53.664L49.58 81ZM51.315 67.802L73.056 67.802L73.056 72.92L51.315 72.92L51.315 67.802Z" fill="#FFD700"/>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">AuMiner</h1>
          <p className="text-gray-400 mb-8 text-center">Đào Au coin mỗi ngày và nhận thưởng</p>
          
          <button 
            onClick={signIn}
            className="flex items-center justify-center w-full bg-white text-[#121212] font-medium rounded-lg px-4 py-3 mb-4 transition duration-200 hover:bg-gray-100"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google Logo" className="w-5 h-5 mr-3" />
            Đăng nhập bằng Google
          </button>
          
          <p className="text-xs text-gray-500 mt-6 text-center">
            Bằng cách đăng nhập, bạn đồng ý với các điều khoản dịch vụ và chính sách bảo mật của chúng tôi.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
