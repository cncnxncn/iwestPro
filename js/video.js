let player;
const defaultSrc = './video/';

var video = (function() {
  var classNm = '';
  var lastIndex = -1;
  var currentIndex = -1;
  
  var $controlBar, $insertBeforeNode;

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
    getClassName: () => {
      return classNm;
    },
    getControlBar: () => {
      if(typeof $controlBar == 'undefined') 
        $controlBar = document.getElementsByClassName('vjs-control-bar')[0];
      return $controlBar;
    },
    getInsertBeforeNode: () => {
      if(typeof $insertBeforeNode == 'undefined')
        $insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];
      return $insertBeforeNode;
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
    playbackRates: [1, 1.25, 1.5],
  })

  videojs.getPlayer("player").ready(function() {
    player = this;

    this.on("ended", () => {
      const $el = document.getElementById('playToggle-video').getElementsByTagName('img')[0];
      $el.setAttribute('src', '../../static/image/video-playToggle-btn.png');
    });

    addNavButton();
  });
};

function addNavButton() {

  // before부터 넣어야 next가 오른쪽
  // createVideoBtn('before');
  // createVideoBtn('next');

  createVideoBtn('playToggle');
  createVideoBtn('dbback');

  let $el = document.getElementsByClassName('vjs-volume-panel')[0];
  video.getControlBar().insertBefore($el, video.getInsertBeforeNode());
}

const displayNone = 'display:none;';
const defaultStyle = 'width: 25px; margin-top: 12px; cursor: pointer;';

function createVideoBtn(type) {
  let $insertBeforeNode;

  var $template = document.createElement('div'),
    $img = document.createElement('img');
  
  
  $img.setAttribute('src', `../../static/image/video-${type}-btn.png`);

  $template.id = `${type}-video`;
  if(['next','before'].includes(type)) {
    $template.style = type == 'next' ? (hasNextVideo() ? '':displayNone) : (hasBeforeVideo() ? '':displayNone) ;
    $template.addEventListener('click', () => onClickVideoSourceChange(type == 'next'));
    $insertBeforeNode = video.getInsertBeforeNode();
  } else if(type === 'playToggle') {
    if(player.paused()) $img.setAttribute('src', '../../static/image/video-playToggle-pause-btn.png');
    else $img.setAttribute('src', '../../static/image/video-playToggle-btn.png');
    $template.addEventListener('click' , onClickPlayToggle);
    $insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];
  } else {
    $template.addEventListener('click', () => onClickPlayBack());
    $insertBeforeNode = video.getInsertBeforeNode(); // document.getElementsByClassName('vjs-progress-control')[0];
  }

  if(type === 'playToggle') {
    $img.style = 'width: 35px; margin-top: 7px; cursor: pointer;';
  } else if (type === 'dbback') {
    $img.style = 'width: 40px; margin-top: 14px; cursor: pointer; padding: 0px 7.5px 0 7.5px;'
  } else {
    $img.style = defaultStyle;
  }

  $template.append($img);
  video.getControlBar().insertBefore($template, $insertBeforeNode);
  return $template;
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
  document.getElementById('before-video').style.display = hasBeforeVideo() ? 'block':'none';
  document.getElementById('next-video').style.display = hasNextVideo() ? 'block':'none';
}

// video ControlBar Event
function onClickVideoSourceChange(isNext) {
  video.setCurrentIndex(video.getCurrentIndex() + (isNext ? 1 : -1));
  player.src(getVideoSource());
  updateNavButton()
}

function onClickPlayBack() {
  var jumpTime = 15;
  var newTime,
      curTime = player.currentTime();
  if(curTime >= jumpTime) {
      newTime = curTime - jumpTime;
  } else {
      newTime = 0;
  }
  player.currentTime(newTime);
}

function onClickPlayToggle() {
  const $el = document.getElementById('playToggle-video').getElementsByTagName('img')[0];
  if(player.paused()) {
    player.play();
    $el.setAttribute('src', '../../static/image/video-playToggle-pause-btn.png')
  } else {
    player.pause();
    $el.setAttribute('src', '../../static/image/video-playToggle-btn.png')
  }
}