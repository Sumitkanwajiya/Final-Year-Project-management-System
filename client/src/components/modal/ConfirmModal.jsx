import React from "react";
import { AlertTriangle, X, CheckCircle, Info, AlertCircle } from "lucide-react";

const ConfirmModal = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    variant = "danger",
    confirmText,
    cancelText = "Cancel"
}) => {
    if (!isOpen) return null;

    const variants = {
        danger: {
            icon: AlertTriangle,
            iconBg: "bg-red-100",
            iconColor: "text-red-600",
            buttonBg: "bg-red-600 hover:bg-red-700",
            defaultConfirmText: "Delete"
        },
        success: {
            icon: CheckCircle,
            iconBg: "bg-green-100",
            iconColor: "text-green-600",
            buttonBg: "bg-green-600 hover:bg-green-700",
            defaultConfirmText: "Confirm"
        },
        warning: {
            icon: AlertCircle,
            iconBg: "bg-amber-100",
            iconColor: "text-amber-600",
            buttonBg: "bg-amber-600 hover:bg-amber-700",
            defaultConfirmText: "Confirm"
        },
        info: {
            icon: Info,
            iconBg: "bg-blue-100",
            iconColor: "text-blue-600",
            buttonBg: "bg-blue-600 hover:bg-blue-700",
            defaultConfirmText: "Okay"
        }
    };

    const currentVariant = variants[variant] || variants.danger;
    const Icon = currentVariant.icon;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm animate-fade-in p-4">
            <div className="relative w-full max-w-sm p-6 bg-white rounded-2xl shadow-2xl transform transition-all scale-100 border border-gray-100">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition p-1 hover:bg-gray-100 rounded-full"
                >
                    <X size={20} />
                </button>

                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 ${currentVariant.iconBg} ${currentVariant.iconColor} rounded-full mb-5 shadow-sm`}>
                        <Icon size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-gray-500 mb-8 leading-relaxed text-sm">{message}</p>

                    <div className="flex gap-3 w-full">
                        <button
                            onClick={onClose}
                            className="flex-1 px-4 py-2.5 bg-gray-50 text-gray-700 font-medium rounded-xl hover:bg-gray-100 transition border border-gray-200"
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={onConfirm}
                            className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition shadow-lg shadow-gray-200 ${currentVariant.buttonBg}`}
                        >
                            {confirmText || currentVariant.defaultConfirmText}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;
