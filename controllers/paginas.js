module.exports = (mongoose) => {

    var moment = require('moment');

    const reques = require('request');

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
    const Propiedad = mongoose.model("Propiedad");

    function determinePrice(subasta) {
        console.log(subasta)
        if (subasta.pujas.length === 0) {
            return subasta.montoMinimo
        } else {
            return subasta.pujas[0].monto;
        }
    }

    function esSubasta(semana) {
        return semana.tipo === "Subasta"
    }

    function getUsuario(userId) {
        const promise = new Promise((resolve, reject) => {
            console.log(userId)
            const Usuario = mongoose.model("Usuario");
            Usuario.findById(userId).populate().then((usuario) => {
                resolve(usuario)
            })
        })
        return promise
    }

    async function renderHome(request, response) {

        let usuario = await getUsuario(request.session.userId);
        let subasta = null;
        let propiedad = null;
        if (!usuario) {
            let subastas = await getSubastas();
            if (subastas.length >= 1)
                subasta = subastas[Math.floor(Math.random() * subastas.length)]
            let propiedades = await Propiedad.find({})
            if (propiedades.length >= 1)
                propiedad = propiedades[Math.floor(Math.random() * propiedades.length)]

            console.log(subasta);

        }
        response.render("index", {
            usuario,
            types,
            ventas,
            subasta,
            propiedad
        });
    }

    function maxWeeks(desde, hasta, semanas) {
        return (parseInt(hasta) - parseInt(desde)) < semanas;
    }

    async function renderMyProperties (request, response) {
        let usuario = await getUsuario(request.session.userId);
        let reservas = usuario.reservas;
        let promiseReservas = reservas.map( async (reserva) => {
            let newReserva = {}
            if(moment().week() > parseInt(reserva.semana) ){
                newReserva.semana = `${moment().day("Sunday").week(reserva.semana).add(1, 'years').format("DD/MM/YY")} - ${moment().day("Saturday").week(reserva.semana).add(1, "years").format("DD/MM/YY")}`;
                console.log(newReserva,1);
            }
            else{
                newReserva.semana = `${moment().day("Sunday").week(reserva.semana).format("DD/MM/YY")} - ${moment().day("Saturday").week(reserva.semana).format("DD/MM/YY")}`;
                console.log(newReserva,2);                
            }
            newReserva.propiedad = await Propiedad.findById(reserva.propiedad);
            console.log(newReserva);
            return newReserva;
        })
        reservas = await Promise.all(promiseReservas);
        response.render("my-properties", {
            usuario,
            reservas
        });
    }

    async function renderPropertyDetail (request, response) {
        let usuario = await getUsuario(request.session.userId);
        let propiedad = await Propiedad.findById( request.params.id); 
        let semanas = propiedad.semanas.filter( (semana) => {
            return semana.tipo === "Disponible";
        })
        let periodoSemanas = semanas.map( (semana) => {
            if(moment().week() > parseInt(semana.numeroSemana) )
                return {
                    periodo:` ${moment().day("Sunday").week(semana.numeroSemana).add(1, 'years').format("DD/MM/YY")} - ${moment().day("Saturday").week(semana.numeroSemana).add(1, "years").format("DD/MM/YY")}`,
                    numeroSemana:semana.numeroSemana
                }
            else
                return {
                    periodo:` ${moment().day("Sunday").week(semana.numeroSemana).format("DD/MM/YY")} - ${moment().day("Saturday").week(semana.numeroSemana).format("DD/MM/YY")}`,
                    numeroSemana:semana.numeroSemana
                }
        })
        response.render("property-details", {
            propiedad,
            semanas,
            periodoSemanas,
            usuario
        });
    }

    async function renderPropertyFilter(request, response) {
        usuario = await getUsuario(request.session.userId);
        let propiedades = [];


        if (request.body.direccion || (request.body.desde && request.body.hasta) && maxWeeks(request.body.desde, request.body.hasta, 8)) {

            let allPropiedades = await Propiedad.find({});
            propiedades = allPropiedades
            if ((request.body.desde && request.body.hasta)) {
                propiedades = allPropiedades.filter((propiedad) => {
                    let propiedadConDisponible = propiedad.semanas.find((semana) => {
                        return semana.tipo === "Disponible" && semana.numeroSemana >= parseInt(request.body.desde) && semana.numeroSemana <= parseInt(request.body.hasta)
                    })
                    return propiedadConDisponible
                })
            }
            if (request.body.direccion && maxWeeks(request.body.desde, request.body.hasta, 8)) {
                propiedades = propiedades.filter(propiedad => {
                    return propiedad.ciudad.toLowerCase().includes(request.body.direccion.toLowerCase()) ||
                        propiedad.provincia.toLowerCase().includes(request.body.direccion.toLowerCase()) ||
                        propiedad.pais.toLowerCase().includes(request.body.direccion.toLowerCase())
                })
            }
            if (request.body.direccion && request.body.desde && request.body.hasta && !maxWeeks(request.body.desde, request.body.hasta, 8)) {
                propiedades = [];
            }
        }

        response.render("property-list", {
            usuario,
            types,
            ventas,
            propiedades
        });
    }


    async function renderPropertyList(request, response) {
        usuario = await getUsuario(request.session.userId);
        propiedades = await Propiedad.find({})

        response.render("property-list", {
            usuario,
            types,
            ventas,
            propiedades
        });
    }

    async function renderRegister(request, response) {
        response.render("register");
    }

    async function renderContact(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("contact", {
            usuario,
        });
    }

    async function renderProfile(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("profile", { usuario });
    }

    async function renderEditProfile(request, response) {
        try {
            usuario = await getUsuario(request.session.userId);
        } catch (err) {
            response.send("error");
        }
        response.render("edit-profile", { usuario });
    }

    async function editProfile(request, response) {
        console.log(request.body)
        reques.post('http://localhost:8080/usuarios/' + request.params.id, { body: request.body, json: true });
        return response.redirect("/profile");
    }


    async function changeState(request, response) {
        usuario = await getUsuario(request.session.userId);
        usuario.pedido = true;
        usuario.save();
        return response.redirect("/profile");
    }


    async function renderLogin(request, response) {
        response.render("login", {});
    }

    async function getSubastas() {
        let semanasConSubasta = [];
        let propiedades = await Propiedad.find({})
        return propiedades.filter((propiedad) => {
            semana = propiedad.semanas.find((esSubasta))
            if (semana && semana.subasta.habilitada) {
                semanasConSubasta.push(semana);
                return semana
            }
            return false
        })
    }


    async function renderSubastaList(request, response) {
        let semanasConSubasta = []
        semanasConSubasta = getSubastas();
        response.render("subasta-list", {
            propiedadesConSubasta,
            semanasConSubasta,
            title: "Subastas Activas"
        });
    }

    async function renderSubastaDetail(request, response) {
        propiedad = await Propiedad.findOne({ _id: request.params.id });
        semana = propiedad.semanas.find(esSubasta);
        montoActual = determinePrice(semana.subasta);
        response.render("subasta-detail", {
            propiedad,
            semana,
            montoActual
        });
    }

    return {
        renderHome,
        renderContact,
        renderLogin,
        renderPropertyList,
        renderSubastaList,
        renderSubastaDetail,
        renderProfile,
        renderEditProfile,
        editProfile,
        changeState,
        renderPropertyFilter,
        renderRegister,
        renderPropertyDetail,
        renderMyProperties
    }
}