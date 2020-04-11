12 points, 36 items in array

ground.userData.physicsBody.setCenterOfMassTransform(0)


tr = ground.userData.physicsBody.getWorldTransform()
tr.setRotation(new Ammo.btVector3(0.2,0.34,0.5))
ground.userData.physicsBody.setWorldTransform(tr)

new Ammo.btTransform(new Ammo.btQuaternion(new Ammo.btVector3(0,1,0), new Ammo.btRadians(60)), new Ammo.btVector3(0.0,0.5,0))

transform = T(btQuaternion(btVector3(0,1,0),btRadians(60)),btVector3(0.0,0.5,0));


alt physics engines:
- physijs
- cannon
- oimo
- 
