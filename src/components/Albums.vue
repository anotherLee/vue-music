<style scoped>
    .albums{
        position:relative;
        height: 20vh;
        background-color: rgba(255, 255, 255, 0.3);
    }
    .container {
        width: 90%;
        overflow:hidden;
        margin: 0 auto;
    }
    .iconfont{
        position: absolute;
        top:50%;
        font-size:8vh;;
        color: red;
        cursor:pointer;
    }
    .icon-gengduo, .icon-fanhui{
        transform:translateY(-55%);
    }
    .icon-fanhui{
        left: 1.5vh;
    }
    .icon-gengduo{
        right: 1vh;
    }

    .albumsWrapper {
        display:flex;
        transition: all 0.5s linear;
    }
    .albumsWrapper li{
        width: 28vh;
        margin:0 2vh;
        cursor:pointer;
    }
    .albumsWrapper li img{
        width: 28vh;
        height: 20vh;
        vertical-align: top;
    }
</style>

<template>
    <div class="albums">
        <i class="iconfont icon-gengduo" @click="moveAlbums(-1)"></i>
        <i class="iconfont icon-fanhui" @click="moveAlbums(1)"></i>
        <div class="container" ref="container">
            <ul class="albumsWrapper" :style="offsetDistance" v-if="albums">
                <li v-for="album in albums" :key="album.channel_id" ref="album" @click="selectAlbum(album.channel_id)">
                    <img :src="album.cover_middle" :alt="album.name">
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
export default {
    data () {
        return {
            albums: null, /* 数据 */
            containerWidth: null,
            albumDom: null,
            total: null, /* li的总数 */
            liOuterWidth: null, /* 每个li（包括margin）宽度 */
            offset: 0, /* 一次增加或减少的偏移量，算出来的 */
            allOffset: 0,
            minDistance: 0
        }
    },
    computed: {
        offsetDistance () {
            if (this.allOffset >= 0) {
                this.allOffset = 0
            } else if (this.allOffset <= this.minDistance) {
                this.allOffset = this.minDistance
            }
            return { transform: `translate3d(${this.allOffset}px, 0, 0)` }
        }
    },
    created () {
        this.$http.get('https://jirenguapi.applinzi.com/fm/getChannels.php')
            .then((response) => {
                this.albums = response.data.channels
                console.log(this.albums)
            }).catch((error) => {
                console.log(error)
            })
    },
    methods: {
        init () {
            this.containerWidth = this.$refs.container.offsetWidth
            this.albumDom = this.$refs.album[0]
            this.total = this.$refs.album.length
            this.liOuterWidth = Math.round(this.albumDom.offsetWidth + parseFloat(window.getComputedStyle(this.albumDom).marginRight) * 2)
            this.offset = this.liOuterWidth * Math.floor(this.containerWidth / this.liOuterWidth)
            const count = this.liOuterWidth * this.total / this.offset
            this.minDistance = count % 1 === 0
                ? (count - 1) * -this.offset
                : Math.floor(count) * -this.offset
        },
        moveAlbums (direction) {
            this.init()
            this.allOffset += direction * this.offset
        },
        selectAlbum (id) {
            this.$emit('select-album', id)
        }
    }
}
</script>
