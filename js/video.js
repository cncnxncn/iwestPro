let player;
const defaultSrc = './video/';

// 비디오 관련 데이터 관리
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
 * @param {string} _sourceNm
 * @param {number} lastIndex
 */
function loadVideo(_sourceNm, lastIndex) {
  // 영상 파일명 분기처리
  let bc = _sourceNm.lastIndexOf('_');
  // 인덱스 제외한 파일명
  let classNm = _sourceNm.substr(0, bc);
  // 영상 인덱스
  let videoIndex = _sourceNm.substr(bc + 1);

  console.log('classNm : ' ,  classNm, '\nvideoindex : ' ,  videoIndex);

  video.setCurrentIndex(Number(videoIndex));
  video.setLastIndex(lastIndex);
  video.setClassName(classNm);

  // 비디오 객체 생성
  videojs('player', {
    sources: [
      {
        src: `${defaultSrc}${_sourceNm}.mp4`,
        type: "video/mp4"
      },
    ],
    controls: true,
    muted: false,
    autoplay: true,
    controlBar: {
      playToggle: false,
      pictureInPictureToggle: false,
    },
    // 배속 관리
    playbackRates: [1, 1.25, 1.5],
  })

  videojs.getPlayer("player").ready(function() {
    player = this;

    this.on("ended", () => {
      const $el = document.getElementById('playToggle-video').getElementsByTagName('img')[0];
      $el.setAttribute('src', '../../static/image/video-playToggle-btn.png');

      // 영상이 끝날때 다음 버튼 노출 확인
      updateNavButton(true);
    });

    addNavButton();
  });
};

function addNavButton() {

  createVideoBtn('before');
  createVideoBtn('next');

  createVideoBtn('playToggle');
  createVideoBtn('dbback');

  let $el = document.getElementsByClassName('vjs-volume-panel')[0];
  video.getControlBar().insertBefore($el, video.getInsertBeforeNode());
}

const displayNone = 'display:none;';
const defaultStyle = 'width: 25px; margin-top: 12px; cursor: pointer;';

// controller bar에 버튼 추가
function createVideoBtn(type) {
  let $insertBeforeNode;

  var $template = document.createElement('div'),
    $img = document.createElement('img');
  
  // 컨트롤러 이미지 경로
  $img.setAttribute('src', `../../static/image/video-${type}-btn.png`);

  $template.id = `${type}-video`;
  
  if(['next','before'].includes(type)) {
    // 다음 / 이전 영상 버튼
    $template.style = (type == 'next' ? displayNone : (hasBeforeVideo() ? '':displayNone));
    $template.addEventListener('click', () => {
      onClickVideoSourceChange(type == 'next')
      if(typeof setCommit === 'function') {
        setCommit();
      }
    });
    $insertBeforeNode = video.getInsertBeforeNode();
  } else if(type === 'playToggle') {
    // 재생 토글 버튼
    if(player.paused()) $img.setAttribute('src', '../../static/image/video-playToggle-pause-btn.png');
    else $img.setAttribute('src', '../../static/image/video-playToggle-btn.png');
    $template.addEventListener('click' , onClickPlayToggle);
    $insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];
  } else {
    // 영상 뒤로가기 버튼
    $template.addEventListener('click', () => onClickPlayBack());
    $insertBeforeNode = video.getInsertBeforeNode(); // document.getElementsByClassName('vjs-progress-control')[0];
  }

  // 버튼별 css 분기처리
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

// 다음 영상 여부 확인
function hasNextVideo() {
  return video.getCurrentIndex() < video.getLastIndex();
}

// 이전 영상 여부 확인
function hasBeforeVideo() {
  return video.getCurrentIndex() > 1;
}

// 영상 파일명 가져오기
function getVideoSource() {
  return `${defaultSrc}${video.getClassName()}_${video.getCurrentIndexStr()}.mp4`;
}

// 다음 / 이전 영상 버튼 노출 조건에 따라 노출 / 숨김 처리
function updateNavButton(showNext) {
  document.getElementById('before-video').style.display = hasBeforeVideo() ? 'block':'none';
  document.getElementById('next-video').style.display = hasNextVideo() && showNext ? 'block':'none';
}

// video ControlBar Event
function onClickVideoSourceChange(isNext) {
  video.setCurrentIndex(video.getCurrentIndex() + (isNext ? 1 : -1));
  player.src(getVideoSource());
  updateNavButton(false)
}

// 영상 뒤로가기
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