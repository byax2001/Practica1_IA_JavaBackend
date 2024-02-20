/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.usac.Backend;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
/**
 *
 * @author brandon
 */
@RestController
@Slf4j
public class ControladorRest {
    
    @GetMapping("/")
    public String Comienzo(){
        log.info("Peticion GET - Inicio");
        return "Hola Mundo";
    }
    
    
    
}
