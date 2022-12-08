const path = require('path'); // Path package used for manipulating pathsconst express = require('express'); // Require expressconst hbs = require('hbs');const { geocode } = require('./utils/geocode');const { forecast } = require('./utils/forecast');const app = express(); // Create app on which we create serverconst port = process.env.PORT || 3000;const publicDirectoryPath = path.join(__dirname, '../public'); // Creating the public dir pathconst viewsPath = path.join(__dirname, '../templates/views'); // Creating the templates dir pathconst partialsPath = path.join(__dirname, '../templates/partials'); // Creating the partials dir path// Setup handlebars engineapp.set('view engine', 'hbs'); // Setting up the templating engine. First is key and yes with a space, second is the package nameapp.set('views', viewsPath); // Pass the custom folder instead of default viewshbs.registerPartials(partialsPath); // Tells handlebars where to look for our partials// Static directory settingsapp.use(express.static(publicDirectoryPath)); // Serving up the static content/*  Example routing with express* app.com => / home page when we have index.html express.static auto-loads that file for / route.* app.com/help => help page /help.html -> extension must be included for this* app.com/about => about page /about.html-> extension must be included for this* */app.get('/', (req, res) => {  // Render the view with the data  res.render('index', { title: 'Weather', name: 'Djordje Arsenovic' });});app.get('/about', (req, res) => {  // Render the view with the data  res.render('about', { title: 'About me', name: 'Djordje Arsenovic' });});app.get('/help', (req, res) => {  res.render('help',    { title: 'Help', name: 'Djordje Arsenovic', helpText: 'This is a help message!' });});app.get('/weather', (req, res) => {  if (!req.query.address) {    return res.send({      error: 'Please provide the address!',    });  }  geocode(req.query.address, (error, { latitude, longitude, label } = {}) => {    if (error) {      return res.send({ error });    }    forecast(latitude, longitude, (error, forecastData) => {      if (error) {        return res.send({ error });      }      return res.send({        forecast: forecastData,        location: label,        address: req.query.address,      });    });  });});app.get('/help/*', (req, res) => {  res.render('404', {    title: 'The article you are looking for can\'t be found.',    name: 'Djordje Arsenovic',    message: 'Help artice not found!',  });});app.get('*', (req, res) => {  // res.send('MY 404 page')  res.render('404',    { title: '404', name: 'Djordje Arsenovic', message: 'Page not found.' });});// Serverapp.listen(port, () => {  console.log(`Server is running on port ${ port }!`);});