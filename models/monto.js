const mongoose = require("mongoose");

const MontoSchema = new mongoose.Schema({
    montoPremium: { type: Number, required: true },
    montoStandard: { type: Number, required: true },
});

const Monto = mongoose.model("Monto", MontoSchema);

module.exports = Monto;