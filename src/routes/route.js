const express = require('express');
const router=express.Router()


let {registerUser,userlogin} = require('../controller/usercontroller')
let {regstudent,updatestu,getstu,DeleteByQuery} = require('../controller/markscontroller')
const {authentication , authorisation} = require('../middleware/auth')

router.post('/register/user',registerUser)
router.post('/register/login',userlogin)

router.post('/register/:userId/student',authentication,authorisation,regstudent)
router.get('/students/:userId',authentication,authorisation,getstu)
router.put('/update/:userId/student',authentication,authorisation,updatestu)
router.delete('/delete/:userId/student',authentication,authorisation,DeleteByQuery)


router.all("/**", function (req, res) {
    res.status(400).send({
      status: false,
      msg: "The api you are requesting is not available",
    });
  });

module.exports = router;