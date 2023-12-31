import {Transform, Expose } from "class-transformer";
import { IsDefined} from 'class-validator';
import {conexion} from '../db/atlas.js';

export class Clientes{
    /**
    ** Variables de entrada:
    ** id_vehiculo, id_clase_alarma
    */
    @Expose({name: "CLIENTE_ID"})
    @Transform(({value}) => {
    let data = /^([1-9]\d*)$/g.test(value);
    if (data && typeof value == "number"){ 
        return Number(value);
    } 
    else{
        throw {status:401, message:"Error en el CLIENTE_ID"};
    }    
    })
    @IsDefined({message: ()=>{ throw {status:422, message: "El parametro CLIENTE_ID es obligatorio"}}})
    ID_Cliente: number

    @Expose({name: "NAME"})
    @Transform(({value}) => {
        let data = /^[a-zA-Z ]+$/g.test(value);
        if ( data && typeof value == "string"){ 
            return String(value);
        } 
        else{
            throw {status:401, message:"Error en el NAME"};
        }    
      })
    @IsDefined({ message: 'El parametro NAME es obligatorio.' })
    Nombre: string

    @Expose({name: "LAST_NAME"})
    @Transform(({value}) => {
        let data = /^[a-zA-Z ]+$/g.test(value);
        if ( data && typeof value == "string"){ 
            return String(value);
        } 
        else{
            throw {status:401, message:"Error en el LAST_NAME"};
        }    
      })
    @IsDefined({message: ()=>{ throw {status:422, message: "El parametro LAST_NAME es obligatorio"}}})
    Apellido: string

    @Expose({name: "NUMBER_DNI"})
    @Transform(({value}) => {
    let data = /^([1-9]\d*)$/g.test(value);
    if (data){ 
        return String(value);
    } 
    else{
        throw {status:401, message:"Error en el NUMBER_DNI"};
    }    
    })
    @IsDefined({message: ()=>{ throw {status:422, message: "El parametro NUMBER_DNI es obligatorio"}}})
    DNI: string


    @Expose({name: "ADDRESS"})
    @Transform(({value}) => {
        let data = /^([a-zA-Z0-9\s.,#-])|undefined+$/i.test(value);
        if ( data){ 
            return String(value);
        } 
        else{
            throw {status:401, message:"Error en el ADDRESS"};
        }    
    })
    Direccion: string

    @Expose({name: "PHONE"})
    @Transform(({value}) => {
        let data = /^(?:[1-9]\d*|undefined)$/g.test(value);
        if (data){ 
            return String(value);
        } 
        else{
            throw {status:401, message:"Error en el PHONE"};
        }    
    })
    Telefono: string

    @Expose({name: "EMAIL"})
    @Transform(({value}) => {
        let data = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}|undefined+$/g.test(value);
        if (data){ 
            return String(value);
        } 
        else{
            throw {status:401, message:"Error en el EMAIL"};
        }    
    })
    Email: string

    constructor(p1:number = 10, p2:string = "nombre", p3:string = "apellido", p4:string ="123", p5:string = "carea122", p6:string ="123", p7:string = "edaca@gmail.com"){
        this.ID_Cliente = p1;
        this.Nombre = p2;
        this.Apellido  = p3;
        this.DNI = p4;
        this.Direccion = p5;
        this.Telefono = p6;
        this.Email = p7;
    }

    async dniEspeci(DNII:string){
        let db = await conexion();
        let resultado = await db.collection("Cliente").find({DNI: DNII}).toArray();
        return resultado;
    }



    async allTabla() {
        try {
            let db = await conexion();
            let cliente = db.collection("Cliente");       
            return  cliente.find().toArray();
        } catch (error) {
            throw { status: 500, message: "Error al obtener los registros de la tabla Cliente." };
        }
    }

    async alquiler(){
        let db = await conexion();
        let resultado = await db.collection("Cliente").aggregate([
            {
              $lookup: {
                from: "Alquiler",
                localField: "_id",
                foreignField: "ID_Cliente",
                as: "Alquiler"
              }
            },
            {
              $unset: [
                "_id",
                "Alquiler"
            ]       
            }
          ]).toArray();
        return resultado;
    }

}