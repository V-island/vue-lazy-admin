import { storage } from 'utils/browserStorage';
import { KEY_PERMISSIONS, KEY_USER_INFO } from 'config';

export function permission(data) {
  let permissions = storage.get(KEY_PERMISSIONS);
  if (!permissions) {
    return false;
  }
  let isHave = permissions.includes(data);
  return isHave;
}

export function rolePermission(data) {
  let userInfo = storage.get(KEY_USER_INFO);
  if (!userInfo) {
    return false;
  }
  let role = userInfo.role;
  if (!role) {
    return false;
  }
  let isHave = role.includes(data);
  return isHave;
}
