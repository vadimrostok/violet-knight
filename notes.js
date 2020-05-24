function actOnAgent(deltaTime) {
  const {
    forward, backward, leftward, rightward,
  } = controlEventsHandlerInstance.cameraBallJointMovementFlags;

  if (forward || backward) {
    const v = new Vector3(0, (forward ? 1 : -1) * 100 * deltaTime, 0);
    v.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().position.add(v);
    getCameraBallJoint().position.copy(getAgent().position);

    const motionState = getAgent().userData.physicsBody.getMotionState();
    const { x, y, z } = getAgent().position;

    if (motionState) {
      transformAux.setIdentity();
      transformAux.setOrigin( new window.Ammo.btVector3( x, y, z ) );
      motionState.setWorldTransform( transformAux );
      getAgent().userData.physicsBody.setMotionState(motionState);
    }
  }

  if (leftward || rightward) {
    const v = new Vector3(0, 0, (leftward ? 1 : -1) * 100 * deltaTime);
    v.applyQuaternion(cameraBallJointRotationQuaternion);
    getAgent().position.add(v);
    getCameraBallJoint().position.copy(getAgent().position);

    const motionState = getAgent().userData.physicsBody.getMotionState();
    const { x, y, z } = getAgent().position;

    if (motionState) {
      transformAux.setIdentity();
      transformAux.setOrigin( new window.Ammo.btVector3( x, y, z ) );
      getAgent().userData.physicsBody.setWorldTransform( transformAux );
    }
  }
}
