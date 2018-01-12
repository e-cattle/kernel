router.use(function (req, res, next){
    console.log('Logging');
    next();
});