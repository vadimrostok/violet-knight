window.cubeRotation = window.cubeRotation ? window.cubeRotation + 1*deltaTime : 0.01;
    //window.cubeVRotation = window.cubeVRotation ? window.cubeVRotation + 0.4*deltaTime : 0.01;
    if (moveUp) {
      window.cubeVRotation += 0.4*deltaTime;
    }
    //window.cubeVRotation = 0;//Math.PI/2;
    //window.cube.rotation.set(window.cubeRotation, Math.PI/2,0);
    //window.cube.quaternion.setFromAxisAngle(new THREE.Vector3(0,1,0), window.cubeRotation);

    //console.log(150*Math.cos(window.cubeVRotation), 150*Math.sin(window.cubeVRotation));
    // azimuthal rotation

    window.azimuthalRotation.makeRotationAxis(new THREE.Vector3(0,1,0), -window.cubeRotation + Math.PI/2);
    window.polarRotation.makeRotationAxis(new THREE.Vector3(1,0,0), -window.cubeVRotation);

    window.azimuthalRotation.multiply(window.polarRotation);
    //window.camera.quaternion.setFromRotationMatrix(window.azimuthalRotation);
    window.camera.lookAt(0,0,0);

    // window.camera.position.set(
    //   150*Math.cos(window.cubeRotation),//*Math.cos(window.cubeVRotation),// + 150*Math.sin(window.cubeVRotation),
    //   0,
    //   150*Math.sin(window.cubeRotation),
    // );
    window.camera.position.set(
      150*Math.cos(window.cubeRotation)*Math.cos(window.cubeVRotation),//+ 150*Math.sin(window.cubeVRotation),
      150*Math.sin(window.cubeVRotation)*Math.cos(window.cubeRotation),
      150*Math.sin(window.cubeRotation),
    );


    // polar rotation:
    //console.log(Math.sin(window.cubeRotation));
    //window.group.rotation.set(window.cubeRotation,0,0);
    // window.camera.position.set(
    //   150*Math.sin(window.cubeVRotation),// - 150*Math.cos(window.cubeRotation),
    //   150*Math.cos(window.cubeVRotation),
    //   0,//150*Math.sin(window.cubeRotation),
    // );
    //window.camera.up.y = Math.sin(window.cubeVRotation) > 0 ? 1 : -1;

    //window.camera.quaternion.multiply( quaternion([1, 0, 0], window.cubeRotation) );
    //window.camera.rotation.set(Math.cos(window.cubeRotation), 0, Math.sin(window.cubeRotation));

    // window.camera.rotation.set(
    //   Math.sin(window.cubeVRotation),
    //   -window.cubeRotation + Math.PI/2,
    //   Math.cos(window.cubeVRotation)
    // );

    //window.camera.rotation.set(Math.sin(window.cubeRotation), 0, Math.cos(window.cubeRotation));
