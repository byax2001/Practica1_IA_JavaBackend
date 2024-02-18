import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
const StyleButton = styled(Button)(({ fontcolor, primarycolor, hovercolor, borderncolor }) => ({
    color: fontcolor,
    backgroundColor: primarycolor,
    '&:hover': {
        backgroundColor: hovercolor,
        borderColor: borderncolor
    },
    borderColor: borderncolor
}));

export default StyleButton;