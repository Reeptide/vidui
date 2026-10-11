/**
 * VidCompress - Reusable Modern Video Player Component
 * Provides custom sleek playback controls, scrub timeline, volume, speed, and fullscreen.
 */

class ModernVideoPlayer {
  constructor(config) {
    this.wrapper = document.getElementById(config.wrapperId);
    this.video = document.getElementById(config.videoId);
    this.overlay = document.getElementById(config.overlayId);
    this.bigPlayBtn = document.getElementById(config.bigPlayBtnId);
    this.playBtn = document.getElementById(config.playBtnId);
    this.timelineContainer = document.getElementById(config.timelineId);
    this.progressBar = document.getElementById(config.progressBarId);
    this.bufferBar = document.getElementById(config.bufferBarId);
    this.currentTimeEl = document.getElementById(config.currentTimeId);
    this.durationEl = document.getElementById(config.durationId);
    this.volumeBtn = document.getElementById(config.volumeBtnId);
    this.volumeSlider = document.getElementById(config.volumeSliderId);
    this.speedSelect = document.getElementById(config.speedSelectId);
    this.pipBtn = document.getElementById(config.pipBtnId);
    this.fullscreenBtn = document.getElementById(config.fullscreenBtnId);

    this.isDraggingTimeline = false;
    this.previousVolume = 1;

    this.initEvents();
  }

  initEvents() {
    if (!this.video) return;

    // Play / Pause toggles
    if (this.bigPlayBtn) {
      this.bigPlayBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }

    if (this.overlay) {
      this.overlay.addEventListener('click', () => this.togglePlay());
    }

    if (this.playBtn) {
      this.playBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.togglePlay();
      });
    }

    // Video events
    this.video.addEventListener('play', () => this.onPlayStateChange(true));
    this.video.addEventListener('pause', () => this.onPlayStateChange(false));
    this.video.addEventListener('ended', () => this.onPlayStateChange(false));

    this.video.addEventListener('timeupdate', () => this.updateTimeAndProgress());
    this.video.addEventListener('loadedmetadata', () => this.onMetadataLoaded());
    this.video.addEventListener('progress', () => this.updateBuffer());

    // Timeline Scrubbing
    if (this.timelineContainer) {
      this.timelineContainer.addEventListener('click', (e) => this.seekTimeline(e));
      
      const handleDrag = (e) => {
        if (!this.isDraggingTimeline) return;
        this.seekTimeline(e);
      };

      this.timelineContainer.addEventListener('mousedown', () => {
        this.isDraggingTimeline = true;
      });

      window.addEventListener('mousemove', handleDrag);
      window.addEventListener('mouseup', () => {
        this.isDraggingTimeline = false;
      });
    }

    // Volume controls
    if (this.volumeBtn) {
      this.volumeBtn.addEventListener('click', () => this.toggleMute());
    }

    if (this.volumeSlider) {
      this.volumeSlider.addEventListener('input', (e) => {
        const val = parseFloat(e.target.value);
        this.setVolume(val);
      });
    }

    // Playback Speed
    if (this.speedSelect) {
      this.speedSelect.addEventListener('change', (e) => {
        this.video.playbackRate = parseFloat(e.target.value);
      });
    }

    // Picture in Picture
    if (this.pipBtn) {
      if ('pictureInPictureEnabled' in document) {
        this.pipBtn.addEventListener('click', async () => {
          try {
            if (document.pictureInPictureElement) {
              await document.exitPictureInPicture();
            } else {
              await this.video.requestPictureInPicture();
            }
          } catch (err) {
            console.warn('PiP error:', err);
          }
        });
      } else {
        this.pipBtn.style.display = 'none';
      }
    }

    // Fullscreen
    if (this.fullscreenBtn) {
      this.fullscreenBtn.addEventListener('click', () => this.toggleFullscreen());
    }
  }

  loadSource(src) {
    if (!this.video) return;
    this.video.src = src;
    this.video.load();
    this.onPlayStateChange(false);
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.bufferBar) this.bufferBar.style.width = '0%';
    if (this.currentTimeEl) this.currentTimeEl.textContent = '00:00';
  }

  togglePlay() {
    if (this.video.paused || this.video.ended) {
      this.video.play().catch(err => {
        console.warn('Auto-play blocked or error:', err);
      });
    } else {
      this.video.pause();
    }
  }

  onPlayStateChange(isPlaying) {
    if (isPlaying) {
      if (this.overlay) this.overlay.classList.add('hidden');
      if (this.playBtn) this.playBtn.classList.add('playing');
      if (this.wrapper) this.wrapper.classList.remove('paused');
    } else {
      if (this.overlay) this.overlay.classList.remove('hidden');
      if (this.playBtn) this.playBtn.classList.remove('playing');
      if (this.wrapper) this.wrapper.classList.add('paused');
    }
  }

  onMetadataLoaded() {
    if (this.durationEl && this.video.duration) {
      this.durationEl.textContent = this.formatTime(this.video.duration);
    }
    this.updateBuffer();
  }

  updateTimeAndProgress() {
    const cur = this.video.currentTime || 0;
    const dur = this.video.duration || 0;

    if (this.currentTimeEl) {
      this.currentTimeEl.textContent = this.formatTime(cur);
    }

    if (this.progressBar && dur > 0) {
      const pct = (cur / dur) * 100;
      this.progressBar.style.width = `${pct}%`;
    }
  }

  updateBuffer() {
    if (!this.bufferBar || !this.video.duration) return;
    try {
      const buffered = this.video.buffered;
      if (buffered.length > 0) {
        const bufferedEnd = buffered.end(buffered.length - 1);
        const pct = (bufferedEnd / this.video.duration) * 100;
        this.bufferBar.style.width = `${pct}%`;
      }
    } catch (e) {
      // ignore
    }
  }

  seekTimeline(e) {
    if (!this.video.duration || !this.timelineContainer) return;
    const rect = this.timelineContainer.getBoundingClientRect();
    const clickX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const pct = clickX / rect.width;
    this.video.currentTime = pct * this.video.duration;
    if (this.progressBar) {
      this.progressBar.style.width = `${pct * 100}%`;
    }
  }

  setVolume(val) {
    this.video.volume = val;
    this.video.muted = (val === 0);
    this.updateVolumeUI(val);
  }

  toggleMute() {
    if (this.video.muted || this.video.volume === 0) {
      this.video.muted = false;
      this.setVolume(this.previousVolume || 0.8);
      if (this.volumeSlider) this.volumeSlider.value = this.previousVolume || 0.8;
    } else {
      this.previousVolume = this.video.volume;
      this.video.muted = true;
      this.updateVolumeUI(0);
      if (this.volumeSlider) this.volumeSlider.value = 0;
    }
  }

  updateVolumeUI(val) {
    if (!this.volumeBtn) return;
    if (val === 0 || this.video.muted) {
      this.volumeBtn.classList.add('muted');
    } else {
      this.volumeBtn.classList.remove('muted');
    }
  }

  toggleFullscreen() {
    if (!document.fullscreenElement) {
      if (this.wrapper.requestFullscreen) {
        this.wrapper.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
  }

  formatTime(totalSeconds) {
    if (isNaN(totalSeconds) || totalSeconds < 0) return '00:00';
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = Math.floor(totalSeconds % 60);

    const pad = (n) => String(n).padStart(2, '0');

    if (hrs > 0) {
      return `${hrs}:${pad(mins)}:${pad(secs)}`;
    }
    return `${pad(mins)}:${pad(secs)}`;
  }
}
