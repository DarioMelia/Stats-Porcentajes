let songs 
fetch("./js/songs.json")
  .then(res => res.json())
  .then(json => songs = json)
  