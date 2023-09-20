
let searchForm = document.getElementById("searchform");//Formulario Busqueda
let LObject= document.getElementById("LObject");//Lista cartas
let btn_all= document.getElementById("btn_all");//Lista categorias
let Lcat= document.getElementById("Nav_CAT");//Lista categorias
let arrcat={IDENTY:"CAT"};
let Ltam= document.getElementById("Nav_TAM");//Lista tamaños
let arrtam={IDENTY:"TAM"};
let Lsea= document.getElementById("NAV_SEA");//Lista Total
let searching = document.getElementById("searching");//Boton busqueda
let btn_navcat = document.getElementById("btn_navcat");//Boton tag modal Categoria
let btn_navtam = document.getElementById("btn_navtam");//Boton tag modal Tamaño
let btn_navwin = document.getElementById("btn_navwin");//Boton tag modal win
let modalmyDiv = document.getElementById("myDiv");//div modal graf
let modalmyDivtex = document.getElementById("myDivtex");//div modal tab
let myttex = document.getElementById("myttex");//div modal text
let crdact="";//carta actual
let modtitle = document.getElementById("ModalLabel");//Titulo modal
let modaldes = document.getElementById("Modaldes");//Titulo modal
let modalfoot = document.getElementById("Modalfoot");//Titulo modal



//Lienzo Grafica
var myPlot = document.getElementById("myDiv");
var layout = {};//Set lienzo
//Datos para Inicializar Grafica
var data = {};

var check = {
    source:[],
    target:[],
    value:[]
};//Estado anterior
var isupdate = true;//Estado grafica

searchForm.addEventListener("submit", findobject);
btn_all.addEventListener("click",findobject);

btn_navcat.addEventListener("click",clicnav);
btn_navtam.addEventListener("click",clicnav);
btn_navwin.addEventListener("click",clicnav);

Pjson.then(()=>{
    LObjecten=Object.getOwnPropertyNames(rps101BD);
    LObjecten.forEach(element => {
        LObjectes[rps101BD[element][0]]=element;        
    });
    labelcat.forEach((element,i) => {
        if (i>0) {
            Lcat.innerHTML+=newswich(element,arrcat)
        }
    });
    labeltam.forEach((element,i) => {
        if (i>0) {
            Ltam.innerHTML+=newswich(element,arrtam)
        }
    });
    
    endloadbd();
})



/// FUNCIONES

/**
 * Al terminar de leer BD
 */
function endloadbd(){
    //Inicializar
    [layout,data]=InitSankey("Ganancia por tamaños",'h',3.45,30,labeltam,colorg)
    //Actualizar informacion
    //SetSankeyPH(labeltam,data,50)
    SetSankey(labeltam,data,GetData())
    //BackUp
    check = {
        source: data[0].link.source,
        target: data[0].link.target,
        value: data[0].link.value,
    };
    //Graficar
    Plotly.react("myDiv", data, layout);
    //DINAMICO
    myPlot.on("plotly_hover", SetSankeyByEvent);
    //myPlot.on('plotly_unhover', resetplot);
}

function findobject(e){
    e.preventDefault();
    pt(e)
    if (e.target.id=="btn_all") {
        LObject.innerHTML="";
        Object.getOwnPropertyNames(rps101BD).forEach((element,ind)=>{
            if (ind>0) {
                LObject.innerHTML+=newcard(element);
            }
            
        });
    } else {
        if (searching.value == "") {
            if (checker(Object.values(arrcat))||checker(Object.values(arrtam))) {
                
                var setcat=labelcat.filter((e,i)=>arrcat[e]==true)
                var settam=labeltam.filter((e,i)=>arrtam[e]==true)
                let cards=LObjecten.filter((e,i)=>{
                    return setcat.includes(rps101BD[e][1])||settam.includes(rps101BD[e][2]);
                })
                LObject.innerHTML="";
                cards.forEach(element => {
                    LObject.innerHTML+=newcard(element);
                });

            } else {
                alert("Busqueda Vacia");
            }

        } else {
            // perform operation with form input
            LObject.innerHTML=newcard(searching.value);
            searching.value = "";
        }
    }
}

/**
 * Crear switches
 */
function newswich(Obj,arr){

    arr[Obj]=false;

    return `<div class="form-check form-switch px-5">
                <input id="SW_${Obj}" class="form-check-input" type="checkbox" role="switch" onclick='SWvrf("${Obj}","${arr["IDENTY"]}")'>
                <label class="form-check-label" for="SW_${Obj}">${Obj}</label>
            </div>`
}

/**
 * Verificar SW
 */
function SWvrf(Obj,id){
    if (id=="CAT") {
        arrcat[Obj]=!arrcat[Obj];
    } else {
        arrtam[Obj]=!arrtam[Obj];
    }
    let tex=""
    labelcat.forEach((element,i) => {
        if (i>0) {

            if (arrcat[labelcat[i]]) {
                tex+=" "+element; 
            }
            
        }
        
    });
    labeltam.forEach((element,i) => {
        if (i>0) {
            if (arrtam[labeltam[i]]) {
                tex+=" "+element;
            }
            
        }
        
    });

    var setcat=labelcat.filter((e,i)=>arrcat[e]==true); 
    var settam=labeltam.filter((e,i)=>arrtam[e]==true);
    if (setcat.length==0&&settam.length==0) {
        searching.disabled=false;
        searching.placeholder="Search";
    } else {
        searching.disabled=true;
        searching.placeholder="Clasificacion";
    }
    Lsea.innerHTML=tex
}

/**
 * Crear cartas
 */
function newcard(Obj){
    const verf=[LObjecten.includes(Obj),Object.getOwnPropertyNames(LObjectes).includes(Obj)]
    
    if (checker(verf)) {
        if (verf[1]) {
            Obj=LObjectes[Obj];            
        }
        return `<div class="col my-2">
                    <div class="card text-white bg-secondary ">
                        <div class="d-flex justify-content-between align-items-center px-5 py-1">
                            <h5 class="card-title">${rps101BD[Obj][0]}</h5>
                            <h6 class="card-subtitle">#${LObjecten.findIndex((element) => element==Obj)}</h6>
                        </div>

                        <button type="button" data-bs-toggle="modal" data-bs-target="#exampleModal" class="card-body d-flex bg-white text-start ">
                            <div id="crd_${Obj}" onmouseover="hoverchact('${Obj}')" class="hoverch d-flex flex-column rounded-4 car" style="background-color:${colorg[labelcat.findIndex(e=>e==rps101BD[Obj][1])]};">
                                <p class="card-text">${iconos[rps101BD[Obj][1]]} ${rps101BD[Obj][1]}</p>
                                <p class="card-text">${iconos[rps101BD[Obj][2]]} ${rps101BD[Obj][2]}</p>
                            </div>
                            <div class="d-flex">
                                <img src="Data\\IMG\\${Obj}.png" class="card-img" alt="...">
                            </div>
                            
                        </button>
                    </div>
                </div>`
    } else {
        alert("No Encontrado")
    }    
}

/**
 * Carta actual
 */
function hoverchact(Obj) {
    btn_navwin.classList.remove("active");
    btn_navcat.classList.remove("active");
    btn_navtam.classList.remove("active");
    crdact=Obj;
    modtitle.innerHTML=`<div class="p-2 fs-3 bg-secondary">${crdact}</div>
                        <img src="Data\\IMG\\${Obj}.png" class="mod-img" alt="...">
                        <div class="d-flex flex-col bg-secondary">
                            <div class="p-2 fs-3 ">#${LObjecten.findIndex((element) => element==crdact)}</div>
                            <button type="button" class="btn-close p-2" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>`;
    modaldes.innerHTML=`<h3>${rps101BD[crdact][3]}</h3>`;
    modalfoot.innerHTML=`<div class="p-2 fs-3" style="background-color:${colorg[labelcat.findIndex(e=>e==rps101BD[Obj][1])]}">${rps101BD[crdact][1]}</div> 
                        <div class="p-2 fs-3 bg-secondary">${rps101BD[crdact][2]}</div>`
    modalmyDiv.innerHTML="";
    myttex.innerHTML="";
}
/**
 * Cambiar tag modal
 */
function clicnav(e) {
    if (e.target.id=="btn_navwin") {
        modalmyDiv.hidden=true;
        modalmyDivtex.hidden=false;
        modalmyDivtex.classList.remove("hidden");
        btn_navwin.classList.add("active");
        btn_navcat.classList.remove("active");
        btn_navtam.classList.remove("active");
        rps101getwin(crdact,'w')
        .then((arrw)=>myttex.innerHTML=arrw)
        .catch((e)=>alert(e))
    }
    if (e.target.id=="btn_navcat") {
        modalmyDiv.hidden=false;
        modalmyDivtex.hidden=true;
        modalmyDivtex.classList.add("hidden");
        btn_navwin.classList.remove("active");
        btn_navcat.classList.add("active");
        btn_navtam.classList.remove("active");
        myttex.innerHTML="";
        //Inicializar
        [layout,data]=InitBar("Ganancia por Categoria","v",labelcat,Array(labelcat.length).fill(0),colorg)
        //Actualizar informacion
        //SetSankeyPH(labeltam,data,50)
        rps101getwin(crdact,0)
        .then((arrw)=>dataa=arrw)
        .then((res)=>{
            SetBar(labelcat,data,res);
            Plotly.react("myDiv", data, layout);
        })
        .catch((e)=>alert(e))
    }

    if (e.target.id=="btn_navtam") {
        modalmyDiv.hidden=false;
        modalmyDivtex.hidden=true;
        modalmyDivtex.classList.add("hidden");
        btn_navwin.classList.remove("active");
        btn_navcat.classList.remove("active");
        btn_navtam.classList.add("active");
        myttex.innerHTML="";
            //Inicializar
        [layout,data]=InitSankey("Ganancia por tamaños",'h',3.45,30,labeltam,colorg)
        //Actualizar informacion
        //SetSankeyPH(labeltam,data,50)
        rps101getwin(crdact,0)
        .then((arrw)=>dataa=arrw)
        .then((res)=>{
            SetSankey(labeltam,data,res)
            check = {
                source: data[0].link.source,
                target: data[0].link.target,
                value: data[0].link.value,
            };
            Plotly.react("myDiv", data, layout);
        })
        .catch((e)=>alert(e))
    }
}

/**
 * //Inicializa Grafica Barras
 */
function InitBar(titlee,orientacion,labell,countt,colorr){
    //Inicializar Lienzo
    let layoutb = {
        title: titlee,
        paper_bgcolor:"#202124",
        plot_bgcolor:"#202124",
        width: 600,
        height: 700,
    
        font: {
            color: "white",
            size: 12,
        },
    };

    //Inicializar data
    let datab={
        type: "bar",
        orientation: orientacion,
        marker: {
            color: [...colorr],
        },
    
        x: [...labell],
        y: [...countt],
        
    };
    datab = [datab];

    return [layoutb,datab]
}

/**
 * //Ol=Array a graficar
 */
function SetBar(labelgg,datab,Ol) {
    datab[0].x=[...labelgg].slice(1);//Categorias
    datab[0].y = Array(datab[0].x.length).fill(0);//Valor cero

    Ol.forEach((element) => {
        //find label (CAT) CAT:val
        const cat = labelgg.findIndex((elementg) => elementg == rps101BD[element][1]);//Clasificar
        datab[0].y[cat-1]+=1;
    });

}

/**
 * //Inicializa Grafica Sankey
 */
function InitSankey(titlee,orientacion,pading,thickness,labell,colorr){
    //Inicializar Lienzo
    let layoutt = {
        title: titlee,
        paper_bgcolor:"#202124",
        plot_bgcolor:"#202124",
        width: 600,
        height: 700,
    
        font: {
            color: "white",
            size: 12,
        },
    };

    //Inicializar data
    let dataa={
        type: "sankey",
        orientation: orientacion,
        node: {
            pad: pading,
            thickness: thickness,
            line: {
                color: "grey",
                width: 0.25,
            },
            label: [...labell],
            color: [...colorr],
        },
    
        link: {
            source: [],
            target: [],
            value: [],
        },
    };
    dataa = [dataa];

    return [layoutt,dataa]
}

/**
 * //LLENAR PLACEHOLDER
 * add= Numero de placeholders
 */
function SetSankeyPH(labelgg,dataa,add) {
    const ncat=labelgg.length;//No Categorias
    dataa[0].link.source=Array(ncat-1).fill(0);//Central
    dataa[0].link.target=[...Array(ncat).keys()].slice(1);//Categorias
    dataa[0].link.value=Array(ncat-1).fill(add/(ncat-1));//Distribucion Equitativa
    
    
    var label=[];
    var auxi=1;
    for (var i = ncat; i < ncat+add; i++) {
        label.push("try "+(i-ncat+1));//Place holder
        dataa[0].link.source.push(auxi);
        dataa[0].link.target.push(i);
        if ((i+1-ncat)%(add/(ncat-1))==0&&(i-ncat)!=0) {//Equitativo
            auxi=auxi+1;
        }
        
    }

    dataa[0].node.label=dataa[0].node.label.concat(label);//distribuir

    dataa[0].link.value = dataa[0].link.value.concat(Array(dataa[0].link.source.length).fill(1));//Valor unitario
}
/**
 * Consultar array RPS101 Gana contra
 */
async function rps101getwin(Obj,ret){
    let pobjloss = await fetch(URLRPS101+"/objects/"+Obj);
    var objloss = await pobjloss.json();
    if (ret=="w") {
        let tex="";
        objloss=objloss["winning outcomes"].forEach((elm,indx) => {
            tex+=newitemtr(`${Obj} ${elm[0]} ${elm[0]}`,indx);//Agregar fila
        });
        return tex;
    } else {
        objloss=objloss["winning outcomes"].map((x) => x[1])
        return objloss; 
    }
}

/**
 * Funcion para crear div filas 
 */
function newitemtr(val,indx){
    //agregar columnas
    return `<tr>
                <th scope="row">${indx+1}</th>
                <td>${val}</td>
            </tr>`;
}


/**
 * //Get data peticion a api
 * //Obj=Objeto a buscar
*/
function GetData(Obj) {

    if (Obj) {
        //leer [x , Ol]  x:esp OL:OE OL:TAM
        rps101getwin(Obj,0).then((arrw)=>dataa=arrw).catch((e)=>alert(e))
        
    } else {
        var dataa=Object.keys(rps101BD)//ALL
        dataa.shift();
    }
    

    
    return dataa
}


/**
 * //Ol=Array a graficar
 */
function SetSankey(labelgg,dataa,Ol) {

    const ncat = labelgg.length;//Numero categorias

    dataa[0].link.source=Array(ncat-1).fill(0);//Central
    dataa[0].link.target=[...Array(ncat).keys()].slice(1);//Categorias

    Ol.forEach((element, index) => {
        //find label (TAM) TAM:val

        const tam = labelgg.findIndex((elementg) => elementg == rps101BD[element][2]);//Clasificar
        
        dataa[0].node.label.push(rps101BD[element][0]);
        dataa[0].link.source.push(tam);
        dataa[0].link.target.push(index + ncat);
        // pt(tam+" - "+(index + ncat))
    });
    
    //Inicializar contador de clasificacion
    var counts = {};
    //Contar Objetos por categoria
    dataa[0].link.source.forEach(function (x) {
        counts[x] = (counts[x] || 0) + 1;
    });

    //Reasignar valores a categorias
    Object.entries(counts).forEach(([key, value]) => {
        dataa[0].link.value[key-1] = value;
    });

    //Asignar valor unitario por Objeto
    dataa[0].link.value = dataa[0].link.value.concat(Array(dataa[0].link.source.length).fill(1));
}


/**
 * //Zoom Dinamico por evento
 */
function SetSankeyByEvent(datae){
    try {//Error evento no nodo
        indexact = datae.points[0].index//Nodo seleccionado
        if (
            datae.points[0].label != "" &&//Nodo No categoria
            0 < indexact && indexact < 6 &&//Nodo Simple
            labeltam.includes(datae.points[0].label)&&//En Categoria
            isupdate == true//Antisolapamiento
        ) {
            isupdate = false;//En animacion
            var arraytarget=allOccurrences(data[0].link.source, indexact);//Obtener miembros

            var update = {//Datos Para Zoom
                link: {
                    source: Array(arraytarget.length).fill(indexact),
                    target: arraytarget,
                    value: Array(arraytarget.length).fill(1),
                },
            };

            Plotly.restyle("myDiv", update);//Graficar
            setTimeout(() => {//Antisolapamiento
                isupdate = true;
            }, 1100);

        }
        if (indexact == 0 && isupdate == true) {//Reset
            resetplot(check);
        }
    } catch (error) {//Error por evento no nodo
        console.log("e");
    }
}

/**
 * //Recuperar grafica despues de zoom
 */
function resetplot(checkk) {
    var update = {
        link: {
            source: checkk.source,
            target: checkk.target,
            value: checkk.value,
        },
    };

    Plotly.restyle("myDiv", update);
}


/**
 * find all index
 */
function allOccurrences(arr, value) {
    var indices = [];
    var idx = arr.indexOf(value);
    while (idx != -1) {
    indices.push(idx+1);
    idx = arr.indexOf(value, idx+1);
    }
    return indices;
}



//Utilidades
let checker = arr => arr.some(v => v === true);

function multiFilter(array, filters) {
    let filterKeys = Object.keys(filters);
    return array.filter((item) =>
        filterKeys.every((key) => filters[key].indexOf(item[key]) !== -1)
    );
}




function pt(x){
    if (x) {
        console.log(x)
    } else {
        console.log("wtf")
    }
}