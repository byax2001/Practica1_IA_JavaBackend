import { Grid, Typography,TextareaAutosize, FormControl } from "@mui/material";
import { useState,useEffect,useContext, useRef} from "react";
import CustomTextField from "../components/CustomTextField/CustomTextField";
import ColorButton from "../components/ColorButtom/ColorButton";

export default function Homepage() {
const [infoImage, setInfoImage] = useState('');
const [image, setImage] = useState('');
const fileInputRef = useRef(null); // Crear una referencia al input de tipo file
// con el useRef se puede jalar el valor de un input creado en otra clase y colocarlo adentro de otra variable desada

const handleCargarClick = () => {
    const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado

    if (file) {
      // Leer el contenido del archivo seleccionado
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result)
        console.log('Contenido del archivo:', event.target.result); //formato 64bit
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  const handleProcesarClick = () => {
    const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado
    if (file) {
      console.log('Nombre del archivo:', file.name);
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };
  return (
    <Grid container sx={{ display: "flex", fontFamily: "Arial" }}>
      <Grid container justifyContent={"center"}>
        <header>
          <Typography variant="h3" component="h2" gutterBottom align="center">
            IA Detecting Image
          </Typography>
        </header>
      </Grid>
      <Grid container>
        <Grid item xs={7}>
          <CustomTextField
            sx={{ width: "80%", marginTop: 1, marginLeft: 5 }}
            type="file"
            inputProps={{
              // accept: "image/*", //se aceptaran todos los archivos que sean de tipo imagen
              accept:".jpg, .png"
            }}
            helperText="Ingrese una imagen"
            FormHelperTextProps={{
              style: { color: "#B2BAC2" }, // Cambia el color del texto de ayuda a blanco
            }}
            name="photo"
            inputRef={fileInputRef}
          />
        </Grid>
        <Grid item xs={2}>
          <ColorButton text={"Cargar"} mt={2} functionality={handleCargarClick}/>
        </Grid>
        <Grid item xs={2}>
          <ColorButton text={"Procesar"} mt={2} functionality={handleProcesarClick} />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs={1} />
        <Grid item xs={4}>
          {/*APARTADO PARA IMAGEN*/}
          <img src={image} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Grid>
        <Grid item xs={2} />
        <Grid item xs={4}>
          {/*APARTADO PARA INFO IMAGEN
            Este textarea no se puede modificar manualmente a menos que se agrege un onChange={handleInputChange}
            donde handleInputChange seria una funcion cualquiera que cambia los valores de la variable a través
            del uso de setVariable declarado en el useEffect, el handleInputChange deberia de ser handleInputChange(event){event.target.value}
          */}
          <TextareaAutosize
          id="textarea"
          aria-label="Descripción"
          minRows={3}
          placeholder="Escribe aquí..."
          style={{ width: '100%' }}
          value={infoImage}
        />
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Grid>
  );
}
