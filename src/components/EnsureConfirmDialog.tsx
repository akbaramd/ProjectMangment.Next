import React, { useState } from 'react';
import Dialog from '@/components/ui/Dialog';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

interface EnsureConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    title: string; // Prop for the dialog title
    confirmValue: string;
    message: string;
    placeholder: string;
    onConfirm: () => Promise<void>;
    onCancel: () => void;
    errorMessage?: string;
    confirmButtonColor?: string; // Allow dynamic button color
}

const EnsureConfirmDialog: React.FC<EnsureConfirmDialogProps> = ({
                                                                     isOpen,
                                                                     onClose,
                                                                     title,
                                                                     confirmValue,
                                                                     message,
                                                                     placeholder,
                                                                     onConfirm,
                                                                     onCancel,
                                                                     errorMessage = 'Value mismatch.',
                                                                     confirmButtonColor = 'green', // Default button color set to green
                                                                 }) => {
    const [inputValue, setInputValue] = useState('');
    const [isProcessing, setIsProcessing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const isEmpty = inputValue === '';
    const isMatch = inputValue === confirmValue;

    const handleConfirm = async () => {
        if (!isMatch) {
            setError(errorMessage);
            return;
        }

        setIsProcessing(true);
        setError(null);
        try {
            await onConfirm();
            onClose(); // Close the dialog on success
        } catch (err) {
            setError('An error occurred.');
        } finally {
            setIsProcessing(false);
        }
    };

    // Determine the color of the input based on the input state
    const inputClass = isEmpty
        ? 'focus:border-blue-500 focus:ring-blue-500'
        : isMatch
            ? 'border-teal-500 focus:border-teal-500 focus:ring-teal-500'
            : 'border-red-500 focus:border-red-500 focus:ring-red-500';

    return (
        <Dialog isOpen={isOpen} onClose={onClose}>
            <h5 className="mb-4">{title}</h5>
            <p className="mb-4">{message}</p>
            <pre className="bg-orange-100 border border-dashed border-orange-500 text-orange-500 p-2 rounded mb-4">
                {confirmValue}
            </pre>
            <hr className={"mb-4"}/>
            <div className="mb-4">
                <label className="block mb-2">Enter to Confirm:</label>
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    className={inputClass} // Dynamically set input class
                />
                {error && <div className="text-red-500 mt-2">{error}</div>}
            </div>
            <div className="text-right mt-6">
                <Button className="ltr:mr-2" variant="plain" onClick={onCancel}>
                    Cancel
                </Button>
                <Button
                    onClick={handleConfirm}
                    disabled={isEmpty || isProcessing || !isMatch}
                >
                    {isProcessing ? 'Processing...' : 'Confirm'}
                </Button>
            </div>
        </Dialog>
    );
};

export default EnsureConfirmDialog;
