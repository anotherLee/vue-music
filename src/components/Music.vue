<style scoped>
    .musicContainer{
        height: 80vh;
    }
    .music{
        height: 60vh;
        padding: 15vh 0 0 10vh;
    }
    .music:after{
        content: '';
        display: block;
        clear: both;
    }
    .music-left, .music-right{
        float: left;
        width: 40%;
        text-align:center;
    }
    .music-right{
        text-align: left;
        margin-left: 5vh;
        min-height: 30vh;
    }
    .iconfont{
        color: rgba(255,255,255, 0.9);
        font-size: 5vh;
        margin: 0 4vh;
        cursor: pointer;
        user-select: none;
        -webkit-user-select: none;
    }
    .cover{
        width: 50vh;
        height:50vh;
        margin: 0 auto;
    }
    .control{
        margin-top:5vh;
    }
    .music-right{
        color: white;
    }
    .label{
        display: inline-block;
        background-color:#4780E8;
        padding: 0.7vh 2vh;
    }
    .title{
        font-size: 5vh;
        margin-top: 5vh;
    }
    .counts {
        margin-top: 6vh;
    }
    .counts > span{
        display: inline-block;
        margin-left: 8vh;
    }
    .counts > span:first-child{
        margin-left: 0;
    }
    .counts i{
        font-size:3vh;
        margin:0;
        vertical-align: text-bottom;
    }
    .progressWrapper{
        display: flex;
        align-items: center;
        margin-top: 6vh;
    }
    .progressBack{
        position: relative;
        height: 0.8vh;
        width: 85%;
        background-color: rgba(255,255,255,0.4);
        border-radius: 0.4vh;
    }
    .progressFont{
        position: absolute;
        left: 0;
        top: 0;
        height: 100%;
        border-radius: 0.4vh;
        background-color: white;
    }
    .time{
        margin-left: 2vh;
        font-size: 2vh;
    }
    .author{
        margin-top:4vh;
    }
    .lyric{
        margin-top: 4vh;
        color: rgba(255,255,255,0.4);
    }
</style>

<template>
    <div class="musicContainer">
        <div class="music">
            <div class="music-left">
                <div class="cover" :style="coverBg"></div>
                <div class="control">
                    <i class="iconfont icon-heart1"></i>
                    <i class="iconfont" :class="{ 'icon-play': play === true, 'icon-pause': play === false }" @click="pauseOrPlay"></i>
                    <i class="iconfont icon-next" @click="nextSong"></i>
                </div>
            </div>
            <div class="music-right">
                <span class="label">90后</span>
                <h3 class="title">{{ songInformation.title  }}</h3>
                <div class="counts">
                    <span>
                        <i class="iconfont icon-earphone"></i>
                        <span>3213</span>
                    </span>
                    <span>
                        <i class="iconfont icon-heart1"></i>
                        <span>128</span>
                    </span>
                    <span>
                        <i class="iconfont icon-thumbsup"></i>
                        <span>23</span>
                    </span>
                </div>
                <div class="progressWrapper">
                    <div class="progressBack">
                        <div class="progressFont" :style="{ width }"></div>
                    </div>
                    <div class="time">{{ computedCurrentTime }}</div>
                </div>
                <h4 class="author">{{ songInformation.artist }}</h4>
                <div class="lyric">{{ lyricShow }}</div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: ['innerSong'],
    watch: {
        innerSong (newVal) {
            this.cover = newVal.picture
            this.srcAudio(newVal.url)
            this.getLyric(newVal.sid)
        }
    },
    data () {
        return {
            cover: null,
            play: false,
            width: null,
            duration: null,
            currentTime: 0,
            lyric: {},
            lyricShow: ''
        }
    },
    computed: {
        coverBg () {
            return {
                backgroundImage: `url(${this.cover})`,
                backgroundSize: 'cover'
            }
        },
        songInformation () {
            return this.innerSong
                ? this.innerSong
                : {
                    artist: '周杰伦',
                    picture: 'http://qukufile2.qianqian.com/data2/pic/63cde58f65ba517dff875f6b0a3a8585/551547323/551547323.jpg@s_1,w_300,h_300',
                    title: '龙猫睡着了'
                }
        },
        computedCurrentTime () {
            const mins = parseInt(this.currentTime / 60)
            let seconds = this.currentTime % 60
            seconds = seconds < 10 ? '0' + seconds : '' + seconds
            return mins + ':' + seconds
        }
    },
    mounted () {
        this.initAudio()
    },
    methods: {
        initAudio () {
            this.audio = new Audio()
            this.audio.autoplay = true
            this.audio.loop = true
            this.bindEvents()
        },
        bindEvents () {
            this.audio.addEventListener('timeupdate', () => {
                this.width = (this.audio.currentTime / this.audio.duration * 100).toFixed(2) + '%'
            })
            this.audio.addEventListener('playing', () => {
                this.duration = parseInt(this.audio.duration)
                if (this.playingClock) window.clearInterval(this.playingClock)
                this.playingClock = window.setInterval(() => {
                    this.currentTime = parseInt(this.audio.currentTime)
                    this.scanLyric()
                }, 1000)
            })
        },
        srcAudio (songUrl) {
            this.audio.src = songUrl
            console.log(this.audio, this.audio.duration)
        },
        pauseOrPlay () {
            if (this.play) {
                this.audio.play()
                this.play = false
            } else {
                this.audio.pause()
                this.play = true
                window.clearInterval(this.playingClock)
            }
        },
        nextSong () {
            this.$emit('next')
        },
        getLyric (sid) {
            this.$http.get('https://jirenguapi.applinzi.com/fm/getLyric.php', {
                params: { sid }
            })
                .then((response) => {
                    console.log(response)
                    this.formatLyric(response.data.lyric)
                }).catch((error) => {
                    console.log(error)
                })
        },
        formatLyric (lyric) {
            const arr = lyric.split('\n')
            const obj = {}
            arr.forEach((item) => {
                let keys = item.match(/\d{1}:\d{2}/g)
                let value = item.replace(/\[\d{2}:\d{2}\.\d{2}\]/g, '')
                if (keys) {
                    keys.forEach((ele) => {
                        obj[ele] = value
                    })
                }
            })
            this.lyric = obj
            console.log(this.lyric)
        },
        scanLyric () {
            const sentance = this.lyric[this.computedCurrentTime]
            if (!sentance) return
            this.lyricShow = sentance
        }
    }
}
</script>

