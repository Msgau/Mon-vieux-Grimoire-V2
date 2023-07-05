const jwt = require('jsonwebtoken');
 
module.exports = (req, res, next) => {
   try {
    // on récupère le header qui contient le token, et on le split dans un tableau qui sépare les chaines de caractères séparées par un espace. 
       const token = req.headers.authorization.split(' ')[1]; // Le token est en 2ème dans le tableau, on met donc 1 pour le récupérer.
       // On décode le token grâce à la méthode verify de jwt, et la clé secrète
       const decodedToken = jwt.verify(token, 'ygpLuJPuckx7yIADnymAempUrPyYKx7cEitJtfqOWy4IjdftGoTXLawh3I20wUfRIL3qQXXpXMNBikVSm8JaYwtXXK7OZZNKdI6l');
       const userId = decodedToken.userId; // On extrait l'ID utilisateur de notre token...
       req.auth = { // ... et on le rajoute à l’objet request afin que nos différentes routes puissent l’exploiter.
           userId: userId
       };
	next();
   } catch(error) {
       res.status(401).json({ error });
   }
};