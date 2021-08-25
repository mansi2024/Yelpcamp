const User = require('../model/user');

module.exports.userRender = (req,res)=>{
    res.render('users/register');
}
module.exports.registerUser = async(req,res)=>{
    try{
    const{username,email,password} = req.body;
    const user = new User({username,email});
    const registeredUser = await User.register(user,password);
    req.login(registeredUser,err=>{
        if(err) return next(err);
        req.flash('success','Welcome to Yelpcamp');
        res.redirect('/campgrounds');
    })
    req.flash('success','Welcome to Yelpcamp');
    res.redirect('/campgrounds');
    }catch(e){
        req.flash('error',e.message);
        res.redirect('/register');
    }
}
module.exports.loginForm = (req,res)=>{
    res.render('users/login');
}
module.exports.Registered = async(req,res)=>{
    req.flash('success','Welcome Back!');
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete  req.session.returnTo;
   res.redirect( redirectUrl);
}
module.exports.logout = (req,res)=>{
    req.logout();
    req.flash('success','Goodbye-Successfully logged out!');
    res.redirect('/campgrounds');
}