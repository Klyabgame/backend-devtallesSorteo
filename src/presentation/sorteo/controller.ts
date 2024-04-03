import { Request, Response } from "express";
import { prisma } from "../../data";
import { isValidObjectId } from "../../helpers";

export class SorteoController{
    constructor(){
        this.getSorteos=this.getSorteos.bind(this);
        this.getSorteosOne=this.getSorteosOne.bind(this);
        this.postSorteos=this.postSorteos.bind(this);
        this.patchSorteos=this.patchSorteos.bind(this);
        this.deleteSorteos=this.deleteSorteos.bind(this);
    }

    async getSorteos(req:Request, res:Response){

        const sorteoData = await prisma.sorteo.findMany({
            where:{
                status:true,
            },
            include: {
                participantes: true,
              }
          });
        
          return res.status(200).json({sorteoData});
        

    }


    async getSorteosOne(req:Request, res:Response){

        const {id}=req.params;
        try {
            const isMongoId=isValidObjectId(id);            
            if(!isMongoId) return res.status(400).json({ error:'no enviaste un id valido' });

            const sorteoGetOne = await prisma.sorteo.findUnique({
            where: {
                id: id,
            },
            });
            if(!sorteoGetOne) return res.status(400).json({error:"el sorteo buscado no existe"});
            if(sorteoGetOne.status===false) return res.status(400).json({error:"el sorteo buscado a sido eliminado"});
            return res.status(200).json({ sorteoGetOne });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ error:'error al buscar el id' });
        }
    }

    async postSorteos(req:Request, res:Response){
        const {name,description,startDate,image, winner , status} = req.body;

        if(!req.user) return res.status(400).json({error:'Usuario no autenticado'});
        
        try {
            const sorteoData={
                name,
                usuarioId:req.user.id!,
                description,
                startDate,
                image,
                winner,
                status,
            }

            const sorteoPost = await prisma.sorteo.create({
                data:sorteoData
            });
            
            return res.status(200).json({ post:true,sorteoPost });
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:'Error al crear el sorteo'});
        }

    }

    async patchSorteos(req:Request, res:Response){

        const {id}=req.params;
        
        if(!id) return res.status(400).json({ error:'no enviaste un id' });
        const isMongoId=isValidObjectId(id);            
        if(!isMongoId) return res.status(400).json({ error:'no enviaste un id valido' });

        const {name,description,startDate,status,image,winner}=req.body;

        const sorteoBody={
            name,
            description,
            startDate,
            status,
            image,
            winner
        }

        try {
            console.log({ids:req.user?.id,id});
            const sorteoPatch=await prisma.sorteo.update({
                where:{
                    id:id,
                    usuarioId:req.user!.id
                },
                data:sorteoBody
            })

            

            if(!sorteoPatch) return res.status(400).json({error:'Error al actualizar el sorteo'});
            if(!sorteoPatch.usuarioId) return res.status(400).json({error:'Usuario no valido'});
            if(sorteoPatch.status===false) return res.status(400).json({error:'No puedes actualizar un sorteo eliminado'});
            return res.status(200).json({sorteoPatch });
            
        } catch (error) {
            console.log(error);
            return res.status(500).json({error:'ocurrio un error al momento de actualizar' });
        }

    }

    async deleteSorteos(req:Request, res:Response){

        const {id}=req.params;
        if(!id) return res.status(400).json({ error:'no enviaste un id' });
        const isMongoId=isValidObjectId(id);            
        if(!isMongoId) return res.status(400).json({ error:'no enviaste un id valido' });

        try {

            const findId=await prisma.sorteo.findUnique({
                where:{
                    id:id,
                    usuarioId:req.user!.id
                }
            })
            if(!findId) return res.status(400).json({ error:'no se encontro el sorteo a eliminar en la bd' });
            if(findId.status===false) return res.status(400).json({ error:`el id:${id} del sorteo ya a sido eliminado` });
            const sorteoDelete=await prisma.sorteo.update({
                where:{
                    id:id
                },
                data:{
                    status:false,
                }
            })
            return res.status(200).json({ status:'delete',sorteoDelete});

        } catch (error) {
            console.log(error);
            return res.status(500).json({error:'ocurrio un error al momento de eliminar de bd' });
        }
    }
}