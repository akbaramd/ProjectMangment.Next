import React from 'react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import Switcher from '@/components/ui/Switcher';
import Checkbox from '@/components/ui/Checkbox';
import RichTextEditor from '@/components/shared/RichTextEditor';
import { FormItem, Form } from '@/components/ui/Form';
import useResponsive from '@/utils/hooks/useResponsive';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import PersianDatePickerInput from '@/components/PersianDatePickerInput';

const validationSchema = z.object({
  name: z.string().min(1, { message: 'Project name is required' }),
  description: z.string().min(1, { message: 'Description is required' }),
  startDate: z.string().optional(),
  notification: z.array(z.string()).optional(),
  active: z.boolean().optional(),
});

type FormSchema = z.infer<typeof validationSchema>;

type ProjectDetailBase = {
  name: string;
  description: string;
  startDate: string;
};

type ProjectDetailsSettingProps = {
  onUpdate: (values: ProjectDetailBase) => void;
} & ProjectDetailBase;

const ProjectDetailsSetting = ({
  name,
  description,
  startDate,
  onUpdate,
}: ProjectDetailsSettingProps) => {
  const { handleSubmit, formState: { errors }, control } = useForm<FormSchema>({
    defaultValues: {
      name,
      description,
      startDate,
      notification: ['Email'],
      active: true,
    },
    resolver: zodResolver(validationSchema),
  });

  const { smaller } = useResponsive();

  const onSubmit = ({ name, description, startDate }: FormSchema) => {
    onUpdate({
      name,
      description,
      startDate: startDate ?? '',
    });
  };

  return (
    <Form
      layout={smaller.lg ? 'vertical' : 'horizontal'}
      labelWidth={250}
      onSubmit={handleSubmit(onSubmit)}
    >
      {/* Project Name */}
      <FormItem
        label="عنوان پروژه"
        invalid={Boolean(errors.name)}
        errorMessage={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              autoComplete="off"
              placeholder="عنوان پروژه را وارد کنید"
              {...field}
            />
          )}
        />
      </FormItem>

      {/* Project Description */}
      <FormItem
        label="توضیحات پروژه"
        invalid={Boolean(errors.description)}
        errorMessage={errors.description?.message}
        className="items-start"
      >
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Input
             autoComplete="off"
              {...field}
            />
          )}
        />
      </FormItem>

      {/* Project Due Date */}
      <FormItem
        label="تاریخ اتمام پروژه"
        invalid={Boolean(errors.startDate)}
        errorMessage={errors.startDate?.message}
      >
        <Controller
          name="startDate"
          control={control}
          render={({ field }) => (
            <PersianDatePickerInput
              value={field.value}
              onChange={(date) => field.onChange(date)}
            />
          )}
        />
      </FormItem>

      {/* Notification */}
      <FormItem label="اطلاع رسانی">
        <Controller
          name="notification"
          control={control}
          render={({ field }) => (
            <Checkbox.Group
              value={field.value}
              onChange={(val) => field.onChange(val)}
            >
              {['Email', 'Push notification'].map((notification) => (
                <Checkbox key={notification} value={notification}>
                  {notification}
                </Checkbox>
              ))}
            </Checkbox.Group>
          )}
        />
      </FormItem>

      {/* Project Status */}
      <FormItem label="وضعیت پروژه">
        <Controller
          name="active"
          control={control}
          render={({ field }) => (
            <div className="flex items-center gap-2">
              <Switcher
                checked={field.value}
                onChange={() => field.onChange(!field.value)}
              />
              <span className="font-semibold">
                {field.value ? 'Active' : 'Inactive'}
              </span>
            </div>
          )}
        />
      </FormItem>

      {/* Submit Button */}
      <div className="flex justify-end">
        <Button type="submit" variant="solid">
          ویرایش
        </Button>
      </div>
    </Form>
  );
};

export default ProjectDetailsSetting;
