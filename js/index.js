/**
  * Inspired by https://dribbble.com/shots/2947089--018-Analytics-Chart-Daily-UI-challenge
  *
  */
const chart = document.getElementsByClassName('chart')[0]
const divs = chart.querySelectorAll('div')
const buttons = document.querySelectorAll('nav button')
const inputs = document.querySelectorAll("input.prc-input")
const operatorBtns = document.querySelectorAll(".btn--change-val")

const chartObj = (function () {

  function init(song) {
    show(song)
  }

  function show(song) {
    resetDivs()
    chart.classList = ["chart"]
    chart.classList.add(song.name)
    divs.forEach(div => {
      for (const member in song.prc) {
        if (div.dataset.auth.toLowerCase() === member) {
          div.classList.contains("none") ? div.classList.remove("none") : null
          div.classList.add("show")
          div.style.height = `${song.prc[member].val * 8}px`
          div.dataset.val = song.prc[member].val
          div.dataset.msg = song.prc[member].msg
          div.querySelector("input").value = `${song.prc[member].val}%`
        }
      }
    })
  }

  function addEvListeners(songs) {
    buttons.forEach((btn, i) => {
      btn.addEventListener("click", e => {
        resetButtons()
        show(songs[i])
        btn.classList.add("active")
      })
      inputs.forEach(input => {
        input.addEventListener("keydown", inputChangeHandler)
        input.addEventListener("onfocusout", inputChangeHandler)
      })
      operatorBtns.forEach(btn => {
        btn.addEventListener("click",changeValHandler)
      })
    })
    // document.querySelector("body").addEventListener("mousemove", divExpandHandler)
  }

  return { init, addEvListeners, show }
})()


window.onload = () => {
  const [dbf] = songs
  chartObj.addEvListeners(songs)
  chartObj.init(dbf)
}




function resetDivs() {
  divs.forEach(div => {
    div.classList.contains("show") ? div.classList.remove("show") : div.classList.remove("none")
    div.classList.add("none")
  })

}

function resetButtons() {
  buttons.forEach(btn => {
    if (btn.classList.contains("active")) { btn.classList.remove("active") }
  })
}


function inputChangeHandler(e) {
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement
  const key = e.code
  if (key.includes("Digit") || key.includes("Numpad")) {
    song.prc[div.dataset.auth.toLowerCase()].val = parseInt(e.target.value)
  } else if (key === "Enter") {
    if (e.target.value.includes("%")) {
      e.target.value.replace("%", "")
    }
    let prevSong = {...song}
    prevSong.prc[div.dataset.auth.toLowerCase()].val = parseInt(e.target.value)
    if (lessThan100(prevSong)) {
      song.prc[div.dataset.auth.toLowerCase()].val = parseInt(e.target.value)
      chartObj.show(song)
    }
  } else if (key.includes("Arrow") || key === "Backspace") {
    console.log("Do nothing")
  } else {
    e.target.value = ""
  }
}

function changeValHandler(e){
  const song = getSong(chart.classList[1])
  const div = e.target.parentElement.parentElement
  let prevSong = JSON.parse(JSON.stringify(song))
  if(this.innerHTML === "+"){
    prevSong.prc[div.dataset.auth.toLowerCase()].val+=1
    console.log(song.prc[div.dataset.auth.toLowerCase()])
    lessThan100(prevSong)?
      song.prc[div.dataset.auth.toLowerCase()].val+=1:
      null
  }else{
    lessThan100(song)
    song.prc[div.dataset.auth.toLowerCase()].val-=1
  }
  chartObj.show(song)
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

function getSong(name) {
  let selectedSong
  songs.forEach(song => {
    if (song.name === name) {
      selectedSong = song
    }
  })
  return selectedSong
}

function lessThan100(song) {
  const members = Object.values(song.prc)
  const totalPrc = members.reduce((acc, el) => acc + el.val, 0)
  const prcDisplay = document.querySelector(".percentaje")
  prcDisplay.innerHTML = `${totalPrc-1}%`
  if (totalPrc <= 100) {
    return true
  } else {
    return false
  }
}








