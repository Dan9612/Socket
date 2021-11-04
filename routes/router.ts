import { Router, Request, Response } from 'express';
import Server from '../classes/server';
import { usuariosConectados } from '../sockets/socket';


const router = Router();

// Petición GET
router.get('/mensajes', ( req: Request, res: Response ) => {

    res.json({
        ok: true,
        mensaje: 'GET'
    });

});

// Petición POST
router.post('/mensajes', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;

    const payload = { cuerpo, de }

    const server = Server.instance;

    server.io.emit( 'mensaje-nuevo', payload );

    res.json({
        ok: true,
        cuerpo,
        de
    });

});

// Petición POST - param
router.post('/mensajes/:id', ( req: Request, res: Response ) => {

    const cuerpo = req.body.cuerpo;
    const de     = req.body.de;
    const id     = req.params.id;

    const payload = {
        de,
        cuerpo  
    }

    const server = Server.instance;

    server.io.in( id ).emit( 'mensaje-privado', payload );


    res.json({
        ok: true,
        cuerpo,
        de,
        id
    });

});


// servicio para obtener todos los IDs de los usuarios
router.get('/usuarios', ( req: Request, res: Response ) => {

    const server = Server.instance;

    server.io.fetchSockets().then((sockets) => {
        res.json({
            ok: true,
            // clientes
            clientes: sockets.map( cliente => cliente.id)
        });
    }).catch((err) => {
        res.json({
            ok: false,
            err
        })
    });

});


// obtener usuarios y sus nombres
router.get('/usuarios/detalle', ( req: Request, res: Response ) => {

    res.json({
        ok: true,
        // clientes
        clientes: usuariosConectados.getLista(),
    });
});





export default router;

