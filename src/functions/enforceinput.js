export function password(input){
  if (!input) return;
  input.addEventListener('input',()=>{
    input.value = input.value.replace(' ','');
  });
}
export function username(input){
  if (!input) return;
  input.addEventListener('input',()=>{
    input.value = input.value.replace(' ','');
  });
}
export function email(input){
  if (!input) return;
  input.addEventListener('input',()=>{
    input.value = input.value.replace(' ','');
  });
}
