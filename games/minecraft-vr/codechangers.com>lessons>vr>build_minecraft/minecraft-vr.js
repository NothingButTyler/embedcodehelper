
<html>
<head>
    <script src="https://aframe.io/releases/0.9.0/aframe.min.js"></script>
</head>
<body>
    <a-scene>


    </a-scene>
</body>
</html>

<a-cylinder id="ground" src="https://cdn.aframe.io/a-painter/images/floor.jpg"
radius="32" height="0.1"></a-cylinder>

<a-sky id="background" src="https://cdn.aframe.io/a-painter/images/sky.jpg"
theta-length="90" radius="30"></a-sky>

<a-assets>
    <a-mixin id="voxel"
        geometry="primitive: box; height: 0.5; width: 0.5; depth: 0.5"
        material="shader: standard"
        random-color
        snap="offset: 0.25 0.25 0.25; snap: 0.5 0.5 0.5">
    </a-mixin>
</a-assets>
<a-entity mixin="voxel" position="0 0 -2"></a-entity>

<script>
    AFRAME.registerComponent('random-color', {
    dependencies: ['material'],

    init: function () {
        // Set material component's color property to a random color.
        this.el.setAttribute('material', 'color', getRandomColor());
    }
    });

    function getRandomColor() {
    const letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++ ) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
    }
</script>

<script>
    AFRAME.registerComponent('snap', {
    dependencies: ['position'],

    schema: {
        offset: {type: 'vec3'},
        snap: {type: 'vec3'}
    },

    init: function () {
        this.originalPos = this.el.getAttribute('position');
    },

    update: function () {
        const data = this.data;

        const pos = AFRAME.utils.clone(this.originalPos);
        pos.x = Math.floor(pos.x / data.snap.x) * data.snap.x + data.offset.x;
        pos.y = Math.floor(pos.y / data.snap.y) * data.snap.y + data.offset.y;
        pos.z = Math.floor(pos.z / data.snap.z) * data.snap.z + data.offset.z;

        this.el.setAttribute('position', pos);
    }
    });
</script>

<a-camera>
    <a-cursor intersection-spawn="event: click; mixin: voxel"></a-cursor>
</a-camera>

<script>
    AFRAME.registerComponent('intersection-spawn', {
    schema: {
        default: '',
        parse: AFRAME.utils.styleParser.parse
    },

    init: function () {
        const data = this.data;
        const el = this.el;

        el.addEventListener(data.event, evt => {
        // Create element.
        const spawnEl = document.createElement('a-entity');

        // Snap intersection point to grid and offset from center.
        spawnEl.setAttribute('position', evt.detail.intersection.point);

        // Set components and properties.
        Object.keys(data).forEach(name => {
            if (name === 'event') { return; }
            AFRAME.utils.entity.setComponentProperty(spawnEl, name, data[name]);
        });

        // Append to scene.
        el.sceneEl.appendChild(spawnEl);
        });
    }
    });
</script>
