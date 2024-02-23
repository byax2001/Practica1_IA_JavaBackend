import { Grid, Typography,TextareaAutosize, FormControl } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import { useState,useEffect,useContext, useRef} from "react";
import CustomTextField from "../components/CustomTextField/CustomTextField";
import ColorButton from "../components/ColorButtom/ColorButton";
import axios from "axios";


const TableComponent = ({Data}) => {
  return (
    <TableContainer sx={{marginTop:5}} component={Paper}>
      <Table sx={{}}>
        <TableHead>
          <TableRow sx={{backgroundColor:"#434343"}}>
            <TableCell sx={{color:"white"}}>Category</TableCell>
            <TableCell sx={{color:"white"}}>Value</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(Data).map((category, index) => (
            <TableRow key={index}>
              <TableCell>{category}</TableCell>
              <TableCell>{Data[category]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

};

export default function Homepage() {
  const Data = {
    adult: "VERY_UNLIKELY",
    medical: "VERY_UNLIKELY",
    racy: "UNLIKELY",
    spoof: "UNLIKELY",
    violence: "VERY_UNLIKELY"
  };
const [infoImage, setInfoImage] = useState({
  adult: "",
  medical: "",
  racy: "",
  spoof: "",
  violence: ""
});
const [nCaras, setNCaras] = useState("0")
const [image, setImage] = useState('https://science.nasa.gov/wp-content/uploads/2023/06/spiral-galaxy-jpg.webp');
const fileInputRef = useRef(null); // Crear una referencia al input de tipo file
// con el useRef se puede jalar el valor de un input creado en otra clase y colocarlo adentro de otra variable desada

const handleCargarClick = () => {
    const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado
    if (file) {
      // Leer el contenido del archivo seleccionado
      const reader = new FileReader();
      reader.onload = (event) => {
        setImage(event.target.result)
        //console.log('Contenido del archivo:', event.target.result); //formato 64bit
      };
      reader.readAsDataURL(file);
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  const handleProcesarClick = () => {
    const file = fileInputRef.current.files[0]; // Obtener el archivo seleccionado
    if (file) {
      const formData = new FormData();
      formData.append('imageFile', file);

      axios.post('http://localhost:4000/analisisImage', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
        .then(response => {
          //console.log('Respuesta del servidor:', response.data);
          let jsonClean = response.data[0].replace(/\n/g, "") //se eliminan saltos de linea
          jsonClean = jsonClean.replace(/\\\"/g,"\"") // se eliminan \" por "
          let trueJson = JSON.parse(jsonClean) 
          let datos = trueJson["responses"][0]
          if(datos.hasOwnProperty('faceAnnotations')){
            setNCaras(datos["faceAnnotations"].length)
          }else{
            setNCaras("No se detectaron Rostros")
          }
          setInfoImage(datos["safeSearchAnnotation"])
          //console.log(jsonClean)
          //setInfoImage(trueJson)
          console.log(datos)
        })
        .catch(error => {
          console.error('Error al enviar el archivo:', error);
        });
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
          <Grid container>
            <CustomTextField
              sx={{ width: "80%", marginTop: 5, marginLeft: 5 }}
              type="text"
              inputProps={{
                // accept: "image/*", //se aceptaran todos los archivos que sean de tipo imagen
                accept:".jpg, .png"
              }}
              helperText="Numero de Rostros"
              FormHelperTextProps={{
                style: { color: "#B2BAC2" }, // Cambia el color del texto de ayuda a blanco
              }}
              name="numberFaces"
              value={String(nCaras)}
            />
          </Grid>
          
        <TableComponent Data={infoImage}/>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Grid>
  );
}
