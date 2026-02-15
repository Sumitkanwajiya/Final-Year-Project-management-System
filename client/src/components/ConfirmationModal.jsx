import { X, AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmationModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "accept", // 'accept' or 'reject'
    studentName = ""
}) => {
    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === "Escape") {
            onClose();
        }
    };

    // Different styles based on type
    const isAccept = type === "accept";
    const iconBgColor = isAccept ? "bg-emerald-100" : "bg-red-100";
    const iconColor = isAccept ? "text-emerald-600" : "text-red-600";
    const confirmBtnColor = isAccept
        ? "bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-700 hover:to-green-700"
        : "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700";

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fadeIn"
            onClick={handleBackdropClick}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
        >
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full mx-4 animate-slideUp">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200">
                    <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-xl ${iconBgColor}`}>
                            {isAccept ? (
                                <CheckCircle className={`w-6 h-6 ${iconColor}`} />
                            ) : (
                                <AlertTriangle className={`w-6 h-6 ${iconColor}`} />
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                        aria-label="Close modal"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6">
                    <p className="text-slate-600 leading-relaxed">
                        {message}
                        {studentName && (
                            <span className="font-semibold text-slate-900"> {studentName}</span>
                        )}
                        ?
                    </p>
                </div>

                {/* Footer */}
                <div className="flex gap-3 p-6 bg-slate-50 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2.5 bg-white border-2 border-slate-300 text-slate-700 rounded-xl font-semibold hover:bg-slate-50 transition-all duration-200"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                        className={`flex-1 px-4 py-2.5 text-white rounded-xl font-semibold transition-all duration-200 shadow-sm hover:shadow-md ${confirmBtnColor}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>

            <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
        </div>
    );
};

export default ConfirmationModal;
