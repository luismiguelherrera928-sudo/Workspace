let edad = 16; 
let tienePermiso = true; 

if (edad >= 18 && tienePermiso) {
    console.log("Puede entrar");
} else if (edad >= 18 && !tienePermiso) {
    console.log("Necesita permiso");
} else {
    console.log("No puede entrar");
}
