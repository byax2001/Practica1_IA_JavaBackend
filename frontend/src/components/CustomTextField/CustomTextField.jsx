import { styled } from '@mui/material/styles';
import TextField from '@mui/material/TextField';

const CustomTextField = styled(TextField)({
    '& label': {
        color: '#A0AAB4',
    },
    '& label.Mui-focused': {
        color: '#A0AAB4',
    },
    '& label.Mui-disabled': {
        color: '#A0AAB4',
    },
    '& .MuiInput-underline:after': {
        borderBottomColor: '#A0AAB4',
    },
    '& .MuiOutlinedInput-root': {
        '& fieldset': {
            borderColor: '#E0E3E7',
        },
        '&:hover fieldset': {
            borderColor: '#B2BAC2',
        },
        '&.Mui-focused fieldset': {
            borderColor: '#6F7E8C',
        },
        '&.Mui-disabled fieldset': {
            borderColor: '#E0E3E7', // Color del borde cuando está deshabilitado
        },
        '& .MuiInputBase-input': {
            color: 'white', // Cambia el color del texto aquí
        },
        '& .MuiSelect-icon': {
            color: '#6F7E8C' // Cambia el color del icono/flecha aquí
        }
    },
});

export default CustomTextField;