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
            div.style.height = `${song.prc[member].val * 8 }px`
            div.dataset.val = song.prc[member].val
            div.dataset.msg =song.prc[member].msg
            
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
        // document.querySelector("body").addEventListener("mousemove", divExpandHandler)
    }

    return { init, addEvListeners, show}
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

//  let prevY = 0
//  function divExpandHandler(e){
//   if((e.buttons === 1 || e.type === "click") && e.target.dataset.auth ){
//     songs.forEach(song => {
//       if(song.name === chart.classList[1]){
//         prevY < e.y?
//         song.prc[e.target.dataset.auth.toLowerCase()].val -= Math.round(e.offsetY/80):
//         song.prc[e.target.dataset.auth.toLowerCase()].val += Math.round(e.offsetY/80)
//         chartObj.show(song)
//       }
//     })
//     console.log(e)
//     prevY = e.y
//   }
//  }








