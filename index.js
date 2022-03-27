// jimp y uuid
const Jimp = require('jimp')
const {v4:uuidv4} = require('uuid')
// express y fs
const express = require('express')
const app = express()
const fs = require('fs')


// Comentarios: Intenté subir el codigo via vercel pero por alguna razón no reconoce el css así que cualquier comentario en cómo hacerlo sería genial! 
//  Además, agregue un formulario y hartas opciones para poder cambiar cosas en la pagina.
//  Las opciones que vienen por default son las que son del requerimiento

const port = process.env.PORT || 8080
// abrimos servidor
app.listen(port,()=>{
    console.log(`Servidor corriendo en el puerto ${port}` )
})



// disponibilizamos rutas para html y css
app.get('/', (req, res)=>{
    res.writeHead(200,{'Content-Type':'text/html'})
    fs.readFile('index.html',(err,html)=>{
        res.end(html)
    })
})
app.get('/style', (req,res)=>{
    res.writeHead(200,{'Content-Type':'text/css'})
    fs.readFile(__dirname + '/assets/css/style.css',(err,css)=>{
        res.end(css)
    })
})

// Agregué función efecto para poder agregar más efectos además del grayscale
function efecto(ef,img){
    switch (ef){
        case 'grayscale':
            return img.grayscale()
        case 'sepia':
            return img.sepia()
        case 'mirror':
            return img.mirror(true,false)
        case 'invert':
            return img.invert()
    }
}


app.get('/imagen', (req,res)=>{
    // generamos id de 6 caracteres usando uuid
    const id = uuidv4().slice(0,6)
    // obtenemos parametros de la consulta usando express
    const {imagen: imgUrl, effect: effect, width: ancho, quality:calidad} = req.query

    // Procesamos la imagen
    Jimp.read(`${imgUrl}`)
    .then(img=>
    efecto(effect, img).quality(+calidad)
    .resize(+ancho,Jimp.AUTO)
    .writeAsync(`${id}.png`).then(()=>{
        res.writeHead(200, {'Content-Type': 'image/png'})
        fs.readFile(`${id}.png`,(error, data)=>{
            res.end(data)
            if(error){
                res.send('Lo siento pero tuvimos un error enviando tu imagen:(')
            }
        })
    })
    )
    // No me quedó muy claro como poder agregar este tipo de manejo de errores ya que al final termina siendo un error de que Jimp no puede procesar las imagenes si no va una url, así que lo agregué afuera, cualquier comentario genial!
    if(imgUrl==''){
        res.send('Recuerda agregar una URL')
    }
})

