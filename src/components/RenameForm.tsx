import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

type RenameFormProps = {
    title: string;
    closeRenameForm: () => void;
    onSubmit: (newTitle: string) => void;
};

// Zod schema for form validation
const validationSchema = z.object({
    title: z.string().min(1, 'The title is required').max(100, 'Title must be less than 100 characters'),
});

type FormSchema = z.infer<typeof validationSchema>;

const RenameForm: React.FC<RenameFormProps> = ({ title, closeRenameForm, onSubmit }) => {
    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm<FormSchema>({
        defaultValues: {
            title,
        },
        resolver: zodResolver(validationSchema),
    });

    const handleFormSubmit = (data: FormSchema) => {
        onSubmit(data.title.trim());
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center gap-2">
            <Controller
                name="title"
                control={control}
                render={({ field }) => (
                    <Input
                        {...field}
                        placeholder="Enter new name"
                        autoComplete="off"
                        className="w-full"
                    />
                )}
            />
            <Button variant="solid" type="submit">
                Save
            </Button>
            <Button  type="button" onClick={closeRenameForm}>
                Cancel
            </Button>
        </form>
    );
};

export default RenameForm;
