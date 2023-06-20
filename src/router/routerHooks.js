import { getDocumentTitle } from 'utils';

export async function beforeHook(to, from, next) {
  document.title = getDocumentTitle(to.meta.title);
  next();
}

export function afterHook() {
}
