const { Schema, model } = require('mongoose');

const RolSchema = new Schema({
  rol: {
    type: String,
    required: [true, 'El role es obligatorio']
  }
})


module.exports = model('Role', RolSchema)