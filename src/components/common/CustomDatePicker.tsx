import { DatePicker } from 'antd';
import type { DatePickerProps } from 'antd';
import { CalendarMonth } from '@mui/icons-material';
import dayjs from 'dayjs';

interface CustomDatePickerProps {
  value: Dayjs | null;
  onChange: (date: Dayjs | null) => void;
  disabledDate?: (current: any) => boolean;
  placeholder?: string;
  disabled?: boolean;
  label: string;
  height?: string | number;
}

const CustomDatePicker = ({ height = '56px', ...props }: CustomDatePickerProps) => {
  return (
    <DatePicker
      {...props}
      style={{ 
        width: '100%',
        height: height
      }}
      suffixIcon={<CalendarMonth sx={{ color: 'action.active' }} />}
      format="DD-MM-YYYY"
    />
  );
};

export default CustomDatePicker; 