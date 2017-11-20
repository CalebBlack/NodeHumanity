const crypto = require('crypto')
module.exports = {
  owner: {type:String,unique:true,required:true},
  created: {type:Date,default: Date.now,required:true},
  createdAt: { type: Date, expires: 30*24*60*60, default: Date.now },
  _id: {type:String,required:true,default:()=>{return crypto.randomBytes(48).toString('base64')}}
}
