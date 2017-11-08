module.exports = {
  owner: {type:String,unique:true,required:true},
  created: {type:Date,default: Date.now,required:true},
  expires: {type:Date,default: +new Date() + 30*24*60*60*1000,required:true}
}
