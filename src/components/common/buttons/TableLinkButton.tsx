import {
    Button
  } from '@mui/material';
import EditIcon from "@mui/icons-material/Edit";
import styles from './styles.module.scss';

interface TableLinkButtonProps {
  text:String;
  icon:any;
  color?: any;
  onClick?:any;
  customColor?: string;
}

const TableLinkButton = ({ text,icon,color="secondary",onClick,customColor }: TableLinkButtonProps) => {
  return (
    <Button
 variant="outlined"
 onClick={onClick}
 className={styles.buttonMargin}
          color={color}
          size="small"
           startIcon={icon}
          sx={customColor ? {
            borderColor: customColor,
            color: customColor,
            '&:hover': {
              borderColor: customColor,
              backgroundColor: customColor,
              color: 'white',
            }
          } : undefined}
        >
          {text}
         </Button>
  );
};

export default TableLinkButton; 