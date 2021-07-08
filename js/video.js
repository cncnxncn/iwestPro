let player;
let defaultSrc = './video/';

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
    getCurrentIndexStr: () => {
      return `${currentIndex > 9 ? '':'0'}${currentIndex}`;
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
        src: `${defaultSrc}${_sourceNm}.mp4`,
        type: "video/mp4"
      },
    ],
    controls: true,
    muted: true,
    autoplay: true,
    controlBar: {
      playToggle: false,
      pictureInPictureToggle: false,
    },
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

  let defaultStyle = 'width: 25px; margin-top: 2px; cursor: pointer;';


  playBackBtnImg.setAttribute('src','../../static/image/video-dbback-btn.png');
  playBackBtnImg.style = defaultStyle;
  playBackBtn.addEventListener('click', function() {
    var jumpTime = 15;
    var newTime,
        curTime = player.currentTime();
    if(curTime >= jumpTime) {
        newTime = curTime - jumpTime;
    } else {
        newTime = 0;
    }
    player.currentTime(newTime);
  })

  playBackBtn.append(playBackBtnImg);
  controlBar.insertBefore(playBackBtn, insertBeforeNode);

  backVideoBtnImg.setAttribute('src','../../static/image/video-before-btn.png');
  backVideoBtn.addEventListener('click', onClickBeforeVideoBtn);
  backVideoBtn.id = 'back-video';
  backVideoBtn.style = hasBeforeVideo() ?'':'display:none'
  backVideoBtn.append(backVideoBtnImg);
  controlBar.insertBefore(backVideoBtn, insertBeforeNode);
  backVideoBtnImg.style = defaultStyle;

  nextVideoBtnImg.setAttribute('src','../../static/image/video-next-btn.png');
  nextVideoBtn.addEventListener('click', onClickNextVideoBtn);
  nextVideoBtn.id = 'next-video';
  nextVideoBtn.style = hasNextVideo()?'':'display:none'
  nextVideoBtn.append(nextVideoBtnImg);
  controlBar.insertBefore(nextVideoBtn, insertBeforeNode);
  nextVideoBtnImg.style = defaultStyle;
}

function hasNextVideo() {
  return video.getCurrentIndex() < video.getLastIndex();
}

function hasBeforeVideo() {
  return video.getCurrentIndex() > 1;
}

function getVideoSource() {
  return `${defaultSrc}${video.getClassName()}_${video.getCurrentIndexStr()}.mp4`;
}

function updateNavButton() {
  document.getElementById('back-video').style.display = hasBeforeVideo() ? 'block':'none';
  document.getElementById('next-video').style.display = hasNextVideo() ? 'block':'none';
}

// video ControlBar Event
function onClickNextVideoBtn() {
  video.setCurrentIndex(video.getCurrentIndex() + 1);
  player.src(getVideoSource());
  updateNavButton()
}

function onClickBeforeVideoBtn() {
  video.setCurrentIndex(video.getCurrentIndex() - 1);
  player.src(getVideoSource());
  updateNavButton()
}