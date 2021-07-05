let player;

function loadVideo(l) {
  videojs('player', {
    sources: [
      {
        src: "./video/01_04_4.mp4",
        type: "video/mp4"
      },
    ],
    controls: true,
    muted: true,
    controlBar: {
      playToggle: false,
      pictureInPictureToggle: false,
    }
  })

  videojs.getPlayer("player").ready(function() {
    player = this;
    CenterPlayBT();
  });
};

function CenterPlayBT() {
  var playBT = document.querySelector(".vjs-big-play-button");
  playBT.style = `
    left:${(playBT.parentElement.offsetWidth - (playBT.parentElement.offsetWidth/2))}px;
    top:${(playBT.parentElement.offsetHeight -playBT.offsetHeight)/2}px`
}