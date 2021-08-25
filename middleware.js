module.exports.isLoggedin = (req,res,next)=>{
    if(!req.isAuthenticated()){
        req.session.returnTo = req.originalUrl;
        req.flash('error','You must be Signed in!');
        return res.redirect('/login');
      }
      next();
}

