
const URLRPS101="https://rps101.pythonanywhere.com/api/v1";
var rps101BD=[];//BD Info por Objeto
var LObjecten=[];//BD Obj EN
var LObjectes=[];//BD Obj Es
var labelcat=[];//BD Clasificacion por categoria
var labeltam=[];//BD Clasificacion por tamaño
const iconos ={
    "Elemental":"✨",
    "Transporte":"🚗",
    "Ciencia ficción":"👽",
    "Arma":"🔫",
    "Persona":"🚶🏼‍♂️",
    "Comestibles":"🍗",
    "Animal":"🐒",
    "Objeto":"📄",
    "Edificio":"🏦",
    "Naturaleza":"🌿",
    "Concepto":"🎭",
    "Muy Grande":"🪐", 
    "Grande":"🐘",
    "Mediano":"🚙", 
    "Pequeño":"🧯", 
    'Muy pequeño':"🐁"
}
const colorg = [
    "White",
    "Tan",
    "Turquoise",
    "GreenYellow",
    "yellow",
    "Plum",
    "Gold",
    "LightSalmon",
    "Pink",
    "IndianRed",
    "Brown",
    "Navy",
    "DarkCyan"
];

/**
 * Descargar BD RPS101 API
 */
async function rps101getall(){
    let pobjloss = await fetch(URLRPS101+"/objects/all");
    var objloss = await pobjloss.json();
    //objloss=objloss["winning outcomes"].map((x) => x[1])
    rps101BD=objloss;
}

var Pjson = rps101getcsv('/Data/rps101BD.csv',labelcat,labeltam,rps101BD).then(()=>{
    rps101BD=rps101BD[0];
    labelcat=labelcat[0];
    labeltam=labeltam[0];
});


/**
 * Descargar BD RPS101
 */
async function rps101getcsv(myurl,cats,tams,ljson){
    return await fetch(myurl)
    // Exito
    .then(response => response.text())// to text
    .then(text =>rps101CSVToJSON(text,";"))// to json
    .then((res)=>{
        cats.push(res[0]);
        tams.push(res[1]);
        ljson.push(res[2]);        
    })
    .catch(err => console.log('Solicitud fallida', err)); // Capturar errores
}

/**
 * Convertir csv a json formato {Objeto: [Palabra en Inglés,Palabra en Español,Categoría,Tamaño,Descripción]}
 */
function rps101CSVToJSON(data, delimiter = ','){
    
    //console.log(JSON.stringify(data));
    const titles = data.slice(0, data.indexOf('\r\n')).split(delimiter);
    
    var fdata = {};
    fdata[titles[0]] = titles.slice(1);
    var tams=["Tamaños"];
    var cats=["Categorias"];
    data
        .slice(data.indexOf('\r\n'))
        .split('\r\n')
        .map(v => {
            if (v!="") {
                const values = v.split(delimiter);
                if(!cats.includes(values[2]))
                    cats.push(values[2])
                if(!tams.includes(values[3]))
                    tams.push(values[3])
                fdata[values[0]] = values.slice(1);
            }
        });
    return [cats,tams,fdata];
};