/**
  * Inspired by https://dribbble.com/shots/2947089--018-Analytics-Chart-Daily-UI-challenge
  *
  */
 const chart = document.getElementsByClassName('chart')[0]
 const divs = chart.querySelectorAll('div')
 const buttons = document.querySelectorAll('button')

 const chartObj = (function() {
    
    function init(song) {
      show(song)
    }
  
    function show(song) {
      resetDivs()
      chart.classList = ["chart"]
      chart.classList.add(song.name)
      divs.forEach(div => { 
        for(const member in song.prc){
          if (div.dataset.auth.toLowerCase() === member){
            div.classList.contains("none")?div.classList.remove("none"):null
            div.classList.add("show")
            div.style.height = `${song.prc[member].val * 9 }px`
            
          }
        }
      })
    }

    function addEvListeners(songs){
      buttons.forEach((btn,i) =>{
        btn.addEventListener("click",e=>{
          resetButtons()
          show(songs[i])
          btn.classList.add("active")
          
        })
      })
    }

    return { init, addEvListeners}
  })()
  

 window.onload = () => {
  const [dbf] = songs
  chartObj.addEvListeners(songs)
  chartObj.init(dbf)
 }




 function resetDivs(){
  divs.forEach(div =>{
    div.classList.contains("show")?div.classList.remove("show"):div.classList.remove("none")
    div.classList.add("none")
  })

 }

 function resetButtons(){
  buttons.forEach(btn => {
    if(btn.classList.contains("active")){btn.classList.remove("active")}
  })
 }








