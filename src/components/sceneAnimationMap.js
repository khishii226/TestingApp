// src/utils/sceneAnimationMap.js

export const sceneAnimationMap = {
  house: ['Body.003Action', 'Body.004Action', 'CatAction'],
  office: ['OfficeWaving','Car.007Action','Car008Action'],
  garden: ['LeavesSwaying', 'tree.017Action', 'CatAction.002'],
  beach: [
    'Beach Ball.001Action',
    'Beach Ball.005Action',
    'CircleAction',
    'Circle.008Action',
  ],
};

export function isRelevantToScene(actionName, sceneName) {
  return sceneAnimationMap[sceneName]?.includes(actionName);
}
