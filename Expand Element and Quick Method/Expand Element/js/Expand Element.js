/****************************************************************
 * 
 * 音频相关标签对象
 * 包括 e-audio、e-audio-name、e-audio-author、e-audio-ctrls
 *
 ****************************************************************/
{
    /**
     * 音频盒子标签
     */
    class EAudio extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                //获取歌单
                this.songs = this.dataset.songs ? this.dataset.songs.split(',') : [];
                this.songs = this.songs.filter(i => i && i.trim());
                //补全歌单地址
                let source = document.createElement('source');
                for (let s = 0; s < this.songs.length; s++) {
                    source.src = this.songs[s];
                    this.songs[s] = source.src;
                }
                //获取并补全默认歌曲地址
                this.currentSong = this.dataset.default ? (() => {
                    source.src = this.dataset.default;
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
                //获取必要标签元素
                this.audioName = this.getElementsByTagName('e-audio-name')[0];
                this.audioAuthor = this.getElementsByTagName('e-audio-author')[0];
                this.ctrls = this.getElementsByTagName('e-audio-ctrls')[0];
            })
        }
    }
    window.customElements.define('e-audio', EAudio);

    /**
     * 音频名称标签
     */
    class EudioName extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                if (this.dataset.href) {
                    let href = this.dataset.href;
                    this.addEventListener('click', () => {
                        switch (this.dataset.target) {
                            case '_self':
                                window.location.href = href;
                                break;
                            default:
                                window.open(href);
                                break;
                        }
                    });
                }

            });
        }
    }
    window.customElements.define('e-audio-name', EudioName);

    /**
     * 音频作者标签
     */
    class EudioAuthor extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                if (this.dataset.href) {
                    let href = this.dataset.href;
                    this.addEventListener('click', () => {
                        switch (this.dataset.target) {
                            case '_self':
                                window.location.href = href;
                                break;
                            default:
                                window.open(href);
                                break;
                        }
                    });
                }

            });
        }
    }
    window.customElements.define('e-audio-author', EudioAuthor);

    /**
     * 音频控件标签
     */
    class EAudioctrls extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                //查找上级e-audio元素
                let tn, eAudio = this;
                do {
                    eAudio = eAudio.parentElement;
                    tn = eAudio.tagName;
                } while (tn !== 'E-AUDIO' && tn !== 'BODY' && tn !== 'HTML');
                //继承上级e-audio元素属性
                this.audioName = this.audioName;
                this.audioAuthor = this.audioAuthor;
                this.audio = eAudio.audio;
                this.songs = eAudio.songs;
                this.currentSong = eAudio.currentSong;
                this.locateCurrentSong = eAudio.locateCurrentSong;
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
}

/****************************************************************
 * 
 * 音频相关标签对象
 * 包括 e-audio、e-audio-name、e-audio-author、e-audio-ctrls
 *
 ****************************************************************/
{
    /**
     * 相册盒子标签
     */
    class EAlbum extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                //获取所有图片
                this.imgs = this.dataset.imgs ? this.dataset.imgs.split(',') : [];
                this.imgs = this.imgs.filter(i => i && i.trim());
                //为相册图创建标签元素
                for (let i = 0; i < this.imgs.length; i++) {
                    let img = document.createElement('img');
                    img.src = this.imgs[i];
                    this.appendChild(img);
                    this.imgs[i] = img;
                }

                this.addEventListener('click', (e) => {
                    let tagName = e.path[0].tagName;
                    if (tagName === 'IMG') {
                        let img = e.path[0];

                        //查找所有img标签
                        var nodes = this.childNodes;
                        var imgs = [];
                        let smaImgs = [];
                        for (let n = 0; n < nodes.length; n++) {
                            let tagName = nodes[n].tagName;
                            if (tagName === 'IMG') {
                                imgs.push(nodes[n]);
                            }
                        }

                        //查找当前图像索引 函数
                        function findCurImgIndex(imgs, img) {
                            for (let i = 0; i < imgs.length; i++) {
                                if (imgs[i].src === img.src) {
                                    return i;
                                }
                            }
                            return false;
                        }
                        let curImgIndex = findCurImgIndex(imgs, img);

                        //修改当前预览图
                        function modifyCurtImg(eWarp, curImg, smaImgs) {

                            eWarp.style.left = eWarp.getBoundingClientRect().left + document.body.clientWidth / 2 - curImg.getBoundingClientRect().left + 'px'
                            curImg.className = 'e-album_thumbnail_current';
                            let bigImg = document.getElementsByClassName('e-album_big_img')[0];
                            bigImg.src = curImg.src;
                            if (smaImgs != undefined) {
                                smaImgs[curImgIndex].className = '';
                                curImgIndex = findCurImgIndex(imgs, curImg);
                            }
                        }


                        //打开遮盖层/预览窗
                        let body = document.getElementsByTagName('body')[0];
                        let cover = document.createElement('div');
                        cover.setAttribute('class', 'e-album_win_cover');
                        body.appendChild(cover);
                        body.style.overflow = "hidden";
                        //body.style.height = "100%";
                        //关闭 遮盖/预览窗 函数
                        function closeCover() {
                            body.style.overflow = "auto";
                            //body.style.height = "auto";
                            cover.remove();
                        }
                        let eles = [];
                        /**
                         * 放大的图像
                         */
                        eles.push({
                            tagName: 'img',
                            attr: [{
                                    name: 'className',
                                    value: 'e-album_big_img',
                                },
                                {
                                    name: 'src',
                                    value: img.src,
                                },
                            ],
                            on: [{
                                event: 'click',
                                method: (eleSelf) => {
                                    closeCover();
                                }
                            }, ]
                        });
                        /**
                         * 关闭按钮
                         */
                        eles.push({
                            tagName: 'div',
                            attr: [{
                                name: 'className',
                                value: 'e-album_cover_close',
                            }],
                            on: [{
                                event: 'click',
                                method: (eleSelf) => {
                                    closeCover();
                                }
                            }, ],
                        });
                        /**
                         * 预览缩略图
                         */
                        eles.push({
                            tagName: 'div',
                            attr: [{
                                name: 'className',
                                value: 'e-album_thumbnail_warp',
                            }],
                            on: [{
                                event: 'click',
                                method: (eleSelf) => {
                                    let eWarp = eleSelf;
                                    if (eWarp.path[0].tagName === 'IMG') {
                                        modifyCurtImg(eWarp.path[1], eWarp.path[0], smaImgs);
                                    }
                                }
                            }, ],
                            init: (eleSelf) => {
                                let eWarp = eleSelf;
                                //生成缩略图
                                for (let i = 0; i < imgs.length; i++) {
                                    let smaImg = document.createElement('img');
                                    eWarp.appendChild(smaImg);
                                    smaImg.src = imgs[i].src;
                                    smaImgs[i] = smaImg;
                                    if (i === curImgIndex) {
                                        modifyCurtImg(eWarp, smaImg);
                                    }
                                }


                                /**
                                 * 上一张 --> 向左箭头
                                 */
                                eles.push({
                                    tagName: 'div',
                                    attr: [{
                                        name: 'className',
                                        value: 'e-album_to_left',
                                    }],
                                    on: [{
                                        event: 'click',
                                        method: (eleSelf) => {
                                            let eWarp = document.getElementsByClassName('e-album_thumbnail_warp')[0];
                                            let index = curImgIndex - 1 < 0 ? smaImgs.length - 1 : curImgIndex - 1;
                                            console.log(index, eWarp, smaImgs[index], smaImgs);
                                            modifyCurtImg(eWarp, smaImgs[index], smaImgs);
                                        }
                                    }, ],
                                });
                                /**
                                 * 下一张 --> 向右箭头
                                 */
                                eles.push({
                                    tagName: 'div',
                                    attr: [{
                                        name: 'className',
                                        value: 'e-album_to_right',
                                    }],
                                    on: [{
                                        event: 'click',
                                        method: (eleSelf) => {
                                            let eWarp = document.getElementsByClassName('e-album_thumbnail_warp')[0];
                                            let index = curImgIndex + 1 > smaImgs.length - 1 ? 0 : curImgIndex + 1;
                                            modifyCurtImg(eWarp, smaImgs[index], smaImgs);
                                        }
                                    }, ],
                                });

                            },
                        });

                        //批量生成上述预定标签
                        for (let e = 0; e < eles.length; e++) {
                            //生成元素
                            let ele = document.createElement(eles[e].tagName);
                            cover.appendChild(ele);
                            eles[e].ele = ele;

                            //设置属性
                            let atts = Array.isArray(eles[e].attr) ? eles[e].attr : [];
                            for (let a = 0; a < atts.length; a++) {
                                ele[atts[a].name] = atts[a].value;
                            }

                            //设置监听事件
                            let ons = Array.isArray(eles[e].on) ? eles[e].on : [];
                            for (let o = 0; o < ons.length; o++) {
                                ele.addEventListener(ons[o].event,
                                    (eleSelf) => {
                                        ons[o].method(eleSelf)
                                    })
                            }

                            //初始化标签
                            typeof(eles[e].init) === "function" ? eles[e].init(ele): null;

                        }



                    }
                })


            })
        }
    }
    window.customElements.define('e-album', EAlbum);

    /**
     * title标题标签
     */
    class ETitle extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                if (this.dataset.href) {
                    let href = this.dataset.href;
                    this.addEventListener('click', () => {
                        switch (this.dataset.target) {
                            case '_self':
                                window.location.href = href;
                                break;
                            default:
                                window.open(href);
                                break;
                        }
                    });
                }

            });
        }
    }
    window.customElements.define('e-title', ETitle);

    /**
     * 标签元素标签
     */
    class ETag extends HTMLElement {
        constructor() {
            super();
            //初始化标签
            window.addEventListener('load', () => {
                if (this.dataset.href) {
                    let href = this.dataset.href;
                    this.addEventListener('click', () => {
                        switch (this.dataset.target) {
                            case '_self':
                                window.location.href = href;
                                break;
                            default:
                                window.open(href);
                                break;
                        }
                    });
                }

            });
        }
    }
    window.customElements.define('e-tag', ETag);
}

















//日期2022年03月12日