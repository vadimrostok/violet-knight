
// FIXME
// importScripts('/lib/ammo.2.js'); 

console.log('worker init');
this.onmessage = function (e) {
  console.log('onmessage', e);
  switch(e.data.task) {
  case 'init':
    console.log('init!');
  }
};
