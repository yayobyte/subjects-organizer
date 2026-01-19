import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

export const ConfirmDialog = ({
    isOpen,
    onClose,
    onConfirm,
    title,
    message,
    confirmText = 'Delete',
    cancelText = 'Cancel'
}: ConfirmDialogProps) => {
    const handleConfirm = () => {
        onConfirm();
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100]"
                    />

                    {/* Dialog */}
                    <div className="fixed inset-0 flex items-center justify-center z-[101] p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 max-w-md w-full overflow-hidden"
                        >
                            {/* Header */}
                            <div className="flex items-start gap-4 p-6 pb-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
                                    <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                                        {title}
                                    </h3>
                                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                                        {message}
                                    </p>
                                </div>
                                <button
                                    onClick={onClose}
                                    className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3 p-6 pt-4 bg-slate-50 dark:bg-slate-800/50">
                                <button
                                    onClick={onClose}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm
                                             bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300
                                             border border-slate-300 dark:border-slate-700
                                             hover:bg-slate-50 dark:hover:bg-slate-700
                                             transition-colors"
                                >
                                    {cancelText}
                                </button>
                                <button
                                    onClick={handleConfirm}
                                    className="flex-1 px-4 py-2.5 rounded-lg font-medium text-sm
                                             bg-red-600 hover:bg-red-700 text-white
                                             transition-colors shadow-sm"
                                >
                                    {confirmText}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    );
};
