let player;

// 비디오 폴더 경로
const defaultSrc = './video/';

// 이미지 폴더 경로
const defaultImageSrc = '../../static/image/';

// 비디오 다음/이전 버튼 분기점
const indexBC = [
  {
    start: 1,
    end: 21,
  },
];

let config;

const query = location.search.replace(/\?/, '').split('&').reduce((acc, obj , i) => {
  const [key, value] = obj.split('=');
  acc[key] = value;
  return acc;
}, {});

const _class = query.class > 9 ? query.class : `0${Number(query.class)}`;
const index = query.index > 9 ? query.index : `0${Number(query.index)}`;

/**
 * 
 * @param {string} _sourceNm
 * @param {number} lastIndex
 */
function loadVideo() {

  config = indexBC.find(c => c.start <= index && c.end >= index);

  const source_name = `${_class}_${index}`;

  // 비디오 객체 생성
  videojs('player', {
    sources: [
      {
        src: `${defaultSrc}${source_name}.mp4`,
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
    // 배속 관리
    playbackRates: [1, 1.25, 1.5],
  })

  videojs.getPlayer("player").ready(function() {
    player = this;

    this.on("ended", () => {
      const $el = document.getElementById('playToggle-video').getElementsByTagName('img')[0];
      $el.setAttribute('src', `${defaultImageSrc}video-playToggle-btn.png`);

      // 영상이 끝날때 다음 버튼 노출 확인
      updateNavButton(hasNextVideo());
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

  let $controlBar = document.getElementsByClassName('vjs-control-bar')[0];
  let $insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];


  $controlBar.insertBefore($el, $insertBeforeNode);
}

const displayNone = 'display:none;';
const defaultStyle = 'width: 25px; margin-top: 12px; cursor: pointer;';

// controller bar에 버튼 추가
function createVideoBtn(type) {
  var $template = document.createElement('div'),
    $img = document.createElement('img');
  
  // 컨트롤러 이미지 경로
  $img.setAttribute('src', `${defaultImageSrc}video-${type}-btn.png`);

  $template.id = `${type}-video`;

  let $insertBeforeNode = document.getElementsByClassName('vjs-fullscreen-control')[0];

  if(['next','before'].includes(type)) {
    // 다음 / 이전 영상 버튼
    $template.style = (type == 'next' ? displayNone : (hasBeforeVideo() ? '':displayNone));
    $template.addEventListener('click', () => {
      onClickVideoSourceChange(type == 'next')
      if(typeof setCommit === 'function') {
        setCommit();
      }
    });
  } else if(type === 'playToggle') {
    // 재생 토글 버튼
    if(player.paused()) $img.setAttribute('src', `${defaultImageSrc}video-playToggle-pause-btn.png`);
    else $img.setAttribute('src', `${defaultImageSrc}video-playToggle-btn.png`);
    $template.addEventListener('click' , onClickPlayToggle);
    $insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];
  } else {
    // 영상 뒤로가기 버튼
    $template.addEventListener('click', () => onClickPlayBack());
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

  let $controlBar = document.getElementsByClassName('vjs-control-bar')[0]

  $controlBar.insertBefore($template, $insertBeforeNode);
  
  return $template;
}

// 다음 영상 여부 확인
function hasNextVideo() {
  return config.end > index;
}

// 이전 영상 여부 확인
function hasBeforeVideo() {
  return config.start < index;
}

// 다음 / 이전 영상 버튼 노출 조건에 따라 노출 / 숨김 처리
function updateNavButton(showNext) {
  document.getElementById('before-video').style.display = hasBeforeVideo() ? 'block':'none';
  document.getElementById('next-video').style.display = hasNextVideo() && showNext ? 'block':'none';
}

// video ControlBar Event
function onClickVideoSourceChange(isNext) {
  let videoIndex = Number(index) + (isNext ? 1 : -1);
  location.href = location.pathname + `?class=${_class}&index=${videoIndex > 9 ? videoIndex : `0${videoIndex}`}`;
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
    $el.setAttribute('src', `${defaultImageSrc}video-playToggle-pause-btn.png`)
  } else {
    player.pause();
    $el.setAttribute('src', `${defaultImageSrc}video-playToggle-btn.png`)
  }
}