/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.usac.Backend;
//PARA LAS CREDENCIALES DE GOOGLE CLOUD VISION

import com.google.auth.oauth2.GoogleCredentials;
import com.google.cloud.vision.v1.ImageAnnotatorSettings;
import com.google.cloud.vision.v1.ImageAnnotatorClient;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

// PARA EL ANALISIS DE IMAGENES
import com.google.cloud.vision.v1.AnnotateImageRequest;
import com.google.cloud.vision.v1.AnnotateImageResponse;
import com.google.cloud.vision.v1.BatchAnnotateImagesResponse;
import com.google.cloud.vision.v1.EntityAnnotation;
import com.google.cloud.vision.v1.Image;
import com.google.cloud.vision.v1.ImageAnnotatorClient;
import com.google.protobuf.ByteString;
import java.io.BufferedReader;
import java.io.FileInputStream;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

/**
 *
 * @author brandon
 */
//@RequestMapping("/controller") Esta linea sirve para esto: http://localhost:8080/controller/SiguientesPaths
@RestController
@Slf4j
public class ControladorRest {

    private ImageAnnotatorClient visionClient;

    public ControladorRest() throws IOException {
    }

    @GetMapping("/")
    public String Comienzo() {
        /*Para poder hacer uso de los logs se debe de configurar application.propierties
        que se encuentra en OtherSources7src/main/resources/<default package>*/
        log.info("Peticion GET - Inicio");
        log.debug("Información Extra: ");
        return "Hola Mundo";
    }

    @RestController
    public class ImageAnalysisController {

        @PostMapping("/analisisImage")
        //imageFile es el nombre como se debe de enviar la imagen en el form-data
        public List<String> analizarImagen(MultipartFile imageFile) throws IOException {
            List<String> results = new ArrayList<>();
            if (imageFile == null) {
                results.add("Se envió un archivo nulo");
                return results;
            }
            byte[] bytes = imageFile.getBytes();
            ByteString imgBytes = ByteString.copyFrom(bytes);
            Image image = Image.newBuilder().setContent(imgBytes).build();

            try (ImageAnnotatorClient visionClient = ImageAnnotatorClient.create()) {
                AnnotateImageRequest request
                        = AnnotateImageRequest.newBuilder()
                                .addFeatures(com.google.cloud.vision.v1.Feature.newBuilder().setType(com.google.cloud.vision.v1.Feature.Type.LABEL_DETECTION).build())
                                .setImage(image)
                                .build();

                BatchAnnotateImagesResponse response = visionClient.batchAnnotateImages(List.of(request));

                for (AnnotateImageResponse res : response.getResponsesList()) {
                    if (res.hasError()) {
                        System.err.println("Error: " + res.getError().getMessage());
                        continue;
                    }
                    for (EntityAnnotation annotation : res.getLabelAnnotationsList()) {
                        results.add(annotation.getDescription());
                    }
                }
            }
            return results;
        }
    }

    @PostMapping("/comienzo")
    public String procesarJsonEntrada(@RequestBody String jsonEntrada) {
        try {
            // Mapear el JSON de entrada a un objeto Java
            ObjectMapper objectMapper = new ObjectMapper();
            JsonEntrada entrada = objectMapper.readValue(jsonEntrada, JsonEntrada.class);

            // Crear un JSON de salida con la estructura requerida
            ObjectNode jsonSalida = objectMapper.createObjectNode();
            jsonSalida.put("Residencia", entrada.getPais());

            // Devolver el JSON de salida como String
            return objectMapper.writeValueAsString(jsonSalida);
        } catch (Exception e) {
            log.error("Error al procesar el JSON de entrada: {}", e.getMessage());
            return "Error al procesar el JSON de entrada";
        }
    }

}

class JsonEntrada {

    private String pais;
    private String continente;

    // Getters y Setters (puedes generarlos automáticamente en tu IDE)
    public String getPais() {
        return pais;
    }

    public void setPais(String pais) {
        this.pais = pais;
    }

    public String getContinente() {
        return continente;
    }

    public void setContinente(String continente) {
        this.continente = continente;
    }
}