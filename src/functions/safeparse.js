function safeParse(json){
  try {
    return JSON.parse(json);
  } catch (error) {
    return null;
  }
}
export default safeParse;
