backend-devtallesSorteo

# Ejecutar en desarrollo
1. clonar el repositorio
2. Ejecutar el comando
```
npm install
```
3. verificar y llenar las variables de entorno
```
DATABASE_URL= link de acceso a una base de datos de mongo db
TOKEN_SECRET=cualquiercosa
BACKEND_URL=http://localhost:3000 "en caso sea tu puerto"
ClientID= esto viene de la api de discord
ClientSecret= esto viene de la api de discord
PORT=3000
DevtallesID= id en este caso del discord de devtalles
token=
PUBLIC_PATH=public
ORIGIN1= link del frontend para ser habilitado por cors
```
4. rutas

```
 1. {{url}}/api/usuario/login    "Ruta para hacer el login"
 {
    "email":"admin@gmail.com",
    "password":"1234"
 }
```
```
 2. {{url}}/api/usuario/validate-tokenRefresh    "Ruta para obtener el token"

 :::Ejemplo de respuesta de la api
 {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjoiNjVmZ....."
}
```
5. Acceso a rutas criticas
* Para crear , actualizar o eliminar un sorteo se debe enviar el token como cabecera
```
Authorization bearer eyJhbGciOiJIUzI1NiIsInR5c......
```
* Para actualizar y eliminar un participante se debe tambien enviar el token como cabecera
```
Authorization bearer eyJhbGciOiJIUzI1NiIsInR5c......
```
