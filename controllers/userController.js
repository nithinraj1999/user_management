const User = require('../models/companyModel')
const bcrypt = require('bcrypt')

const securePassword = async (password) => {
     try {
          const passwordHash = await bcrypt.hash(password, 10)
          return passwordHash
     } catch (error) {
          console.log(error)
     }
}

const loadRegister = async (req, res) => {
     try {
          res.render('signup')
     } catch (error) {
          console.log(error)
     }
}

const insertUser = async (req, res) => {
     //if condition required for existing user
     const bemail = req.body.email

     const find = await User.find({ email: bemail })
     if (find.length == 0) {
          try {
               const spassword = await securePassword(req.body.password)
               const user = new User({
                    name: req.body.name,
                    phone: req.body.phone,
                    email: req.body.email,
                    password: spassword,
               })
               const data = await user.save()
               res.render('login', { success: 'sign up was successfull' })
          } catch (error) {
              console.log(error);
          }
     } else {
          res.render('signup', { found: 'user already exist' })
     }
}

const loginLoad = async (req, res) => {
     try {
          if (req.session.user_id) {
               res.redirect('/home')
          } else {
               res.render('login')
          }
     } catch (error) {
          console.log(error.message)
     }
}

const verifyLogin = async (req, res) => {
     try {
          const email = req.body.email
          const password = req.body.password
          const userData = await User.findOne({
               email: email,
               isAdmin: { $exists: false },
          })
          if (userData) {
               const passwordMatch = await bcrypt.compare(
                    password,
                    userData.password
               )
               if (passwordMatch) {
                    req.session.user_id = userData._id
                    res.redirect('/home')
               } else {
                    res.render('login', { message: 'wrong email or password' })
               }
          } else {
               res.render('login', { message: 'wrong email or password' })
          }
     } catch (error) {
          console.log(error)
     }
}
let products = [
     {
          name: 'iphone',
          category: 'smart phone',
          img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1694674445/Croma%20Assets/Communication/Mobiles/Images/300822_0_on2t4l.png?tr=w-640',
     },
     {
          name: 'iphone',
          category: 'smart phone',
          img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1694673979/Croma%20Assets/Communication/Mobiles/Images/300815_0_jesioe.png?tr=w-640',
     },
     {
          name: 'iphone',
          category: 'smart phone',
          img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1694673979/Croma%20Assets/Communication/Mobiles/Images/300815_0_jesioe.png?tr=w-640',
     },
     {
          name: 'iphone',
          category: 'smart phone',
          img: 'https://media-ik.croma.com/prod/https://media.croma.com/image/upload/v1694673979/Croma%20Assets/Communication/Mobiles/Images/300815_0_jesioe.png?tr=w-640',
     },
]

const loadHome = async (req, res) => {
     try {
          if (req.session.user_id) {
               console.log('sessionid is ' + typeof req.session.user_id)
               const id = req.session.user_id
               const findname = await User.findOne({ _id: id })

               if (findname) {
                    const name = findname.name
                    console.log(name)
                    res.render('home', { products: products, name: name })
               } else {
                    res.render('login')
               }
          } else {
               res.redirect('/')
          }
     } catch (error) {
          console.log(error)
     }
}

const userLogout = async (req, res) => {
     try {
          console.log(req.session.user_id)
          req.session.destroy((err) => {
               if (err) {
                    console.log('logout failed')
               } else {
                    res.redirect('/')
               }
          })
     } catch (error) {
          console.log(error)
     }
}

module.exports = {
     loadRegister,
     insertUser,
     loginLoad,
     verifyLogin,
     loadHome,
     userLogout,
}
