import service from '@/utils/request'

// login
export const login = (params) => { return service.post('/login', params) }
export const getPermissionsByUser = () => { return service.get('/getRouters') }
export const getUserInfo = () => { return service.get('/getInfo') }

// menu
export const getMenuList = () => { return service.get('/system/menu/list') }
export const getMenuTreeList = () => { return service.get('/system/menu/treeselect') }
export const delMenu = (menuId) => { return service.delete('/system/menu/' + menuId) }
export const addMenu = (menu) => { return service.post('/system/menu', menu) }
export const updateMenu = (menu) => { return service.put('/system/menu', menu) }

// user
export const getUserList = (params) => { return service.get('/system/user/list', { params: params }) }
export const getUserById = (userId) => { return service.get('/system/user/' + userId) }
export const delUser = (ids) => { return service.delete('/system/user/' + ids) }
export const addUser = (user) => { return service.post('/system/user', user) }
export const updateUser = (user) => { return service.put('/system/user', user) }
export const resetPwd = (user) => { return service.put('/system/user/resetPwd', user) }

// role
export const getRoleList = (params) => { return service.get('/system/role/list', { params: params }) }
export const getRoleSelectOptions = () => { return service.get('/system/role/optionselect') }
export const addRole = (role) => { return service.post('/system/role', role) }
export const updateRole = (role) => { return service.put('/system/role', role) }
export const getRole = (roleId) => { return service.get('/system/role/' + roleId) }
export const getRoleMenuTreeselect = (roleId) => { return service.get('/system/menu/roleMenuTreeselect/' + roleId) }
export const delRole = (ids) => { return service.delete('/system/role/' + ids) }

// dept 部门
export const getDeptTreeList = () => { return service.get('/system/dept/treeselect') }

// sql 执行
export const executeSQL = (data) => { return service.post('/system/sql/executeSql', data) }
export const getLayout = (data) => { return service.post('/system/sql/getLayout', data) }
