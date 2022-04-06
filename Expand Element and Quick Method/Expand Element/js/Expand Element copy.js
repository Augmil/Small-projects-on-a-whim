//

/**
 * 自定义音频组件
 */
class EAudio extends HTMLElement {
    constructor() {
        super();
        //初始化标签
        window.addEventListener('load', () => {

            this.audioName = this.getElementsByTagName('e-audio-name')[0];
            this.audioAuthor = this.getElementsByTagName('e-audio-author')[0];
            this.ctrls = this.getElementsByTagName('e-audio-ctrls')[0];


            console.log(this.ctrls, this.audioAuthor, this.audioName);
        })
    }
}
window.customElements.define('e-audio', EAudio);

class EAudioctrls extends HTMLElement {
    constructor() {
        super();
        //初始化标签
        window.addEventListener('load', () => {
            /**
             * 初始化 获取歌单 创建原生audio标签
             */
            let tn, e = this;
            do {
                e = e.parentElement;
                tn = e.tagName;
            } while (tn !== 'E-AUDIO' && tn !== 'BODY' && tn !== 'HTML');
            this.songs = e.dataset.songs ? e.dataset.songs.split(',') : [];
            this.songs = this.songs.filter(i => i && i.trim());
            //补全歌单地址
            let source = document.createElement('source');
            for (let s = 0; s < this.songs.length; s++) {
                source.src = this.songs[s];
                this.songs[s] = source.src;
            }
            //获取并补全默认歌曲地址
            this.currentSong = e.dataset.default ? (() => {
                source.src = e.dataset.default;
                return source.src;
            })() : this.songs.length > 0 ? this.songs[0] : null;

            //构建当前音乐定位函数
            this.locateCurrentSong = (currentSong) => {
                let cs = currentSong ? currentSong : this.audio.src;
                for (let s = 0; s < this.songs.length; s++) {
                    if (cs === this.songs[s]) {
                        return s;
                    };
                };
                return 0;
            }

            //创建原生音频标签
            this.audio = document.createElement('audio');
            this.audio.src = this.currentSong;

            /**
             * 创建基本按钮控件
             */
            let ctrls = document.createElement('div');
            this.appendChild(ctrls);
            ctrls.className = 'e-audio_ctrls';
            let last = `<svg id="e_audio_ctrl_last" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><polygon points="11 19 2 12 11 5 11 19"></polygon><polygon points="22 19 13 12 22 5 22 19"></polygon></svg>`;
            let pause = `<svg id="e_audio_ctrl_pause" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>`;
            let play = `<svg id="e_audio_ctrl_play"  xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>`;
            let next = `<svg id="e_audio_ctrl_next" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" ><polygon points="13 19 22 12 13 5 13 19"></polygon><polygon points="2 19 11 12 2 5 2 19"></polygon></svg>`;
            ctrls.innerHTML = last + play + pause + next;
            //获取控件按钮元素对象
            play = document.getElementById('e_audio_ctrl_play');
            pause = document.getElementById('e_audio_ctrl_pause');
            next = document.getElementById('e_audio_ctrl_next');
            last = document.getElementById('e_audio_ctrl_last');
            //创建滑块元素
            let slider = document.createElement('input');
            slider.type = 'range';
            slider.value = 0;
            this.appendChild(slider);

            /**
             * 初始化 创建audio事件
             */

            //修改进度条函数
            this.modifyProgressBar = () => {
                if (this.audio.ended) {
                    this.next();
                } else {
                    let total = this.audio.duration;
                    let currenTime = this.audio.currentTime;
                    slider.value = currenTime / total * 100;
                    slider.setAttribute('style', `background-image: linear-gradient(to right, #6bbae7 ${slider.value}%, #3e9acf00 1%);`);
                }
            };
            //创建进度刷新监听函数
            this.setRefreshProgressBar = () => { this.refreshProgressBar = setInterval(() => { this.modifyProgressBar(); }, 200); };
            //清除进度刷新监听函数
            this.clearRefreshProgressBar = () => { clearInterval(this.refreshProgressBar); };
            //修改当前时间函数
            this.modifyCurrentTime = () => {
                let total = this.audio.duration;
                //修改audio.currentTime
                this.audio.currentTime = (slider.value / 100) * total;
                this.modifyProgressBar();
            };
            //播放音乐函数
            this.play = () => {
                //修改按钮样式
                pause.style.display = 'inline-block';
                play.style.display = 'none';
                //播放音乐
                this.audio.play();
                this.setRefreshProgressBar();
                //更新当前音乐信息
                this.currentSong = this.audio.src;
                this.currentSongInde = this.locateCurrentSong();
            };
            //暂停音乐函数
            this.pause = () => {
                //修改按钮样式
                play.style.display = 'inline-block';
                pause.style.display = 'none';
                //暂停播放
                this.audio.pause();
                this.clearRefreshProgressBar();
            };
            //播放下一曲函数
            this.next = () => {
                this.pause();
                let index = this.locateCurrentSong() + 1;
                index = index >= this.songs.length ? 0 : index;
                this.audio.src = this.songs[index];
                this.play();
            };
            //播放上一曲函数
            this.last = () => {
                this.pause();
                let index = this.locateCurrentSong() - 1;
                index = index <= -1 ? this.songs.length - 1 : index;
                this.audio.src = this.songs[index];
                this.play();
            };

            /**
             * 绑定函数与控件事件
             */
            //点击播放
            play.addEventListener('click', (e) => { this.play(); });
            //点击暂停
            pause.addEventListener('click', (e) => { this.pause(); });
            //点击下一曲
            next.addEventListener('click', (e) => { this.next(); });
            //点击上一曲
            last.addEventListener('click', (e) => { this.last(); });
            //拖动滑块/点击进度条 更改播放进度
            slider.addEventListener('mousedown', () => {
                this.clearRefreshProgressBar();
            });
            slider.addEventListener('mouseup', () => {
                this.audio.currentTime = slider.value / 100 * this.audio.duration;
                if (this.audio.paused) {
                    this.play();
                } else {
                    this.setRefreshProgressBar();
                }
            });
        });
    }
}
window.customElements.define('e-audio-ctrls', EAudioctrls);







//