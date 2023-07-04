import { getDocumentTitle } from 'utils';
import { KEY_TOKEN, ACCESS_WHITE_LIST } from 'config';
import { storage } from 'utils/browserStorage';

export async function beforeHook(to, from, next) {
  document.title = getDocumentTitle(to.meta.title);

  // 访问白名单页面时
  if (ACCESS_WHITE_LIST.includes(to.name))
    return next();

  const token = storage.get(KEY_TOKEN);

  if (token === undefined || token === "") {
    next('/login');
  } else {
    next();
  }
}

export function afterHook() {
}
