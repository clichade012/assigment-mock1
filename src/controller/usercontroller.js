const usermodel = require('../model/usermodel')
//const marksmodel = require('../model/marksmodel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
let checkValid = function (value) {
  if (typeof value == "undefined" || typeof value == "number" || value.length == 0 || typeof value == null) {
    return false
  } else if (typeof value == "string") {
    return true
  }
  return true
}

//----------------------------------------User registerisation---------------------------------------------------------------//
const registerUser = async function (req, res) {
  try {
    const data = req.body
    const { name, username, password } = data
    if (!name && username && password) {
      return res.status(400).send({ status: false, msg: "All fields are mandatory." })
    }


    if (!checkValid(name)) return res.status(400).send({ status: false, message: "Please Provide valid Input" })
    if (!(/^[A-Za-z]+$\b/).test(name)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in  name" })


    if (!checkValid(username)) return res.status(400).send({ status: false, message: "Please Provide valid Input for username" })
    if (!(/^[a-zA-Z0-9]+$/).test(username)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in  username" })

    if (!checkValid(password)) return res.status(400).send({ status: false, message: "Please Provide valid Input for password" })
    if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))) return res.status(400).send({ status: false, msg: "Password length should be between 8-15" })

    let securedPass = await bcrypt.hash(password, 10)
    data.password = securedPass


    const createUser = await usermodel.create(data)
    return res.status(201).send({ status: true, data: createUser })
  } catch (error) {

    res.status(500).send({ error: error.message })
  }
}
//----------------------------------------login user---------------------------------------------------------------//
const userlogin = async function (req, res) {
  try {
    const data = req.body
    const { username, password } = data


    if (!username) {
      return res.status(400).send({ status: false, message: "Please provide username to login" })
    }

    if (!(/^[a-zA-Z0-9]+$/).test(username.trim())) {
      return res.status(400).send({ status: false, msg: "invalid username format" });
    }

    if (!password) {
      return res.status(400).send({ status: false, message: "Please provide password to login" })
    }

    if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(password))) return res.status(400).send({ status: false, msg: "Password length should be between 8-15" })

    const findUser = await usermodel.findOne({ username: username })
    let validuser = await bcrypt.compare(password, findUser.password)

    let token = jwt.sign({ userId: findUser._id }, "verysecretkeyofchaitanya")

    let Token = {
      token: token,
      userId: findUser._id.toString()
    }


    return res.status(201).send({ status: true, message: "User logged in Successful", data: Token })
  } catch (error) {

    res.status(500).send({ error: error.message })
  }
}
module.exports = { registerUser, userlogin }
