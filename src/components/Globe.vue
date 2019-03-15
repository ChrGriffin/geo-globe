<template>
    <div ref="renderWrapper"></div>
</template>

<script>
    import GeoGlobe from '../libraries/GeoGlobe'

    export default {
        name: 'Globe',
        data: function () {
            return {
                geoGlobe: null
            }
        },
        mounted: function () {

            this.geoGlobe = new GeoGlobe({
                texturePath: '/assets/textures/earth.jpg',
                radius: 1,
                sceneWidth: window.innerWidth,
                sceneHeight: window.innerHeight
            });

            this.$refs.renderWrapper.innerHTML = '';
            this.$refs.renderWrapper.appendChild(this.geoGlobe.build());

            setTimeout(() => {
                this.geoGlobe.placeMarker(43.512389, -80.528715);
            }, 1000);
        }
    }
</script>

<style scoped>
</style>
