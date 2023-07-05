// Modèle d'enregistrement d'un utilisateur dans la bdd. On utilise mongoose pour crypter les informations
// On écrit "unique: true" pour empêcher un utilisateur de s'inscrire plusieurs fois avec la même adresse mail.
// mongoose-unique-validator améliore les messages d'errreur en cas d'inscription 2x avec la même adresse

const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');
const validator = require('validator');

const userSchema = mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: function (value) {
        return validator.isEmail(value);
      },
      message: 'Veuillez fournir une adresse email valide'
    }
  },
  password: { type: String, required: true }
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);