const User = require('../models/User')
const bcrypt = require('bcrypt')

module.exports.registerForm = (req,res)=>{
    res.render('user/register')
}


module.exports.register = async (req,res)=>{
 try{
    const {username,email, password} = req.body;
    const hash =  await bcrypt.hash(password,2)
    const user = new User({
      username,
      email,
      password: hash
 })
    await user.save()
    res.redirect('/login')
 }catch(e){
   req.flash('error','Username or Email already exsit!')
   res.redirect('/register')
 }
}


module.exports.loginForm = (req,res)=>{
    res.render('user/login')
}


module.exports.login = async (req,res)=>{
    const {username, password} = req.body;
    const user = await User.findOne({username})
    if(!user){
     req.flash('error','Invalid Username or seems you not reigster')
      return res.redirect('/login')
    }
    const validPassword = await bcrypt.compare(password,user.password)
    if(validPassword){
      req.session.user_id = user
      req.flash('success','Welcome!!')

      res.redirect('/station')
     
    }
    else{
      req.flash('error','Invalid Password or Username')
      res.redirect('/login')
    }
  }


  module.exports.logout = (req,res)=>{
    req.session.user_id= null;
    res.redirect('/login')
  }