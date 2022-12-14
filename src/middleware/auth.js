const usermodel = require('../model/usermodel')
const marksmodel = require('../model/marksmodel')
const jwt = require("jsonwebtoken");




//----------------------------------------Authrnication---------------------------------------------------------------//
const authentication = function(req,res,next){
   try { let token = req.headers['x-api-key']

     if (!token) {
        res.status(401).send({ status: false, message: "Token not found" });
      }

      jwt.verify(token,"verysecretkeyofchaitanya",function(error,decodedToken){
        if (error) {
            return res.status(401).send({ status: false, message: "Token is not valid" })
          } else {
            req.token = decodedToken
       next()
      }})
    }catch (error) {

      res.status(500).send({ error: error.message })
    }
}

//----------------------------------------Authorisation---------------------------------------------------------------//

const authorisation = async function(req,res,next){
 try  { let token = req.headers["x-api-key"]
    let decodeToken = jwt.verify(token, "verysecretkeyofchaitanya")
    let userLoggedIn = decodeToken.userId

    let studentId = req.params.userId
     
    let fistu = await marksmodel.findOne({userId:studentId})
    if (!fistu)
      return res.status(404).send({ status: false, message: "No Such userId Available." })

   if(fistu.userId.toString() !== userLoggedIn)
   return res.status(403).send({ status: false, message: "Unauthorized access denied!" })
    next()
  }catch (error) {

    res.status(500).send({ error: error.message })
  }

}


module.exports = { authentication, authorisation}