import StyleButton from "./components/StyleButton";
import * as React from 'react';

export default function ColorButton ({text,hcolor,pcolor,mt,functionality}){
    return (
        <StyleButton
            variant="contained"
            sx={{ marginTop: mt, borderRadius: 100, width: '90%' }}
            onClick={functionality}
            type='submit'
            hovercolor='#2A8C79'
            primarycolor='#2DBFA3 '
        >
            {text}
        </StyleButton>
    );
}