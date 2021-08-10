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
  })

  videojs.getPlayer("player").ready(function() {
    player = this;

    addNavButton();
  });
};

function addNavButton() {

  // before부터 넣어야 next가 오른쪽
  createVideoBtn('before');
  createVideoBtn('next');
  createVideoBtn('dbback');

  createSideBar();
}

const displayNone = 'display:none;';
const defaultStyle = 'width: 25px; margin-top: 2px; cursor: pointer;';

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
  } else {
    $template.addEventListener('click', () => onClickPlayBack());
    $insertBeforeNode = document.getElementsByClassName('vjs-progress-control')[0];
  }
  $img.style = defaultStyle;

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

const config = {
  test: [
    {
      title: "Expectation",
      list: [
        {
          name: "ㆍ목표알기",
          source: "1"
        }
      ]
    },
    {
      title: "Notion",
      list: [
        {
          name: "ㆍ진단하기",
          source: "2"
        }
      ]
    },
    {
      title: "Experience",
      list: [
        {
          name: "1. SLP 기동",
          source: "",
        },
        {
          name: "2. 순환수 펌프 기동",
          source: "",
        },
        {
          name: "3. 해수 냉각수 펌프 기동",
          source: "",
        },
        {
          name: "4. WBVP 기동",
          source: "",
        },
      ]
    }
  ]
}

function createSideBar() {
  let data = config["test"];
  var $layer = document.createElement('div'),
    $template = document.createElement('div'),
    $content = document.createElement('ul'),
    $controlBtn = document.createElement('div'),
    $controlBtnTitle = document.createElement('p'),
    $controlBtnArrow = document.createElement('img');

  // class binding
  $layer.className = 'sideBarLayer';
  $template.className = 'template';
  $content.className = 'content';
  $controlBtn.className = 'toggle';
  $controlBtnTitle.className = 'title';
  $controlBtnArrow.className = 'arrow';

  $controlBtnArrow.src = '../../static/image/vector-arrow.png';

  $controlBtnTitle.textContent = '학습목차';

  for(var i = 0; i < data.length; i++) {
    $content.append(getContent(data[i]));
  }

  $controlBtn.addEventListener('click', function() {
    if(!this.classList.contains('on')) {
      $layer.classList.add('active');
    } else {
      $layer.classList.remove('active');
    }
    this.classList.toggle('on');
  })

  $template.append($content);

  $controlBtn.append($controlBtnTitle);
  $controlBtn.append($controlBtnArrow);

  $template.append($controlBtn);

  $layer.append($template);

  document.body.appendChild($layer);
}

var getContent = (_data) => {
  var $el = document.createElement('li');
    $title = document.createElement('div'),
    $titleText = document.createElement('p'),
    $content = document.createElement('div'),
    $contentUl = document.createElement('ul');


    let [em,text] = [_data.title.substr(0,1), _data.title.slice(1)];
    $title.className = 'title';

    $content.className = 'index';

    $titleText.innerHTML = `<em>${em}</em>${text}`;

    $title.append($titleText);

    for(var i = 0; i < _data.list.length; i++) {
      var $li = document.createElement('li');
      $li.textContent = _data.list[i].name;
      var source = _data.list[i].source;
      console.log('index : ' , i , '\n source : ' ,source)
      $li.addEventListener('click', () => {
        alert(source);
      });

      $contentUl.append($li);
    }


    $content.appendChild($contentUl);

    $el.append($title);
    $el.append($content);

    return $el;
}