import { Grid, Typography,TextareaAutosize, FormControl } from "@mui/material";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Alert } from '@mui/material';
import { useState,useEffect,useContext, useRef} from "react";
import CustomTextField from "../components/CustomTextField/CustomTextField";
import ColorButton from "../components/ColorButtom/ColorButton";
import axios from "axios";


const TableComponent = ({Data, Percentage}) => {
  return (
    <TableContainer sx={{marginTop:5}} component={Paper}>
      <Table sx={{}}>
        <TableHead>
          <TableRow sx={{backgroundColor:"#434343"}}>
            <TableCell sx={{color:"white"}}>Category</TableCell>
            <TableCell sx={{color:"white"}}>Value</TableCell>
            <TableCell sx={{color:"white"}}>Percentage</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {Object.keys(Data).map((category, index) => (
            <TableRow key={index}>
              <TableCell>{category}</TableCell>
              <TableCell>{Data[category]}</TableCell>
              <TableCell>{Percentage[category]}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );

};

export default function Homepage() {
  const [showAlert,setShowAlert]=useState(false)  // si no es apta para la institucion
  const [showAlertV,setShowAlertV]=useState(false)  // si es valida
  const [percentage,setPercentage] = useState({
    adult: 0,
    medical: 0,
    racy: 0,
    spoof: 0,
    violence: 0
  });
const [infoImage, setInfoImage] = useState({
  adult: "",
  medical: "",
  racy: "",
  spoof: "",
  violence: ""
});

const valueTicket = {
  VERY_UNLIKELY: 20,
  UNLIKELY: 40,
  POSSIBLE: 60,
  LIKELY: 80,
  VERY_LIKELY: 100
};

const [nCaras, setNCaras] = useState("0")
const [image, setImage] = useState('https://science.nasa.gov/wp-content/uploads/2023/06/spiral-galaxy-jpg.webp');
const fileInputRef = useRef(null); // Crear una referencia al input de tipo file
// con el useRef se puede jalar el valor de un input creado en otra clase y colocarlo adentro de otra variable desada

const handleCargarClick = () => {
    setPercentage({
      adult: 0,
      medical: 0,
      racy: 0,
      spoof: 0,
      violence: 0
    })
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
          
          const percentageAux = {};
          Object.keys(datos["safeSearchAnnotation"]).forEach(key => {
            const stringValue = datos["safeSearchAnnotation"][key];
            console.log(stringValue)
            percentageAux[key] = valueTicket[stringValue];
          });
          console.log(percentageAux)
          setPercentage(percentageAux)
          //console.log(datos)
        })
        .catch(error => {
          console.error('Error al enviar el archivo:', error);
        });
    } else {
      console.log('No se ha seleccionado ningún archivo.');
    }
  };

  useEffect(() => {
    // Check if 'violence' percentage is greater than or equal to 60
    setShowAlertV(false)
    setShowAlert(false)
    if (parseInt(percentage.violence) >= 40 && parseInt(percentage.racy) >= 40 && parseInt(percentage.adult) > 20) {
      // If true, apply blur to the image
      document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
      setShowAlert(true)
    }else if (parseInt(percentage.violence) >= 60) {
      // If true, apply blur to the image
      document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
    } else if (parseInt(percentage.racy) > 40) {
      // If true, apply blur to the image
      document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
    } else if (parseInt(percentage.adult) >= 40) {
      // If true, apply blur to the image
      document.getElementById('ImagenAnalizada').style.filter = 'blur(5px)';
    } else  if (parseInt(percentage.violence) >0){ // si no es ninguna de las condiciones pero tan siquiera tiene valores (por que si 
                                                  //  se escogio la opcion cargar todo sera 0 pues no se evaluara nada solo se pondra
                                                  // la imagen)
      document.getElementById('ImagenAnalizada').style.filter = 'none';
      setShowAlertV(true) // si la imagen es valida, si no en cualquier cambio desaparecera esta opcion
    }
    else {
      // Otherwise, remove blur
      document.getElementById('ImagenAnalizada').style.filter = 'none';
    }
  }, [percentage]);
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
          <img  id="ImagenAnalizada" src={image} alt="Imagen" style={{ maxWidth: '100%', maxHeight: '100%' }} />
          {showAlert && <Alert severity="error" sx={{ marginTop: 2 }}>Imagen no apta para la institución</Alert>}
          {showAlertV && <Alert severity="success" sx={{ marginTop: 2 }}>Imagen Valida</Alert>}
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
          
        <TableComponent Data={infoImage} Percentage={percentage}/>
        </Grid>
        <Grid item xs={1} />
      </Grid>
    </Grid>
  );
}
