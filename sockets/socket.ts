import { Socket } from 'socket.io';
import SocketIO from 'socket.io';
import { UsuariosLista } from '../classes/usuarios-lista';
import { Usuario } from '../classes/usuario';


export const usuariosConectados = new UsuariosLista();


export const conectarCliente = ( cliente: Socket, io: SocketIO.Server) => {

    const usuario = new Usuario( cliente.id );
    usuariosConectados.agregar( usuario );

}


// Desconectar Cliente
export const desconectar = ( cliente: Socket, io: SocketIO.Server) => {

    cliente.on('disconnect', () =>{
        console.log('Cliente desconectado');

        usuariosConectados.borrarUsuarios( cliente.id );

        io.emit( 'usuarios-activos', usuariosConectados.getLista() );
    });
}


// Escuchar mensajes
export const mensaje = ( cliente: Socket, io: SocketIO.Server ) => {

    cliente.on('mensaje', ( payload: { de: string, cuerpo: string }) => {

        console.log('Mensaje recibido', payload );

        io.emit('mensaje-nuevo', payload );
    });
}

// Configurar Usuario
export const configurarUsuario = ( cliente: Socket, io: SocketIO.Server ) => {

    cliente.on('configurar-usuario', ( payload: { nombre: string }, callback: Function ) => {

        usuariosConectados.actualizarNombre( cliente.id, payload.nombre );

        io.emit( 'usuarios-activos', usuariosConectados.getLista() );

        callback({
            ok: true,
            mensaje: `Usuario ${ payload.nombre }, configurado`
        });
        // io.emit('mensaje-nuevo', payload );
    });
}


// Obtener Usuario
export const obtenerUsuario = ( cliente: Socket, io: SocketIO.Server ) => {

    cliente.on('obtener-usuarios', () => {

        io.to( cliente.id ).emit( 'usuarios-activos', usuariosConectados.getLista() );

    });
}