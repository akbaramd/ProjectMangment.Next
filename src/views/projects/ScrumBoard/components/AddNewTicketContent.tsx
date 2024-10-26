import { Form, FormItem } from '@/components/ui/Form';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useScrumBoardStore } from '../store/scrumBoardStore';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { apiCreateTask, apiGetTasksBySprintId } from '@/services/TaskService'; // Import the API function
import { useParams } from 'react-router-dom';
import { TaskCreateDto } from '@/@types/task';

type FormSchema = {
    title: string;
};

const validationSchema = z.object({
    title: z.string().min(1, 'Ticket title is required!'),
});

type AddNewTicketContentProps = {
    onSuccess?: () => void;
};

const AddNewTicketContent = ({ onSuccess }: AddNewTicketContentProps) => {
    const { selectedColumn, closeDialog, setSelectedColumn, updateTasks } = useScrumBoardStore();
    const { sprintId } = useParams(); // Get the sprint ID from the URL params

    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm<FormSchema>({
        defaultValues: {
            title: '',
        },
        resolver: zodResolver(validationSchema),
    });

    const onFormSubmit = async ({ title }: FormSchema) => {
        try {
            const newTaskData: TaskCreateDto = {
                order: 0,
                content: '',
                description: '',
                title,
                columnId: selectedColumn?.id || '', // Use the selected column ID passed as prop
            };

            // Call the API to create a new task
            await apiCreateTask(newTaskData);

            // Fetch the tasks again after successful creation
            const tasks = await apiGetTasksBySprintId(sprintId || '', 100, 0);
            updateTasks(tasks?.results || []);

            closeDialog(); // Close the dialog on success

            // Call the success callback if provided
            if (onSuccess) {
                onSuccess();
            }
        } catch (error) {
            console.error('Error creating new task:', error);
        } finally {
            setSelectedColumn(null);
        }
    };

    return (
        <div>
            <h5>Add New Ticket</h5>
            <div className="mt-8">
                <Form layout="inline" onSubmit={handleSubmit(onFormSubmit)}>
                    <FormItem
                        label="Task Name"
                        invalid={Boolean(errors.title)}
                        errorMessage={errors.title?.message}
                    >
                        <Controller
                            name="title"
                            control={control}
                            render={({ field }) => (
                                <Input
                                    type="text"
                                    autoComplete="off"
                                    {...field}
                                />
                            )}
                        />
                    </FormItem>
                    <FormItem>
                        <Button variant="solid" type="submit">
                            Add
                        </Button>
                    </FormItem>
                </Form>
            </div>
        </div>
    );
};

export default AddNewTicketContent;
