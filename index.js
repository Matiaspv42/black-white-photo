// jimp y uuid
const Jimp = require('jimp')
const {v4:uuidv4} = require('uuid')
// express y fs
const express = require('express')
const app = express()
const fs = require('fs')
const { AUTO } = require('jimp')
const { grayscale } = require('jimp')
const { sepia } = require('jimp')
const { mirror } = require('jimp')
const { invert } = require('jimp')

// abrimos servidor
app.listen(8080,()=>{
    console.log('Servidor corriendo en el puerto 8080')
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

// function efecto
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
    const {imagen: imgUrl, effect: effect, width: ancho, height: alto, quality:calidad} = req.query
    console.log(req.query, calidad)
    Jimp.read(`${imgUrl}`)
    .then(img=>
    efecto(effect, img).quality(+calidad)
    .resize(+ancho,+alto)
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
    
})

