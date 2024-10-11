import Konva from "konva";

let konvaInstance = null

export function createKonva(params){
    if(!konvaInstance) {
        konvaInstance = new Konva.Stage(params)
    }

    return konvaInstance
}

function getKonvaInstance(){
    if(!konvaInstance) {
        throw new Error('Please run createKonva function first!')
    }

    return konvaInstance
}

export default getKonvaInstance