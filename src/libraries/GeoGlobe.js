import * as THREE from 'three'
import * as TWEEN from 'three-tween'

export default class {

    /**
     * @type {number}
     */
    sceneWidth;

    /**
     * @type {number}
     */
    sceneHeight;

    /**
     * @type {number}
     */
    radius;

    /**
     * @type {string}
     */
    texturePath;

    /**
     * @type {Scene}
     */
    scene;

    /**
     * @type {Camera}
     */
    camera;

    /**
     * @type {WebGLRenderer}
     */
    renderer;

    /**
     * @type {Mesh}
     */
    sphere;

    /**
     * @type {boolean}
     */
    isAnimating = false;

    /**
     * @param sceneWidth {number}
     * @param sceneHeight {number}
     * @param radius {number}
     * @param texturePath {string}
     */
    constructor({sceneWidth = 500, sceneHeight = 500, radius = 1, texturePath})
    {
        this.sceneWidth = sceneWidth;
        this.sceneHeight = sceneHeight;
        this.radius = radius;
        this.texturePath = texturePath;
    }

    /**
     * @returns {HTMLCanvasElement}
     */
    build = () =>
    {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, this.sceneWidth / this.sceneHeight, 0.1, 1000);
        this.camera.position.setZ(3);
        this.renderer = new THREE.WebGLRenderer({alpha: true});
        this.renderer.setSize(this.sceneWidth, this.sceneHeight);
        this.renderer.setClearColor(0xffffff, 0);

        let texture = new THREE.TextureLoader().load(this.texturePath);
        let material = new THREE.MeshBasicMaterial({map: texture});

        let geometry = new THREE.SphereGeometry(this.radius, 80, 80);
        this.sphere = new THREE.Mesh(geometry, material);
        this.sphere.rotation.x = 0.4;
        this.scene.add(this.sphere);

        this.camera.lookAt(this.sphere.position.x, this.sphere.position.y, this.sphere.position.z);

        this.animate();
        return this.renderer.domElement;
    }

    /**
     * @param latitude {number}
     * @param longitude {number}
     * @returns {void}
     */
    placeMarker = (latitude, longitude) =>
    {
        let coords = this.coordsFromLongAndLat(latitude, longitude);
        let zoomCoords = this.sphere.localToWorld(new THREE.Vector3(coords.x, coords.y, coords.z));

        this.cameraZoomOn({
            coords: zoomCoords,
            currentLookAt: {
                x: this.sphere.position.x,
                y: this.sphere.position.y,
                z: this.sphere.position.z
            }
        });

        let material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        let geometry = new THREE.SphereGeometry(this.radius / 30, 14, 14);
        let marker = new THREE.Mesh(geometry, material);

        this.sphere.add(marker);
        marker.position.set(coords.x, coords.y, coords.z);
    }

    /**
     * @param coords {object}
     * @param currentLookAt {object}
     */
    cameraZoomOn = ({coords, currentLookAt}) => {
        let from = {
            position: {
                x: this.camera.position.x,
                y: this.camera.position.y,
                z: this.camera.position.z
            },
            lookAt: {
                x: currentLookAt.x || this.sphere.position.x,
                y: currentLookAt.y || this.sphere.position.y,
                z: currentLookAt.z || this.sphere.position.z
            }
        };

        let to = {
            position: {
                x: coords.x + 0.1,
                y: coords.y + 0.1,
                z: coords.z + 0.5,
            },
            lookAt: {
                x: coords.x,
                y: coords.y,
                z: coords.z
            }
        };

        this.isAnimating = true;
        const camera = this.camera;

        new TWEEN.Tween(from.lookAt)
            .to(to.lookAt, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                camera.lookAt(this.x, this.y, this.z);
            })
            .start();

        new TWEEN.Tween(from.position)
            .to(to.position, 2000)
            .easing(TWEEN.Easing.Quadratic.InOut)
            .onUpdate(function () {
                camera.position.set(this.x, this.y, this.z);
            })
            .start();
    }

    /**
     * @param latitude {number}
     * @param longitude {number}
     * @returns {{x: number, z: number, y: number}}
     */
    coordsFromLongAndLat = (latitude, longitude) =>
    {
        // see https://unitycoder.com/blog/2016/03/01/latitude-longitude-position-on-3d-sphere-v2/
        latitude = (Math.PI * latitude / 180) - (90 * (Math.PI / 180));
        longitude = Math.PI * longitude / 180;

        return {
            x: this.radius * Math.sin(latitude) * Math.cos(longitude),
            z: this.radius * Math.sin(latitude) * Math.sin(longitude),
            y: this.radius * Math.cos(latitude)
        };
    }

    /**
     * @returns {void}
     */
    animate = () =>
    {
        requestAnimationFrame(this.animate);
        if (this.sphere && this.isAnimating === false) {
            this.sphere.rotation.y += 0.002
        }
        TWEEN.update();
        this.renderer.render(this.scene, this.camera);
    }
}
