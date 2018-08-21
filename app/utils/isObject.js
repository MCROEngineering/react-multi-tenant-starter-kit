export default function isObject(obj) {
  return obj !== null && obj !== undefined && Object.prototype.toString.call(obj) === '[object Object]';
}
