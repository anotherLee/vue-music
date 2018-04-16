<style>
html, body{
    height:100%;
    overflow: hidden;
}
.wrapper {
    position: relative;
    height: 100vh;
}
.wrapper:after{
    content: '';
    position: absolute;
    top:0; bottom:0; left:0; right:0;
    background-color: rgba(0,0,0,0.2);
    z-index:-1;
}
.blurBg{
    position: absolute;
    top: -10px; bottom: -10px; left: -10px; right: -10px;
    z-index: -2;
    -webkit-filter: blur(4px);
    filter: blur(4px);
}
</style>

<template>
  <div class="app">
        <div class="wrapper">
            <div class="blurBg" :style="bg" v-if="songInfo"></div>
            <Music :innerSong = "songInfo" @next="getSong(channelId)"></Music>
            <Albums @select-album="select"></Albums>
        </div>
  </div>
</template>

<script>
import Albums from './components/Albums'
import Music from './components/Music'
const exception = {
    sid: 13844864,
    artist: 'Carly Rae Jepsen',
    picture: 'http://qukufile2.qianqian.com/data2/pic/89114250/89114250.jpg@s_0,w_300',
    title: 'Call Me Maybe',
    url: 'http://zhangmenshiting.qianqian.com/data2/music/d9f57b791f521e46cb0f8cff3c0364a4/42059027/42059027.mp3?xcode=22be5e3bac4950bbf4316fffb8ff8771'
}

export default {
    data () {
        return {
            songInfo: null,
            channelId: 'public_fengge_liuxing'
        }
    },
    computed: {
        bg () {
            return {
                backgroundImage: `url(${this.songInfo.picture})`,
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover'
            }
        }
    },
    created () {
        this.getSong(this.channelId)
    },
    methods: {
        getSong (channel) {
            this.$http.get('https://jirenguapi.applinzi.com/fm/getSong.php', {
                params: { channel: channel }
            })
                .then(response => {
                    // this.songInfo = response.data.song[0]
                    const result = response.data.song[0]
                    this.songInfo = result.url ? result : exception
                    console.log('result', result)
                    console.log('exception', exception)
                    console.log('songInfo', this.songInfo)
                })
                .catch(error => {
                    console.log(error)
                })
        },
        select (dataId) {
            this.channelId = dataId
            this.getSong(this.channelId)
        }
    },
    components: {
        Albums,
        Music
    }
}
</script>


