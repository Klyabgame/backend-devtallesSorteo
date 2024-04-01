import { Router } from 'express';
import { ParticipanteController } from './controller';
import { validateTokenUser } from '../../middleware';




export class ParticipanteRoutes {


  static get routes(): Router {

    const router = Router();

    const controller=new ParticipanteController();
    // Definir las rutas
    router.get('/', controller.getParticipante );
  
    router.delete('/:id',[validateTokenUser], controller.deleteParticipanteOne );
    router.delete('/', [validateTokenUser],controller.deleteParticipanteFull );


    return router;
  }


}