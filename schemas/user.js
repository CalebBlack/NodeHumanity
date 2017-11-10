module.exports = {
  displayname: {type:String,required:true,unique:false},
  username: {type:String,required:true,unique:true,lowercase:true},
  email: {type:String,required:true,unique:true},
  created: { type: Date, default: Date.now },
  hash: {type:String,required:true}
}
