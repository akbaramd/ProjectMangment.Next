// components/PersianDatePickerInput.tsx

import React, { useState, useRef, forwardRef } from 'react';
import { Calendar } from 'react-modern-calendar-datepicker';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import moment from 'jalali-moment';
import Input from '@/components/ui/Input';
import { FaCalendarAlt } from 'react-icons/fa';
import useOnClickOutside from '@/utils/hooks/useOnClickOutside';

interface PersianDatePickerInputProps {
  value?: string; // Gregorian date string (ISO format)
  onChange: (date: string) => void; // Callback with Gregorian date string
}

const PersianDatePickerInput = forwardRef<HTMLInputElement, PersianDatePickerInputProps>(
  ({ value, onChange }, ref) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);

    useOnClickOutside(wrapperRef, () => setIsCalendarOpen(false));

    // Convert Gregorian date to Persian date for display
    const getPersianDateString = (gregorianDateStr: string | undefined) => {
      if (!gregorianDateStr) return '';
      const m = moment(gregorianDateStr, 'YYYY-MM-DD');
      m.locale('fa');
      return m.format('jYYYY/jMM/jDD');
    };

    // Convert Persian date object to Gregorian date string
    const convertToGregorianDate = (persianDate: any) => {
      if (persianDate) {
        const { year, month, day } = persianDate;
        const m = moment(`${year}/${month}/${day}`, 'jYYYY/jM/jD');
        m.locale('en');
        return m.format('YYYY-MM-DD');
      }
      return '';
    };

    // Convert Gregorian date string to Persian date object
    const getPersianDateObject = (gregorianDateStr: string | undefined) => {
      if (!gregorianDateStr) return null;
      const m = moment(gregorianDateStr, 'YYYY-MM-DD');
      m.locale('fa');
      const year = parseInt(m.format('jYYYY'), 10);
      const month = parseInt(m.format('jM'), 10);
      const day = parseInt(m.format('jD'), 10);
      return { year, month, day };
    };

    const handleDateChange = (persianDate: any) => {
      const gregorianDateStr = convertToGregorianDate(persianDate);
      console.log('Selected Persian Date:', persianDate);
      console.log('Converted Gregorian Date:', gregorianDateStr);
      if (gregorianDateStr) {
        try {
          onChange(gregorianDateStr);
          setIsCalendarOpen(false); // Hide the calendar
        } catch (error) {
          console.error('Error in onChange handler:', error);
        }
      }
    };

    const selectedPersianDate = getPersianDateObject(value);

    return (
      <div className="relative" ref={wrapperRef}>
        <Input
          ref={ref}
          value={getPersianDateString(value)}
          placeholder="تاریخ را انتخاب کنید"
          readOnly
          suffix={
            <FaCalendarAlt
              onClick={(e) => {
                e.stopPropagation(); // Prevent event bubbling
                setIsCalendarOpen(!isCalendarOpen);
              }}
            />
          }
          onClick={(e) => {
            e.stopPropagation(); // Prevent event bubbling
            setIsCalendarOpen(!isCalendarOpen);
          }}
        />

        {/* Calendar is always in the DOM but its visibility is controlled */}
        <div
          className="absolute z-10 mt-1 right-0"
          style={{ display: isCalendarOpen ? 'block' : 'none' }}
        >
          <Calendar
            value={selectedPersianDate}
            onChange={handleDateChange}
            locale="fa"
            shouldHighlightWeekends
          />
        </div>
      </div>
    );
  }
);

export default PersianDatePickerInput;
