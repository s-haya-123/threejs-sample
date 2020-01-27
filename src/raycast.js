// import * as THREE from "three";
// ページの読み込みを待つ
      window.addEventListener('load', init);

      function init() {
        // サイズを指定
        const width = window.innerWidth;
        const height = window.innerHeight;

        // マウス座標管理用のベクトルを作成
        const mouse = new THREE.Vector2();

        // canvas 要素の参照を取得する
        const canvas = document.querySelector('#myCanvas');

        // レンダラーを作成
        const renderer = new THREE.WebGLRenderer({
          canvas: canvas
        });
        renderer.setPixelRatio(window.devicePixelRatio);
        renderer.setSize(width, height);
        let onRenderFcts = [];

        let scene = new THREE.Scene();
        // let camera = new THREE.PerspectiveCamera(
        //   60,
        //   document.body.offsetWidth / document.body.offset,
        //   1,
        //   10
        // );
        
        // const camera = new THREE.PerspectiveCamera(45, document.body.offsetWidth / document.body.offset);
        const camera = new THREE.PerspectiveCamera(45, width / height);

        // camera.position.set(0, 0, +1000);
        camera.position.z = 3;
        scene.add(camera);
        const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        light.position.set(0, 1, 0);
        scene.add(light);

        const geometry = new THREE.CubeGeometry(1, 1, 0.1);
        const material = new THREE.MeshNormalMaterial();
        const mesh = new THREE.Mesh(geometry, material);
        camera.visible = true;
        scene.visible = camera.visible;

        // const meshList = [];
        // for (let i = 0; i < 200; i++) {
        //   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        //   const mesh = new THREE.Mesh(geometry, material);
        //   mesh.position.x = (Math.random() - 0.5) * 800;
        //   mesh.position.y = (Math.random() - 0.5) * 800;
        //   mesh.position.z = (Math.random() - 0.5) * 800;
        //   mesh.rotation.x = Math.random() * 2 * Math.PI;
        //   mesh.rotation.y = Math.random() * 2 * Math.PI;
        //   mesh.rotation.z = Math.random() * 2 * Math.PI;
        //   scene.add(mesh);

        //   // 配列に保存
        //   meshList.push(mesh);
        // }
        
        mesh.position.set(0,0,0);
        mesh2.position.set(0,0,0);
        scene.add( mesh );
        scene.add( mesh2 );
        const raycaster = new THREE.Raycaster();
        mouse.x = 0;
        mouse.y = 0;
        onRenderFcts.push(function() {
          raycaster.setFromCamera( mouse, camera );
        
          // calculate objects intersecting the picking ray
          const intersects = raycaster.intersectObjects( scene.children );
            for ( let i = 0; i < intersects.length; i++ ) {

                // intersects[ i ].object.material.color && intersects[ i ].object.material.color.setHex(0xff0000)
                intersects[ i ].object.rotation.x += 0.1
                intersects[ i ].object.rotation.y += 0.1
        
            }
          renderer.render(scene, camera);
        });
        onRenderFcts.push(()=>{
            // console.log('-');
            mesh.position.x -= 0.01;
            mesh.position.y -= 0.01;
            mesh.position.z -= 0.01;
        })
        
        let lastTimeMsec = null;
        requestAnimationFrame(function animate(nowMsec) {
          requestAnimationFrame(animate);
          lastTimeMsec = lastTimeMsec || nowMsec - 1000 / 60;
          let deltaMsec = Math.min(200, nowMsec - lastTimeMsec);
          lastTimeMsec = nowMsec;
          onRenderFcts.forEach(onRenderFct => {
            onRenderFct(deltaMsec / 10000, nowMsec / 10000);
          });
        });
        canvas.addEventListener('mousemove', handleMouseMove);

        // マウスを動かしたときのイベント
        function handleMouseMove(event) {
          const element = event.currentTarget;
          // canvas要素上のXY座標
          const x = event.clientX - element.offsetLeft;
          const y = event.clientY - element.offsetTop;
          // canvas要素の幅・高さ
          const w = element.offsetWidth;
          const h = element.offsetHeight;

          // -1〜+1の範囲で現在のマウス座標を登録する
          mouse.x = (x / w) * 2 - 1;
          mouse.y = -(y / h) * 2 + 1;
        }
        
        // // シーンを作成
        // const scene = new THREE.Scene();

        // // カメラを作成
        // const camera = new THREE.PerspectiveCamera(45, width / height);
        // camera.position.set(0, 0, +1000);

        // const geometry = new THREE.BoxBufferGeometry(50, 50, 50);

        // // マウスとの交差を調べたいものは配列に格納する
        // const meshList = [];
        // for (let i = 0; i < 200; i++) {
        //   const material = new THREE.MeshStandardMaterial({ color: 0xffffff });

        //   const mesh = new THREE.Mesh(geometry, material);
        //   mesh.position.x = (Math.random() - 0.5) * 800;
        //   mesh.position.y = (Math.random() - 0.5) * 800;
        //   mesh.position.z = (Math.random() - 0.5) * 800;
        //   mesh.rotation.x = Math.random() * 2 * Math.PI;
        //   mesh.rotation.y = Math.random() * 2 * Math.PI;
        //   mesh.rotation.z = Math.random() * 2 * Math.PI;
        //   scene.add(mesh);

        //   // 配列に保存
        //   meshList.push(mesh);
        // }

        // // 平行光源
        // const directionalLight = new THREE.DirectionalLight(0xffffff);
        // directionalLight.position.set(1, 1, 1);
        // scene.add(directionalLight);

        // // 環境光源
        // const ambientLight = new THREE.AmbientLight(0x333333);
        // scene.add(ambientLight);

        // // レイキャストを作成
        // const raycaster = new THREE.Raycaster();

        // canvas.addEventListener('mousemove', handleMouseMove);
        // tick();

        // // マウスを動かしたときのイベント
        // function handleMouseMove(event) {
        //   const element = event.currentTarget;
        //   // canvas要素上のXY座標
        //   const x = event.clientX - element.offsetLeft;
        //   const y = event.clientY - element.offsetTop;
        //   // canvas要素の幅・高さ
        //   const w = element.offsetWidth;
        //   const h = element.offsetHeight;

        //   // -1〜+1の範囲で現在のマウス座標を登録する
        //   mouse.x = (x / w) * 2 - 1;
        //   mouse.y = -(y / h) * 2 + 1;
        // }

        // // 毎フレーム時に実行されるループイベントです
        // function tick() {
        //   // レイキャスト = マウス位置からまっすぐに伸びる光線ベクトルを生成
        //   raycaster.setFromCamera(mouse, camera);

        //   // その光線とぶつかったオブジェクトを得る
        //   const intersects = raycaster.intersectObjects(meshList);

        //   meshList.map(mesh => {
        //     // 交差しているオブジェクトが1つ以上存在し、
        //     // 交差しているオブジェクトの1番目(最前面)のものだったら
        //     if (intersects.length > 0 && mesh === intersects[0].object) {
        //       // 色を赤くする
        //       mesh.material.color.setHex(0xff0000);
        //     } else {
        //       // それ以外は元の色にする
        //       mesh.material.color.setHex(0xffffff);
        //     }
        //   });

        //   // レンダリング
        //   renderer.render(scene, camera);
        //   requestAnimationFrame(tick);
        // }
      }