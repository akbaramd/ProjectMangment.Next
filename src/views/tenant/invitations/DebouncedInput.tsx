import { useState, useEffect, InputHTMLAttributes } from 'react';
import Input from '@/components/ui/Input';

interface DebouncedInputProps
    extends Omit<
        InputHTMLAttributes<HTMLInputElement>,
        'onChange' | 'size' | 'prefix'
    > {
    value: string | number;
    onChange: (value: string | number) => void;
    debounce?: number;
}

function DebouncedInput({
                            value: initialValue,
                            onChange,
                            debounce = 500,
                            ...props
                        }: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue);
    const [isTyping, setIsTyping] = useState(false);

    useEffect(() => {
        if (!isTyping) {
            setValue(initialValue);
        }
    }, [initialValue, isTyping]);

    useEffect(() => {
        if (isTyping) {
            const timeout = setTimeout(() => {
                onChange(value);
                setIsTyping(false);
            }, debounce);

            return () => clearTimeout(timeout);
        }
    }, [value, debounce, onChange, isTyping]);

    const handleInputChange = (e:any) => {
        setValue(e.target.value);
        setIsTyping(true);
    };

    return (
        <Input
            {...props}
            value={value}
            onChange={handleInputChange}
        />
    );
}

export default DebouncedInput;
