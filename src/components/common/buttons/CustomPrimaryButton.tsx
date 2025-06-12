import {
    Button
  } from '@mui/material';
import styles from './styles.module.scss';

interface CustomPrimaryButton {
  text:String,
  size?: any
  type: any
}

const CustomPrimaryButton = ({ text, size, type }: CustomPrimaryButton) => {
  return (
    <Button
        type={type}
        fullWidth
        variant="contained"
        size= {size}
        className={styles.submitButton}
        sx={{
            py: 1.2,
            fontSize: '1rem',
            textTransform: 'none',
            borderRadius: '10px'
        }}
    >
        {text}
    </Button>
  );
};

export default CustomPrimaryButton; 