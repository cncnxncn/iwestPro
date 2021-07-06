let player;

var video = (function() {
  var classNm = '';
  var lastIndex = -1;
  var currentIndex = -1;
  return {
    setLastIndex: (_index) => {
      lastIndex = _index;
    },
    getLastIndex: () => {
      return lastIndex;
    },
    getCurrentIndex: () => {
      return currentIndex;
    },
    setCurrentIndex: (_index) => {
      currentIndex = _index;
    },
    setClassName: (_classNm) => {
      classNm = _classNm;
    },
    getClassName: () =>{
      return classNm;
    }
  }
})(); 

/**
 * 
 * @param {string} _sourceNm 01_01
 * @param {number} lastIndex
 */
function loadVideo(_sourceNm, lastIndex) {
  let [classNm, videoIndex] = _sourceNm.split('_');

  video.setCurrentIndex(Number(videoIndex));
  video.setLastIndex(lastIndex);
  video.setClassName(classNm);

  // Source Index
  // var regExp = new RegExp(/(\d{2})_(\d{2})(\.mp4)$/,'gi');
  // let sourceName = _this.currentSource().src.replace(regExp, '|$1_$2').split('|')[1];


  videojs('player', {
    sources: [
      {
        src: `./video/${_sourceNm}.mp4`,
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

    addNavButton();
  });
};

function addNavButton() {
  var nextVideoBtn = document.createElement('div'),
    nextVideoBtnImg = document.createElement('img'),
    backVideoBtn = document.createElement('div'),
    backVideoBtnImg = document.createElement('img'),
    playBackBtn = document.createElement('div'),
    playBackBtnImg = document.createElement('img');
  
  let controlBar = document.getElementsByClassName('vjs-control-bar')[0];
  let insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];

  let defaultStyle = 'width: 25px; margin-top: 2px';

  playBackBtnImg.setAttribute('src','../static/image/video-dbback-btn.png');
  playBackBtnImg.style = defaultStyle
  playBackBtn.append(playBackBtnImg);
  controlBar.insertBefore(playBackBtn, insertBeforeNode);


  if(hasBeforeVideo()) {
    backVideoBtnImg.setAttribute('src','../static/image/video-before-btn.png');
    backVideoBtnImg.style = defaultStyle;
    backVideoBtn.append(nextVideoBtnImg);
    controlBar.insertBefore(backVideoBtn, insertBeforeNode);
  }

  if(hasNextVideo()) {
    nextVideoBtnImg.setAttribute('src','../static/image/video-next-btn.png');
    nextVideoBtnImg.style = defaultStyle
    nextVideoBtn.append(nextVideoBtnImg);
    controlBar.insertBefore(nextVideoBtn, insertBeforeNode);
  }
}

function hasNextVideo() {
  return video.getCurrentIndex() < video.getLastIndex();
}

function hasBeforeVideo() {
  return video.getCurrentIndex() > 1;
}