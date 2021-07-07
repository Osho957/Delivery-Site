const User = require('../../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

 function authController(){
    return{
       login(req,res){
        res.render('auth/login');
       },  

        postLogin(req,res,next){

            const { email, password } = req.body
            //Validate Request
            if(!email || !password){
                req.flash('error','All Fields Are Required!')
             return  res.redirect('/login');
            }

             passport.authenticate('local',(err,user,info)=>{
                 if(err){
                     req.flash('error' ,info.message)
                     return next(err)
                 }

                 if(!user){
                    req.flash('error' ,info.message)
                    return res.redirect('/login')
                 }

                 req.logIn(user,()=>{
                     if(err){
                        req.flash('error' ,info.message)
                        return next(err)
                     }
                     return res.redirect('/');

                 }) 

             })(req,res,next)
        },

       register(req,res){
        res.render('auth/register');
       },
       async postRegister(req,res){
           const { name, email, password } = req.body
           //Validate Request
           if(!name || !email || !password){
               req.flash('error','All Fields Are Required!')
               req.flash('name' ,name)
               req.flash('email' ,email);
            return  res.redirect('/register');
           }

           //Check if email Exists
 
           User.exists({ email: email }, (err,result)=>{
                 if(result){
                    req.flash('error','Email Already Exists!')
                    req.flash('name' ,name)
                    req.flash('email' ,email)
                    return  res.redirect('/register');
                 }
           })
           //Hash Password   
         const hashedPassword = await bcrypt.hash(password, 10)
           //Create A User
             
           const user = new User({
               name,
               email,
               password: hashedPassword
           })
           
           user.save().then((user)=>{
               // registration done
               // Login
               return res.redirect('/')
           }).catch(err =>{
            req.flash('error','Something Went Wrong!') 
           return  res.redirect('/register'); 
           })
       },
       logout(req,res){
           req.logout()
           return res.redirect('/login')
       } 
    }
}



module.exports =authController;