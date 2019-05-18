module.exports = (mongoose) => {
    const types = [
        { nombre: "Departamento" },
        { nombre: "Cabaña" },
        { nombre: "Casa" },
        { nombre: "Duplex" }
      ]
      const ventas = [
        { nombre: "Directa" },
        { nombre: "Subasta" },
        { nombre: "Hotsales" }
      ]

    function getUsuario(userId){
        const promise = new Promise((resolve, reject) => { 
            console.log(userId)
            const Usuario = mongoose.model("Usuario");
            Usuario.findById(userId).then( (usuario) => {
                resolve(usuario)
            })
        })
        return promise
    }

    async function renderHome(request, response ) {
        var usuario;
        try{
            usuario = await getUsuario(request.session.userId);
        }
        catch(err) {
            response.send("error");  
        }
        response.render("index",{
            usuario: usuario.nombreCompleto,
            types,
            ventas
        });
    }

    async function renderContact(request, response) {
        try{
            usuario = await getUsuario(request.session.userId);
        }
        catch(err) {
            response.send("error");  
        }
        response.render("contact",{
            usuario: usuario.nombreCompleto,
        });
    }

    async function renderLogin(request, response) {
        response.render("login",{});
    }

    return {
        renderHome,
        renderContact,
        renderLogin,
    }
}