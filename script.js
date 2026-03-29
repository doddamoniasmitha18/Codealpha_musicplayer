
const player = document.getElementById('player');
const audio = new Audio();
const cover = document.getElementById('cover');
const titleEl = document.getElementById('title');
const artistEl = document.getElementById('artist');
const progress = document.getElementById('progress');
const progressBar = document.getElementById('progressBar');
const currentTimeEl = document.getElementById('currentTime');
const durationEl = document.getElementById('duration');
const playBtn = document.getElementById('play');
const prevBtn = document.getElementById('prev');
const nextBtn = document.getElementById('next');
const volumeBar = document.getElementById('volumeBar');
const volumeProgress = document.getElementById('volumeProgress');
const playlistEl = document.getElementById('playlist');

const songs = [
  {
    title: "Neon Dreams",
    artist: "Cyber Wave",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    cover: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=600"
  },
  {
    title: "Midnight Run",
    artist: "Lunar Echo",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    cover: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
  },
  {
    title: "Solar Flare",
    artist: "Nova Pulse",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    cover: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?w=600"
  },
  {
    title: "Crystal Waves",
    artist: "Aqua Drift",
    src: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3",
    cover: "https://images.unsplash.com/photo-1553356084-58ef4a67b2a7?w=600"
  }
];

let currentSongIndex = 0;
let isPlaying = false;

function loadSong(index) {
  const song = songs[index];
  titleEl.textContent = song.title;
  artistEl.textContent = song.artist;
  audio.src = song.src;
  cover.src = song.cover;

  document.querySelectorAll('.playlist-item').forEach((item, i) => {
    item.classList.toggle('active', i === index);
  });

  audio.load();
  if (isPlaying) audio.play();
}

function playSong() {
  isPlaying = true;
  audio.play();
  playBtn.textContent = '⏸';
  player.classList.add('playing');
}

function pauseSong() {
  isPlaying = false;
  audio.pause();
  playBtn.textContent = '▶';
  player.classList.remove('playing');
}

function togglePlay() {
  if (isPlaying) pauseSong();
  else playSong();
}

function formatTime(seconds) {
  const min = Math.floor(seconds / 60);
  const sec = Math.floor(seconds % 60);
return `${min}:${sec.toString().padStart(2, '0')}`;
  }

audio.addEventListener('timeupdate', () => {
  if (!audio.duration) return;
  const percent = (audio.currentTime / audio.duration) * 100;
  progress.style.width = `${percent}%`;

  currentTimeEl.textContent = formatTime(audio.currentTime);
  durationEl.textContent = formatTime(audio.duration || 0);
});

audio.addEventListener('ended', () => {
  nextSong();
});

playBtn.addEventListener('click', togglePlay);

prevBtn.addEventListener('click', () => {
  currentSongIndex = (currentSongIndex - 1 + songs.length) % songs.length;
  loadSong(currentSongIndex);
  playSong();
});

nextBtn.addEventListener('click', nextSong);

function nextSong() {
  currentSongIndex = (currentSongIndex + 1) % songs.length;
  loadSong(currentSongIndex);
  playSong();
}

progressBar.addEventListener('click', (e) => {
  const rect = progressBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  audio.currentTime = pos * audio.duration;
});

volumeBar.addEventListener('click', (e) => {
  const rect = volumeBar.getBoundingClientRect();
  const pos = (e.clientX - rect.left) / rect.width;
  audio.volume = Math.max(0, Math.min(1, pos));
  volumeProgress.style.width = `${pos * 100}%`;
});

function renderPlaylist() {
  playlistEl.innerHTML = '';
  songs.forEach((song, index) => {
    const item = document.createElement('div');
    item.classList.add('playlist-item');
    if (index === currentSongIndex) item.classList.add('active');

    item.innerHTML = `
      <div>
        <div class="title">${song.title}</div>
        <div style="font-size:0.85rem; color:#aaa;">${song.artist}</div>
      </div>
      <span style="font-size:0.9rem; color:#888;">${index + 1}</span>
    `;

    item.addEventListener('click', () => {
      currentSongIndex = index;
      loadSong(index);
      playSong();
    });

    playlistEl.appendChild(item);
  });
}

audio.volume = 0.7;
volumeProgress.style.width = '70%';

loadSong(0);
renderPlaylist();

audio.addEventListener('loadedmetadata', () => {
  durationEl.textContent = formatTime(audio.duration);
});
