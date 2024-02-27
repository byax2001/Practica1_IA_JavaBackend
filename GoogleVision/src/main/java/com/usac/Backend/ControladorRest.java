package com.usac.Backend;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;



@RestController
@Slf4j
@SpringBootApplication(exclude = {SecurityAutoConfiguration.class})
public class ControladorRest {
    @GetMapping("/")
    public String Comienzo() {
        log.info("Peticion GET - Inicio");
        log.debug("Información Extra: ");
        return "Hola Mundo";
    }
    @GetMapping("/1")
    public String Comienzo1() {
        log.info("Peticion GET - Inicio");
        log.debug("Información Extra: ");
        return "Hola Mundo";
    }

    @PostMapping("/analisisImage")
    @CrossOrigin(origins = "http://localhost:4000")
    public List<String> analizarImagen(MultipartFile imageFile) throws IOException {
        List<String> results = new ArrayList<>();
        if (imageFile == null) {
            results.add("Se envió un archivo nulo");
            return results;
        }
        byte[] imageB = imageFile.getBytes();
        String imageB64 = Base64.getEncoder().encodeToString(imageB);
        String keyV = "AIzaSyAz3G7fw2ZYe9rTBtPusiEZshRrP4P02JU"; // Agrega tu clave API aquí
        String url = "https://vision.googleapis.com/v1/images:annotate?key=" + keyV;
        /*
        * LABEL_DETECTION (detección de etiquetas) es una función de la API de Google Vision que identifica objetos, lugares, actividades, productos y otros elementos significativos en una imagen. Básicamente, proporciona una lista de etiquetas que describen el contenido de la imagen.
            Por ejemplo, si tienes una imagen de una playa, el LABEL_DETECTION podría devolver etiquetas como "playa", "mar", "arena", "cielo", "personas", etc.
        * TEXT_DETECTION: Para detectar texto en la imagen.
        * FACE_DETECTION: Para detectar rostros en la imagen.
        * LANDMARK_DETECTION: Para detectar puntos de referencia en la imagen.
        * LOGO_DETECTION: Para detectar logotipos en la imagen.
        * DOCUMENT_TEXT_DETECTION: Para detectar texto en documentos dentro de la imagen.
        * IMAGE_PROPERTIES: Para obtener propiedades de la imagen, como colores dominantes.
        * SAFE_SEARCH_DETECTION: Para detectar contenido inapropiado en la imagen.
        */
        String jsonBody = "{"
                + "\"requests\":[{"
                + "\"image\":{\"content\":\"" + imageB64 + "\"" + "},"
                + "\"features\":["
                + "{\"type\":\"FACE_DETECTION\"},"
                + "{\"type\":\"SAFE_SEARCH_DETECTION\"}"
                + "]}]"
                + "}";

        HttpHeaders headersp = new HttpHeaders(); //creo los headers
        headersp.setContentType(MediaType.APPLICATION_JSON); // establezco el tipo de archivo a mandar
        HttpEntity<String> rEntity = new HttpEntity<>(jsonBody, headersp); // creo la entidad http
        RestTemplate restTemplate = new RestTemplate(); // hago el template
        ResponseEntity<String> responseEntity = restTemplate.postForEntity(url, rEntity, String.class); // hago el response
        HttpStatus statusCode = (HttpStatus) responseEntity.getStatusCode(); // hago esto para verificar el stattus de la peticion
        if (statusCode == HttpStatus.OK) {
            String responseBody = responseEntity.getBody();
            System.out.println("Respuesta del servidor: " + responseBody);
            results.add(responseBody);
        } else {
            System.err.println("La solicitud no se pudo completar. Código de estado: " + statusCode);
        }
        return results;
    }
}
