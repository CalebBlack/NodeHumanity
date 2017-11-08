module.exports = {
  displayname: {type:String,required:true,unique:false},
  username: {type:String,required:true,unique:true,lowercase:true},
  email: {type:String,required:true,unique:true},
  hash: {type:String,required:true}
}
