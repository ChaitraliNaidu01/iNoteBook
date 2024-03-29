const express = require('express');
const User = require('../models/User');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var fetchuser = require('../middleware/fetchuser');

const JWT_SECRET = 'Harryisagoodb$oy';

// ROUTE 1: Create a User using: POST "/api/auth/createuser". No login required
router.post('/createuser', [
  body('name', 'Enter a valid name').isLength({ min: 3 }),
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password must be atleast 5 characters').isLength({ min: 5 }),
], async (req, res) => {
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    // Check whether the user with this email exists already
    let user = await User.findOne({ email: req.body.email });
    if (user) {
      return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
    const salt = await bcrypt.genSalt(10);
    const secPass = await bcrypt.hash(req.body.password, salt);

    // Create a new user
    user = await User.create({
      name: req.body.name,
      password: secPass,
      email: req.body.email,
    });
    const data = {
      user: {
        id: user.id
      }
    }
    const authtoken = jwt.sign(data, JWT_SECRET);


    // res.json(user)
    res.json({ authtoken })

  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})


// ROUTE 2: Authenticate a User using: POST "/api/auth/login". No login required
router.post('/login', [
  body('email', 'Enter a valid email').isEmail(),
  body('password', 'Password cannot be blank').exists(),
], async (req, res) => {
  let success = false;
  // If there are errors, return Bad request and the errors
  const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}

const { email, password } = req.body;
try {
  let user = await User.findOne({ email });
  // Check if the user exists
  if (!user) {
    success = false
    return res.status(400).json({ error: "Please try to login with correct credentials" });
  }

  // Compare passwords using bcrypt
  const passwordCompare = await bcrypt.compare(password, user.password);
  if (!passwordCompare) {
    success = false
    return res.status(400).json({ success, error: "Please try to login with correct credentials" });
  }

  // Create JWT token for successful login
  const data = {
    user: {
      id: user.id
    }
  }
  const authtoken = jwt.sign(data, JWT_SECRET);
  success = true;
  res.json({ success, authtoken })

} catch (error) {
  console.error(error.message);
  res.status(500).send("Internal Server Error");
}


});


// ROUTE 3: Get loggedin User Details using: POST "/api/auth/getuser". Login required
router.post('/getuser', fetchuser,  async (req, res) => {

  try {
    userId = req.user.id;
    const user = await User.findById(userId).select("-password")
    res.send(user)
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Internal Server Error");
  }
})
module.exports = router






























// const express = require('express');
// const User=require('../models/User')
// const router=express.Router();
// const { body, validationResult } = require('express-validator');
// const bcrypt = require('bcryptjs');
// const JWT_SECRET="chaitralisgo$d"
// const jwt = require('jsonwebtoken');

// //create a user using post "api/auth/createuser" .No login required
// router.post('/createuser',[
//      body('name',"enter a valid Name").isLength({ min: 3 }),
//      body('email',"Enter a valid Email").isEmail(),
//      body('password',"enter a valid Password").isLength({ min: 5 }),

// ],async (req, res) => {
//   //if there are errors return bad request and error
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }
//   //Check whether the user with this email exists already
//   try{
//     let user=await User.findOne({email:req.body.email});
//     if(user){
//       return res.status(400).json({error:"sorry the user with this email already exist"})
//     }

//     const salt=await bcrypt.genSalt(10);
//     const secPass=await bcrypt.hash(req.body.password,salt);
    
//     user=await User.create({
//       name: req.body.name,
//       email: req.body.email,
//       password: secPass
//     })
//     const data={
//       user:{
//         id:user.id
//       }
//     }

//     const authtoken=jwt.sign(data,JWT_SECRET);
    
//     res.json(authtoken)
    
//     // .then(user => res.json(user))
//     // .catch(err=>{console.log(err)
//     // res.json({error:"please enter the unique value for email"})})
//   }catch(error){
//     console.error(error.message);
//     res.status(500).send("some error occured")
//   }  
// })

// //Authenticate a User using: POST "api/auth/login" 



// router.post('/login', [
//   body('email', 'Enter a valid email').isEmail(),
//   body('password', 'Password cannot be blank').exists(),
// ], async (req, res) => {
//   let success = false;
//   // If there are errors, return Bad request and the errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     return res.status(400).json({ errors: errors.array() });
//   }

//   const { email, password } = req.body;
//   try {
//     let user = await User.findOne({ email });
//     if (!user) {
//       success = false
//       return res.status(400).json({ error: "Please try to login with correct credentials" });
//     }

//     const passwordCompare = await bcrypt.compare(password, user.password);
//     if (!passwordCompare) {
//       success = false
//       return res.status(400).json({ success, error: "Please try to login with correct credentials" });
//     }

//     const data = {
//       user: {
//         id: user.id
//       }
//     }
//     const authtoken = jwt.sign(data, JWT_SECRET);
//     success = true;
//     res.json({ success, authtoken })

//   } catch (error) {
//     console.error(error.message);
//     res.status(500).send("Internal Server Error");
//   }


// });



// module.exports = router;




// router.post('/login', [
//   body('email', 'Enter valid email').isEmail(),
//   body('password', 'Password cannot be blank').exists(),
// ], async (req, res) => {
//   let success = false;
//   // if there are errors return 400 and errors
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//   }
  

//   const { email, password } = req.body;

//   try {
//       // check for valid mail
//       let user = await User.findOne({ email })
//       if (!user) {
//           success = false;
//           return res.status(400).json({ success, error: "Please enter valid email!" })
//       }

//       // compare password 
//       const passwordCompare = await bycript.compare(password, user.password);
//       if (!passwordCompare) {
//           success = false;
//           return res.status(400).json({ success, error: "Incorrect password!" })
          
//       }

//       const data = {
//           user: {
//               id: user.id
//           }
//       }

//       const authtoken = jwt.sign(data, JWT_SECRET)
//       success = true;
//       return res.json({ success: true, authtoken });

//   }catch (error) {
//     console.error(error.message);
//     return res.status(500).json({ success: false, error: "Internal Server Error" });
// }
// })

