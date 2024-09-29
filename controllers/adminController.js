const User = require("../models/companyModel")
const bcrypt = require("bcrypt")


const securePassword = async (password) => {
    try {
        const passwordHash = await bcrypt.hash(password, 10);
        return passwordHash;
    } catch (error) {
        console.log(error.message);
    }
}

const loginLoad = async (req, res) => {
    try {
        if(req.session.admin_id){
            res.redirect("/admin/dashBoard")           
        }else{
             res.render("admin")
        } 
    } catch (error) {
        console.log(error.message);
    }
}

const verifyLogin = async (req, res) => {
    try {
        const email = req.body.email
        const password = req.body.password

        const adminData = await User.findOne({ email: email, isAdmin: true })
        if (adminData ) {
            const passwordMatch = await bcrypt.compare(password, adminData.password);
            if (passwordMatch) {
                req.session.admin_id = adminData._id;
                res.redirect("admin/dashBoard")
            } else {
                res.render("admin",{admessage:"incorrect email or password"})
            }
        } else {
            res.render("admin",{admessage:"incorrect email or password"})
        }
    } catch (error) {
        console.log(error);
    }
}

const loadDashBoard = async (req, res) => {
    try {
        if(req.session.admin_id){
            var search ;
        if(req.query.search){
            search = req.query.search
        
            const UsersData = await User.find({isAdmin:{$exists:false},$or:[{name:{$regex:'.*'+search+'.*'}}]}).sort({name:1})
             res.render("adminDashboard", { users: UsersData })
          }else{
           const data = await User.find({isAdmin:{$exists:false}}).sort({name:1})
           res.render("adminDashboard", { users: data })
          }
        }else{
            res.redirect("/")
        }
    } catch (error) {
        console.log(error);
    }
}


//add new user

const newUserLoad = async (req, res) => {
     try {
          res.render('new-user')
     } catch (error) {
          console.log(error.message)
     }
} 

 
const addUser = async (req, res) => {


    const bemail =req.body.email
    const find = await User.find({email:bemail})
    if(find.length==0){
    try {
        
        if(req.session.admin_id){
        const spassword = await securePassword(req.body.password);
        const user = new User({
            name: req.body.name,
            phone: req.body.phone,
            email: req.body.email,
            password: spassword
        })
        const data = await user.save()
        console.log(data);
        const dbData = await User.find({isAdmin:{$exists:false}})
        res.render("adminDashboard",{users:dbData})
    }
    }
    catch (error) {
        console.error("hello this is error" + error);
        res.send(error.message)
    }
}else{
    res.render("new-user",{exist:"User Already Exists"})
}
};


const editUserLoad = async (req, res) => {
    try {
        const id = req.query.id;
        console.log(id);
        const userData = await User.findById({ _id: id })
        console.log(userData);
        if (userData) {
            res.render("edit-user", { users: userData })
        } else {
            res.redirect("admin/dashBoard")
        }
    }
    catch (error) {
        console.log(error.message);
    }

}

const updateUser = async (req, res) => {
    const mail = req.body.email
    const id = req.body.id;
        const mailfind = await User.find({email:mail,_id:{$ne:id}})
        if(mailfind.length ==0){
             try {
                if(req.session.admin_id){      
                    const userData = await User.findByIdAndUpdate({ _id: req.body.id }, { $set: { name: req.body.name, email: req.body.email, phone: req.body.phone } })
                    res.redirect("/admin/dashBoard")
                }
    } catch (error) {
        console.log(error.message);
    }
        }else{
            const data= await User.find({email:mail,_id:{$ne:id}})
            res.render("edit-user",{users:data,msg:"User Already exists"})
        }   
}

const deleteUser = async (req, res) => {
    try {        
        if(req.session.admin_id){
            const id = req.query.id
           
        await User.deleteOne({ _id: id })
            
        res.redirect("/admin/dashboard")
        }
        
    } catch (error) {
        console.log(error.message);
    }
}

const adminLogout = async (req, res) => {
    try {  
    req.session.destroy((err) => {
      if (err) {
        console.log("logout failed");
      } else {
       res.redirect("/admin")
      }
    });

    } catch (error) {
        console.log(error);
    }
}


module.exports = { loginLoad, verifyLogin, loadDashBoard, newUserLoad, addUser, editUserLoad, updateUser, deleteUser,adminLogout }