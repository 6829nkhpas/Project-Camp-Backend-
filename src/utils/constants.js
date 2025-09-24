
const userRolesEnum ={
    ADMIN: 'admin',
    PROJECT_ADMIN: 'project_admin',
    MEMBER: 'member',

}
const userRolesValues = Object.values(userRolesEnum);

export {userRolesEnum, userRolesValues};

const taskStatusEnum = {  
    TODO: 'todo',
    IN_PROGRESS: 'in_progress',
    DONE: 'done',
    BLOCKED: 'blocked',
}
const taskStatusValues = Object.values(taskStatusEnum);

export {taskStatusEnum, taskStatusValues};