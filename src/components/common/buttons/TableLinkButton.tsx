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
}

const TableLinkButton = ({ text,icon,color="secondary",onClick }: TableLinkButtonProps) => {
  return (
    <Button
 variant="outlined"
 onClick={onClick}
 className={styles.buttonMargin}
          color={color}
          size="small"
           startIcon={icon}
        >
          {text}
         </Button>
  );
};

export default TableLinkButton; 