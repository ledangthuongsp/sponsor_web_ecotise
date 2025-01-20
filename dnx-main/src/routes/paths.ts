export const rootPaths = {
  root: '/',
  pageRoot: 'pages',
  authRoot: 'authentication',
  errorRoot: 'error',
};

export default {
  landing: `${rootPaths.root}`, // Landing page as root
  dashboard: `/${rootPaths.pageRoot}/dashboard`,
  task: `/${rootPaths.pageRoot}/task`,
  settings: `/${rootPaths.pageRoot}/settings`,
};
