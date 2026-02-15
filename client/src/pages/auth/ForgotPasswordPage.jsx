import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { forgotPassword } from '../../store/slices/authSlice';
import { Mail, ArrowRight, ArrowLeft, GraduationCap, CheckCircle } from 'lucide-react';

const ForgotPasswordPage = () => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    dispatch(forgotPassword({ email })).then((res) => {
      setIsLoading(false);
      if (res.meta.requestStatus === 'fulfilled') {
        setIsSubmitted(true);
      }
    });
  };

  return (
    <div className="min-h-screen w-full flex bg-slate-50">
      {/* Left Panel - Branding & Visuals (Hidden on mobile) */}
      <div className="hidden lg:flex lg:w-1/2 bg-slate-900 relative overflow-hidden flex-col justify-between p-12 text-white">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_50%_50%,_rgba(59,130,246,0.5),_transparent_50%)]"></div>
          <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-blue-500 rounded-full blur-3xl"></div>
          <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-indigo-600 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-blue-600 rounded-lg">
              <GraduationCap className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold tracking-tight">EduManage System</span>
          </div>

          <div className="space-y-6 max-w-lg mt-20">
            <h1 className="text-4xl font-extrabold tracking-tight leading-tight">
              Password Recovery
            </h1>
            <p className="text-lg text-slate-400">
              Don't worry, it happens to the best of us. We'll help you reset your password and get back to your projects in no time.
            </p>
          </div>
        </div>

        <div className="relative z-10 flex gap-6 text-sm text-slate-400 font-medium">
          <span>© 2024 EduManage</span>
          <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
          <a href="#" className="hover:text-white transition-colors">Help Center</a>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          <div className="text-center lg:text-left">
            <div className="inline-flex lg:hidden items-center justify-center p-3 bg-blue-100 rounded-xl mb-6">
              <GraduationCap className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Forgot password?</h2>
            <p className="mt-2 text-slate-600">
              Enter your email address to receive a password reset link.
            </p>
          </div>

          {!isSubmitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 ml-1" htmlFor="email">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
                    placeholder="student@university.edu"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-semibold py-3 px-4 rounded-xl hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40"
              >
                {isLoading ? (
                  <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    Send Reset Link <ArrowRight className="h-5 w-5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center space-y-4 animate-fade-in">
              <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-green-900">Check your email</h3>
                <p className="text-green-700 mt-1">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
              </div>
              <button
                onClick={() => setIsSubmitted(false)}
                className="text-sm font-medium text-green-700 hover:text-green-800 underline"
              >
                Try a different email
              </button>
            </div>
          )}

          <div className="text-center">
            <Link to="/login" className="inline-flex items-center gap-2 font-semibold text-slate-600 hover:text-blue-600 transition-colors">
              <ArrowLeft className="h-4 w-4" /> Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
