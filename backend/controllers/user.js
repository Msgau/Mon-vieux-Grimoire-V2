
const bcrypt = require('bcrypt');
const User = require('../models/User');
const jwt = require ('jsonwebtoken');

exports.signup = (req, res, next) => {
    // La fonction bcrypt.hash est asynchrone et nous utilisons then pour gérer la promise qui encapsule cette opération asynchrone.
    bcrypt.hash(req.body.password, 10) // On appelle la fonction de hachage de bcrypt dans le mot de passe et on lui demande de "saler" le mot de passe 10 fois (+c gros,+c long).
      .then(hash => { // On récupère le mot de passe crypté, puis on crée un utilisateur et on l'enregistre dans la bdd
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(() => res.status(201).json({ message: 'Utilisateur créé !' }))
          .catch(error => res.status(400).json({ error }));
      })
      .catch(error => res.status(500).json({ error }));
  };


  exports.login = (req, res, next) => {
    User.findOne({ email: req.body.email }) // On utilise la méthode findOne pour comparer l'email envoyé avec celui enregistré.
        .then(user => { // On récupère la valeur trouvée par la requête
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            // Si a bien un user, on vérifie le MDP grâce à la fonction compare de brcypt
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    // Si le mdp est valide
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign( // On appelle la fonction sign de jwt avec trois arguments. Ce token contient l'user ID en tant que payload (les données encodées dans le token).
                            { userId: user._id }, // Le user id. Comme ça on est sûr que la requête correspond à l'user. 
                            'ygpLuJPuckx7yIADnymAempUrPyYKx7cEitJtfqOWy4IjdftGoTXLawh3I20wUfRIL3qQXXpXMNBikVSm8JaYwtXXK7OZZNKdI6l', // La clé secrète pour l'encodage
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
 };