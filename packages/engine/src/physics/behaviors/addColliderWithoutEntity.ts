import { Body, Box, Sphere, Cylinder, Plane, Vec3 } from 'cannon-es';
import { PhysicsSystem } from '../systems/PhysicsSystem';
import { CollisionGroups } from "../enums/CollisionGroups";
import { threeToCannon } from '../classes/three-to-cannon';

export function createTrimesh (mesh) {
		const shape = threeToCannon(mesh, {type: threeToCannon.Type.MESH});
		const body = new Body({ mass: 0 });
    body.addShape(shape);
		return body;
}

function createBox (scale) {
  if(scale == undefined) return console.error("Scale is  null");
  const shape = new Box(new Vec3(Math.abs(scale.x), Math.abs(scale.y), Math.abs(scale.z)));
  const body = new Body({ mass: 0 });
  body.addShape(shape);
  return body;
}

function createSphere (scale) {
  const shape = new Sphere(Math.abs(scale.x));
  const body = new Body({ mass: 0 });
  body.addShape(shape);
  return body;
}

export function createGround () {
  const shape = new Plane();
  const body = new Body({ mass: 0 });
  body.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), -Math.PI / 2);
  body.addShape(shape);
  return body;
}

export function createCylinder (scale) {
  if(scale == undefined) return console.error("Scale is  null");
  const shape = new Cylinder(scale.x, scale.z, scale.y*2, 10);
  const body = new Body({ mass: 0 });
  body.addShape(shape);
  return body;
}

export function addColliderWithoutEntity( type, position, quaternion, scale, mesh ) {
  let body;

  switch (type) {
    case 'box':
      body = createBox(scale);
      /*
      body.shapes.forEach((shape) => {
  			shape.collisionFilterMask = ~CollisionGroups.TrimeshColliders;
  		});
      */
      break;

    case 'ground':
      body = createGround()
      break;

    case 'cylinder':
      body = createCylinder(scale);
      break;

    case 'sphere':
      body = createSphere(scale);
      break;

    case 'trimesh':
      body = createTrimesh(mesh);
      break;

    default:
      console.warn('create Collider undefined type !!!');
      body = createBox(scale || {x:1, y:1, z:1});
      break;
    }

    if (position)
      body.position.set(
        position.x,
        position.y,
        position.z
      );

    if (quaternion)
      body.quaternion.set(
        quaternion.x,
        quaternion.y,
        quaternion.z,
        quaternion.w
      );


      body.collisionFilterGroup = CollisionGroups.Default;
  //    body.collisionFilterMask = CollisionGroups.Scene | CollisionGroups.Default | CollisionGroups.Characters | CollisionGroups.Car | CollisionGroups.TrimeshColliders;

  PhysicsSystem.physicsWorld.addBody(body);
  return body;
}
