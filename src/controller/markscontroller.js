const usermodel = require('../model/usermodel')
const marksmodel = require('../model/marksmodel')
const { default: mongoose } = require('mongoose')
let checkValid = function (value) {
  if (typeof value == "undefined" || typeof value == "number" || value.length == 0 || typeof value == null) {
    return false
  } else if (typeof value == "string") {
    return true
  }
  return true
}



//-----------------------------------------------student profile--------------------------------------------------------//
const regstudent = async function (req, res) {
  try {
    let data = req.body
    let { studentName, subject, marks, userId } = data
    if (!(studentName && subject && marks && userId)) {
      return res.status(400).send({ status: false, msg: "All fields are mandatory." })

    }
    if (!checkValid(studentName)) return res.status(400).send({ status: false, message: "Please Provide valid Input for studentname" })
    if (!(/^[A-Za-z]+$\b/).test(studentName)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in  StudentName" })



    if (!checkValid(subject)) return res.status(400).send({ status: false, message: "Please Provide valid Input for subject" })
    if (!(/^[A-Za-z]+$\b/).test(subject)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in  Subject" })


    if ((/[0-9]{3}/).test(marks)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in marks" })


    if (!checkValid(userId)) return res.status(400).send({ status: false, message: "Please Provide valid Input for object id" })
    if (!mongoose.Types.ObjectId(userId)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in ObjectId" })

    const regstudent = await marksmodel.create(data)
    return res.status(201).send({ status: true, data: regstudent })
  } catch (error) {

    res.status(500).send({ error: error.message })
  }
}
//----------------------------------------Get student details---------------------------------------------------------------//
const getstu = async function (req, res) {
  try {
    let userID = req.params.userId
    let data = req.query


    if (Object.keys(data).length == 0) {
      const getstu = await marksmodel.find({ userId: userID })
      if (getstu.length == 0) {
        return res.status(404).send({ status: false, message: "No student data found" })
      }
      return res.status(200).send({ status: true, message: "student list", data: getstu })

    }
    let { studentName, subject, marks } = req.query
    let filter = {}
    if (studentName) {
      filter.studentName = studentName
    }
    if (subject) {
      filter.subject = subject
    }

    let getobj = await marksmodel.find({ userId: userID, ...filter }).select({ subject: 1, studentName: 1, marks: 1, userId: 1 })

    return res.status(200).send({ status: true, message: "student list", data: getobj })
  } catch (error) {

    res.status(500).send({ error: error.message })
  }
}
//----------------------------------------update student marks---------------------------------------------------------------//
const updatestu = async function (req, res) {
  try {
    let userId = req.params.userId
    let data = req.body
    let { studentName, subject, marks, _id } = data


    if (!checkValid(_id)) return res.status(400).send({ status: false, message: "Please Provide valid Input for student id" })
    if (!mongoose.Types.ObjectId(_id)) return res.status(400).send({ status: false, msg: "Please Use Correct Characters in studentid" })

    let checkstudent = await marksmodel.findOne({ _id: _id, userId: userId })

    if (!checkstudent) {
      return res.status(404).send({ status: false, message: "student Id doesn't match with userid ." });
    }

    if (!(studentName || subject || marks)) {
            
      return res.status(400).send({ status: false, message: "Mandotory field  not present!" })
  }


    let update = await marksmodel.findOneAndUpdate({ _id: _id }, { $set: { studentName: studentName, subject: subject, marks: checkstudent.marks + marks } }, { new: true })
    if (!update) {
      return res.status(404).send({ status: false, message: "student not found" })
    }
  
    return res.status(200).send({ status: true, message: "update successfully", data: update })

  } catch (error) {

    res.status(500).send({ error: error.message })
  }


}


//----------------------------------------delete records of student---------------------------------------------------------------//
const DeleteByQuery = async function (req, res) {
  try {
    let userId = req.params.userId
    let data = req.query
    let { studentName, subject } = data

    let studentdet = await marksmodel.updateMany({ $and: [{ userId: userId }, { $or: [{ studentName: studentName }, { subject: subject }] }] }, {
      $set: { studentName: "", subject: "", marks: 0 }
    })

    if (studentdet.modifiedCount == 0 || studentdet.matchedCount == 0) { return res.status(404).send({ status: false, msg: "student record is not Present." }) }
    res.status(200).send({ status: true, message: "student record deleted successfully", data: studentdet })
  } catch (error) {

    res.status(500).send({ error: error.message })
  }

}

module.exports = { regstudent, updatestu, getstu, DeleteByQuery }