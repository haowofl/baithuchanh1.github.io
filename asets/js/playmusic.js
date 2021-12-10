const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);
const heading = $('header h2');
const cdThumb = $('.cd-thumb');
const audio = $('#audio');
const cd = $('.cd');
const btnPlay = $('.btn-toggle-play');
const btnplayer = $('.player');
const btnnext = $('.btn-next');
const btnprev = $('.btn-prev');
const btnrepeat = $('.btn-repeat');
const btnrandom = $('.btn-random');
const progress = $('#progress');
const playlist = $('.playlist');

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  songs: [
    {
      name: "Attention",
      singer: "Charlie Puth",
      path: "./asets/music/song1.mp3",
      image: "./asets/img/001.png"
    },
    {
      name: "Aurora/Cực Quang",
      singer: "Thắng Dữ",
      path: "./asets/music/song2.mp3",
      image: "./asets/img/002.png"
    },
    {
        name: "Bóng tối trước bình minh",
        singer: "Hác Kỳ Lưc Và Thư Nham",
        path: "./asets/music/song3.mp3",
        image: "./asets/img/003.png"
    },
    {
        name: "Đại thiên bồng",
        singer: "Lý Viên Kiệt",
        path: "./asets/music/song4.mp3",
        image: "./asets/img/004.png"
    },
    {
      name: "Giấc mơ không thể đánh đổi",
      singer: "Phương Thập Nhị",
      path: "./asets/music/song5.mp3",
      image: "./asets/img/005.png"
    },
    {
        name: "Lãng Tử Nhàn Thoại",
        singer: "Hoa Đồng",
        path: "./asets/music/song6.mp3",
        image: "./asets/img/006.png"
    },
    {
      name: "24kGold",
      singer: "Moon ft Iann Dior",
      path: "./asets/music/song7.mp3",
      image: "./asets/img/007.png"
    },
    {
      name: "Mỹ Nhân Họa Quyển",
      singer: "Văn Nhân Thính Thư",
      path: "./asets/music/song8.mp3",
      image: "./asets/img/008.png"
    },
    {
      name: "Phá Kén",
      singer: "Trương Thiều Hàm",
      path: "./asets/music/song9.mp3",
      image: "./asets/img/009.png"
    },
    {
      name: "Thập Niên Nhân Gian",
      singer: "Lão Can Ma",
      path: "./asets/music/song10.mp3",
      image: "./asets/img/010.png"
    },
    {
      name: "Túy Khuynh Thành",
      singer: "Tiểu A Phong",
      path: "./asets/music/song11.mp3",
      image: "./asets/img/011.png"
    },
    {
      name: "Vong Xuyên Bỉ Ngạn",
      singer: "Linh Nhất Cửu Linh Nhị",
      path: "./asets/music/song12.mp3",
      image: "./asets/img/012.png"
    },
    {
      name: "Yến Vô Hiết",
      singer: "Tưởng Tuyết Nhi",
      path: "./asets/music/song13.mp3",
      image: "./asets/img/013.png"
    },
    {
      name: "Nevada",
      singer: "Vicetone; Cozi Zuehlsdorff",
      path: "./asets/music/song14.mp3",
      image: "./asets/img/014.png"
    },

  ],
  render: function(){
    const htmls = this.songs.map(function(song, index){
      return `
         <div class="song ${index === app.currentIndex ? 'active' : ''}" data-index ="${index}">
            <div class="thumb" style="background-image: url('${song.image}')">
            </div>
            <div class="body">
              <h3 class="title">${song.name}</h3>
              <p class="author">${song.singer}</p>
            </div>
            <div class="option">
              <i class="fas fa-ellipsis-h"></i>
            </div>
          </div>
          `
    })
    playlist.innerHTML = htmls.join('');
  },
  defineProperties: function() {// Phương thức Object.defineProperties() cho phép xác định một thuộc tính mới hoặc sửa đổi các thuộc tính của đối tượng trực tiếp trên nó
    Object.defineProperty(this, 'currentSong', {
      get: function() {
        return this.songs[this.currentIndex]
      }
    })
  },

  handleEvents: function() {
    const _this =this;
    const cdwidth = cd.offsetWidth;

    //Xử lý cd quay
    const cdThumbAnimate = cdThumb.animate([
      {transform: 'rotate(360deg)'},
    ],{
      duration: 10000,//10s
      iterations: Infinity,
    })
    cdThumbAnimate.pause();

    //xử lý phóng to thu nhỏ cd
    document.onscroll = function() {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;

      const newwidth = cdwidth - scrollTop;
      
      cd.style.width = newwidth > 0 ? newwidth +'px' : 0;
      cd.style.opacity = newwidth/cdwidth;
    }

    //xử lý khi click play
    btnPlay.onclick = function() {
      if(_this.isPlaying){
        audio.pause();

      } else {
        audio.play();
      }  
    }

    // khi song được play playe
    audio.onplay = function() {
      _this.isPlaying = true;
      btnplayer.classList.add('playing')
      cdThumbAnimate.play()
      _this.render();
      _this.scrollToActiveSong();
      
    }
    //khi song bị pause
    audio.onpause = function() {
      _this.isPlaying = false;
      btnplayer.classList.remove('playing');
      cdThumbAnimate.pause();

    }
    //Khi tiến độ bài hát thay đổi
    audio.ontimeupdate = function() {
      if(audio.duration) {
        const progressPercent = Math.floor(audio.currentTime / audio.duration * 100);
        progress.value = progressPercent
      }
    }
    // Xu ly khi tua song
    progress.onchange = function(e) {
      const seekTime = e.target.value * audio.duration / 100;
      audio.currentTime = seekTime;
    }

    //khi next Song
    btnnext.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      }
      else{
        _this.nextSong();
      }
      audio.play();
      
    }

    //Khi prev song
    btnprev.onclick = function() {
      if(_this.isRandom) {
        _this.randomSong();
      }
      else{
        _this.prevSong();
      }
      audio.play();
    }

    //khi random
    btnrandom.onclick = function() {
      _this.isRandom = !_this.isRandom;
      btnrandom.classList.toggle('active', _this.isRandom);
      btnrepeat.classList.remove('active');
    }
    //Khi audio ended
    audio.onended = function() {
      if(_this.isRepeat) {
        audio.play()
      }else {
        btnnext.click();
      }
      audio.play();
    }
    //Khi repeat
    btnrepeat.onclick = function() {
      _this.isRepeat = !_this.isRepeat;
      btnrepeat.classList.toggle('active', _this.isRepeat);
      btnrandom.classList.remove('active');
    }
    //play khi click vào element
    playlist.onclick = function(e) {
      const songNode = e.target.closest('.song:not(.active)');
     if(songNode || e.target.closest('.option')) {
       if (songNode) {
        _this.currentIndex = Number(songNode.dataset.index);
        _this.loadCurrentSong();
        _this.render();
        audio.play();
       }
       if (e.target.closest('.option')) {
         alert('Tạm thời chưa có gì...')
       }
     }
    }
  },

  loadCurrentSong: function() {

    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },

  nextSong: function() {
    this.currentIndex++;
    if(this.currentIndex >= this.songs.length) {
      this.currentIndex = 0
    }
    this.loadCurrentSong();
  },
  prevSong: function() {
    this.currentIndex--;
    if(this.currentIndex <= -1) {
      this.currentIndex = this.songs.length -1;
    }
    this.loadCurrentSong()
  },
  randomSong: function() {
    let newIndex
    do {
       newIndex = Math.floor(Math.random() * this.songs.length)

    } while( newIndex == this.currentIndex)// nghĩa là khi đk while đúng thì sẽ chạy vòng lặp trên còn không đúng thì không chạy
    this.currentIndex = newIndex; // gán cho curentIndex bằng với Index random 
    this.loadCurrentSong();    
  },
  scrollToActiveSong: function() {
    setTimeout(function(){
      this.currentIndex = $('.song.active').getAttribute('data-index')
      if(this.currentIndex <= 3) {
      $('.song.active').scrollIntoView(
        {
          behavior: "smooth",
          block : "end",
        }
      )
      } else {
        $('.song.active').scrollIntoView(
          {
            behavior: "smooth",
            block : "nearest",
          }
        )
      }
    },500)
  },


  start: function(){
    //Định nghĩa các thuộc tính cho object
    this.defineProperties();

    //lắng nghe / sử lý các sự kiện (Dom event)
    this.handleEvents();

    // tải thông tin bài hát đầu tiên vào ui khi chạy ứng dụng
    this.loadCurrentSong();

    //render lại playlist
    this.render();
  }
};
app.start();