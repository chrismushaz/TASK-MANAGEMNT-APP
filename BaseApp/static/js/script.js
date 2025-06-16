
let currentUser = null;
let taskId = 1;
let teamId = 1;
let teams = [];
let tasks = [];

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const teamForm = document.getElementById('team-form');
const inviteForm = document.getElementById('invite-form');
const taskForm = document.getElementById('task-form');
const teamList = document.getElementById('team-list');
const todoList = document.getElementById('todo-list');
const inprogressList = document.getElementById('inprogress-list');
const doneList = document.getElementById('done-list');
const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
const commentForm = document.getElementById('comment-form');
const attachmentForm = document.getElementById('attachment-form');

/*document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('app-container').style.display = 'block';
});*/


document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    loadSampleData();
});

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    teamForm.addEventListener('submit', handleTeamCreation);
    inviteForm.addEventListener('submit', handleMemberInvitation);

    taskForm.addEventListener('submit', handleTaskCreation);
    document.addEventListener('click', handleTaskActions);
    
    commentForm.addEventListener('submit', handleCommentSubmit);
    attachmentForm.addEventListener('submit', handleAttachmentSubmit);
}

function loadSampleData() {
    teams = [
        { id: 1, name: 'Development Team', members: ['john@example.com', 'jane@example.com'], tasks: [] },
        { id: 2, name: 'Design Team', members: ['alice@example.com'], tasks: [] }
    ];
    
    tasks = [
        { 
            id: 1, 
            title: 'Implement user authentication', 
            description: 'Create login and registration pages with validation', 
            priority: 'high', 
            status: 'todo', 
            assignee: 'john@example.com', 
            teamId: 1,
            comments: [],
            attachments: [],
            createdAt: new Date()
        },
        { 
            id: 2, 
            title: 'Design dashboard UI', 
            description: 'Create mockups for the team dashboard', 
            priority: 'medium', 
            status: 'inprogress', 
            assignee: 'alice@example.com', 
            teamId: 2,
            comments: [
                { author: 'alice@example.com', text: 'Working on the color scheme', createdAt: new Date() }
            ],
            attachments: [],
            createdAt: new Date()
        }
    ];
    
    updateTeamList();
    renderTasks();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    currentUser = {
        email: email,
        name: email.split('@')[0]
    };
    
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    
    loginForm.reset();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    currentUser = {
        email: email,
        name: name
    };
    
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    
    registerForm.reset();
    document.getElementById('login-tab').click();
}

function handleLogout() {
    currentUser = null;
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
}

function handleTeamCreation(e) {
    e.preventDefault();
    const teamName = document.getElementById('team-name').value;
    
    const newTeam = {
        id: teamId++,
        name: teamName,
        members: [currentUser.email],
        tasks: []
    };
    
    teams.push(newTeam);
    updateTeamList();
    teamForm.reset();
}

function handleMemberInvitation(e) {
    e.preventDefault();
    const memberEmail = document.getElementById('invite-email').value;
    const teamId = parseInt(document.getElementById('invite-team').value);
    
    if (teamId && memberEmail) {
        const team = teams.find(t => t.id === teamId);
        if (team && !team.members.includes(memberEmail)) {
            team.members.push(memberEmail);
            updateTeamList();
            inviteForm.reset();
        }
    }
}

function updateTeamList() {
    const teamSelects = [
        document.getElementById('invite-team'),
        document.getElementById('task-team')
    ];
    
    teamSelects.forEach(select => {
        select.innerHTML = '<option value="">Select a team</option>';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            select.appendChild(option);
        });
    });
    
    teamList.innerHTML = '';
    teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                <strong>${team.name}</strong>
                <div class="text-muted small">Members: ${team.members.join(', ')}</div>
            </div>
            <span class="badge bg-primary rounded-pill">${team.tasks.length} tasks</span>
        `;
        teamList.appendChild(listItem);
    });
}

function handleTaskCreation(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const assignee = document.getElementById('task-assignee').value;
    const teamId = parseInt(document.getElementById('task-team').value);
    
    const newTask = {
        id: taskId++,
        title: title,
        description: desc,
        priority: priority,
        status: 'todo',
        assignee: assignee,
        teamId: teamId,
        comments: [],
        attachments: [],
        createdAt: new Date()
    };
    
    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
}

function renderTasks() {
    todoList.innerHTML = '';
    inprogressList.innerHTML = '';
    doneList.innerHTML = '';
    
    const todoTasks = tasks.filter(task => task.status === 'todo');
    const inprogressTasks = tasks.filter(task => task.status === 'inprogress');
    const doneTasks = tasks.filter(task => task.status === 'done');
    
    renderTaskList(todoTasks, todoList);
    renderTaskList(inprogressTasks, inprogressList);
    renderTaskList(doneTasks, doneList);
    
    setupDragAndDrop();
}

function renderTaskList(taskArray, listElement) {
    taskArray.forEach(task => {
        const team = teams.find(t => t.id === task.teamId);
        const teamName = team ? team.name : 'No Team';
        
        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item d-flex justify-content-between align-items-center priority-${task.priority}`;
        taskItem.setAttribute('draggable', true);
        taskItem.setAttribute('data-id', task.id);
        taskItem.innerHTML = `
            <div class="task-content" style="flex-grow: 1;">
                <strong>${task.title}</strong>
                <p class="mb-1 small text-muted">${task.description}</p>
                <div class="task-meta">
                    <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                    <span class="badge bg-secondary">${task.assignee || 'Unassigned'}</span>
                    <span class="badge bg-info">${teamName}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-outline-primary btn-sm view-btn">View</button>
                <button class="btn btn-outline-warning btn-sm edit-btn">Edit</button>
                <button class="btn btn-outline-danger btn-sm delete-btn">Delete</button>
            </div>
        `;
        listElement.appendChild(taskItem);
    });
}

function handleTaskActions(e) {
    const taskItem = e.target.closest('li');
    if (!taskItem) return;
    
    const taskId = parseInt(taskItem.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);
    
    if (e.target.classList.contains('view-btn')) {
        openTaskModal(task);
    }
    else if (e.target.classList.contains('edit-btn')) {
        editTask(task);
    }
    else if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}

function openTaskModal(task) {
    document.getElementById('taskModalTitle').textContent = task.title;
    document.getElementById('task-modal-desc').textContent = task.description;
    document.getElementById('task-modal-status').textContent = task.status;
    document.getElementById('task-modal-priority').textContent = task.priority;
    document.getElementById('task-modal-assignee').textContent = task.assignee || 'Unassigned';
    document.getElementById('task-modal-team').textContent = teams.find(t => t.id === task.teamId)?.name || 'No Team';
    document.getElementById('task-modal-created').textContent = formatDate(task.createdAt);
    
    const commentsContainer = document.getElementById('task-comments');
    commentsContainer.innerHTML = '';
    task.comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'card mb-2';
        commentElement.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between">
                    <strong>${comment.author}</strong>
                    <small class="text-muted">${formatDate(comment.createdAt)}</small>
                </div>
                <p class="mb-0">${comment.text}</p>
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });
    
    const attachmentsContainer = document.getElementById('task-attachments');
    attachmentsContainer.innerHTML = '';
    task.attachments.forEach(attachment => {
        const attachmentElement = document.createElement('div');
        attachmentElement.className = 'card mb-2';
        attachmentElement.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between align-items-center">
                    <span>${attachment.name}</span>
                    <button class="btn btn-sm btn-outline-danger">Delete</button>
                </div>
            </div>
        `;
        attachmentsContainer.appendChild(attachmentElement);
    });
    
    taskModal.show();
}

function editTask(task) {
    const newTitle = prompt('Edit task title:', task.title);
    const newDesc = prompt('Edit task description:', task.description);
    
    if (newTitle !== null) task.title = newTitle;
    if (newDesc !== null) task.description = newDesc;
    
    renderTasks();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }
}

function handleCommentSubmit(e) {
    e.preventDefault();
    const commentText = document.getElementById('comment-text').value;
    
    alert(`Comment added: ${commentText}`);
    
    commentForm.reset();
}

function handleAttachmentSubmit(e) {
    e.preventDefault();
    const fileInput = document.getElementById('attachment-file');
    
    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        alert(`File uploaded: ${fileName}`);
        
        attachmentForm.reset();
    }
}

function setupDragAndDrop() {
    const columns = document.querySelectorAll('.list-group');
    
    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const draggable = document.querySelector('.dragging');
            
            if (afterElement == null) {
                column.appendChild(draggable);
            } else {
                column.insertBefore(draggable, afterElement);
            }
        });
    });
    
    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('dragstart', () => {
            item.classList.add('dragging');
        });
        
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');
            
            const taskId = parseInt(item.getAttribute('data-id'));
            const task = tasks.find(t => t.id === taskId);
            const newStatus = item.closest('.kanban-column').querySelector('h4').textContent.toLowerCase().replace(' ', '');
            
            if (task && task.status !== newStatus) {
                task.status = newStatus;
            
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list-group-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getPriorityColor(priority) {
    const colors = {
        'high': 'danger',
        'medium': 'warning',
        'low': 'success'
    };
    return colors[priority] || 'primary';
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}
/*let currentUser = null;
let currentTaskInModal = null;
let taskId = 3;
let teamId = 3;
let teams = [];
let tasks = [];

const authContainer = document.getElementById('auth-container');
const appContainer = document.getElementById('app-container');
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const logoutBtn = document.getElementById('logout-btn');
const teamForm = document.getElementById('team-form');
const inviteForm = document.getElementById('invite-form');
const taskForm = document.getElementById('task-form');
const teamList = document.getElementById('team-list');
const todoList = document.getElementById('todo-list');
const inprogressList = document.getElementById('inprogress-list');
const doneList = document.getElementById('done-list');
const taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
const commentForm = document.getElementById('comment-form');
const attachmentForm = document.getElementById('attachment-form');

document.addEventListener('DOMContentLoaded', function () {
    setupEventListeners();
    loadSampleData();
});

function setupEventListeners() {
    loginForm.addEventListener('submit', handleLogin);
    registerForm.addEventListener('submit', handleRegister);
    logoutBtn.addEventListener('click', handleLogout);

    teamForm.addEventListener('submit', handleTeamCreation);
    inviteForm.addEventListener('submit', handleMemberInvitation);

    taskForm.addEventListener('submit', handleTaskCreation);
    document.addEventListener('click', handleTaskActions);

    commentForm.addEventListener('submit', handleCommentSubmit);
    attachmentForm.addEventListener('submit', handleAttachmentSubmit);
}

function loadSampleData() {
    teams = [
        { id: 1, name: 'Development Team', members: ['john@example.com', 'jane@example.com'], tasks: [] },
        { id: 2, name: 'Design Team', members: ['alice@example.com'], tasks: [] }
    ];

    tasks = [
        {
            id: 1,
            title: 'Implement user authentication',
            description: 'Create login and registration pages with validation',
            priority: 'high',
            status: 'todo',
            assignee: 'john@example.com',
            teamId: 1,
            comments: [],
            attachments: [],
            createdAt: new Date()
        },
        {
            id: 2,
            title: 'Design dashboard UI',
            description: 'Create mockups for the team dashboard',
            priority: 'medium',
            status: 'inprogress',
            assignee: 'alice@example.com',
            teamId: 2,
            comments: [
                { author: 'alice@example.com', text: 'Working on the color scheme', createdAt: new Date() }
            ],
            attachments: [],
            createdAt: new Date()
        }
    ];

    updateTeamList();
    renderTasks();
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    currentUser = {
        email: email,
        name: email.split('@')[0]
    };
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    loginForm.reset();
}

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    currentUser = { email, name };
    authContainer.style.display = 'none';
    appContainer.style.display = 'block';
    registerForm.reset();
    document.getElementById('login-tab').click();
}

function handleLogout() {
    currentUser = null;
    authContainer.style.display = 'block';
    appContainer.style.display = 'none';
}

function handleTeamCreation(e) {
    e.preventDefault();
    const teamName = document.getElementById('team-name').value;
    const newTeam = {
        id: teamId++,
        name: teamName,
        members: [currentUser.email],
        tasks: []
    };
    teams.push(newTeam);
    updateTeamList();
    teamForm.reset();
}

function handleMemberInvitation(e) {
    e.preventDefault();
    const memberEmail = document.getElementById('invite-email').value;
    const teamId = parseInt(document.getElementById('invite-team').value);

    const team = teams.find(t => t.id === teamId);
    if (team && !team.members.includes(memberEmail)) {
        team.members.push(memberEmail);
        updateTeamList();
        inviteForm.reset();
    }
}

function updateTeamList() {
    const teamSelects = [
        document.getElementById('invite-team'),
        document.getElementById('task-team')
    ];

    teamSelects.forEach(select => {
        select.innerHTML = '<option value="">Select a team</option>';
        teams.forEach(team => {
            const option = document.createElement('option');
            option.value = team.id;
            option.textContent = team.name;
            select.appendChild(option);
        });
    });

    teamList.innerHTML = '';
    teams.forEach(team => {
        const listItem = document.createElement('li');
        listItem.className = 'list-group-item d-flex justify-content-between align-items-center';
        listItem.innerHTML = `
            <div>
                <strong>${team.name}</strong>
                <div class="text-muted small">Members: ${team.members.join(', ')}</div>
            </div>
            <span class="badge bg-primary rounded-pill">${team.tasks.length}</span>
        `;
        teamList.appendChild(listItem);
    });
}

function handleTaskCreation(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value;
    const desc = document.getElementById('task-desc').value;
    const priority = document.getElementById('task-priority').value;
    const assignee = document.getElementById('task-assignee').value;
    const teamId = parseInt(document.getElementById('task-team').value);

    const newTask = {
        id: taskId++,
        title,
        description: desc,
        priority,
        status: 'todo',
        assignee,
        teamId,
        comments: [],
        attachments: [],
        createdAt: new Date()
    };

    tasks.push(newTask);
    renderTasks();
    taskForm.reset();
}

function renderTasks() {
    todoList.innerHTML = '';
    inprogressList.innerHTML = '';
    doneList.innerHTML = '';

    renderTaskList(tasks.filter(t => t.status === 'todo'), todoList);
    renderTaskList(tasks.filter(t => t.status === 'inprogress'), inprogressList);
    renderTaskList(tasks.filter(t => t.status === 'done'), doneList);

    setupDragAndDrop();
}

function renderTaskList(taskArray, listElement) {
    taskArray.forEach(task => {
        const team = teams.find(t => t.id === task.teamId);
        const teamName = team ? team.name : 'No Team';

        const taskItem = document.createElement('li');
        taskItem.className = `list-group-item d-flex justify-content-between align-items-center priority-${task.priority}`;
        taskItem.setAttribute('draggable', true);
        taskItem.setAttribute('data-id', task.id);
        taskItem.innerHTML = `
            <div class="task-content" style="flex-grow: 1;">
                <strong>${task.title}</strong>
                <p class="mb-1 small text-muted">${task.description}</p>
                <div class="task-meta">
                    <span class="badge bg-${getPriorityColor(task.priority)}">${task.priority}</span>
                    <span class="badge bg-secondary">${task.assignee || 'Unassigned'}</span>
                    <span class="badge bg-info">${teamName}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-outline-primary btn-sm view-btn">View</button>
                <button class="btn btn-outline-warning btn-sm edit-btn">Edit</button>
                <button class="btn btn-outline-danger btn-sm delete-btn">Delete</button>
            </div>
        `;
        listElement.appendChild(taskItem);
    });
}

function handleTaskActions(e) {
    const taskItem = e.target.closest('li');
    if (!taskItem) return;

    const taskId = parseInt(taskItem.getAttribute('data-id'));
    const task = tasks.find(t => t.id === taskId);

    if (e.target.classList.contains('view-btn')) {
        openTaskModal(task);
    } else if (e.target.classList.contains('edit-btn')) {
        editTask(task);
    } else if (e.target.classList.contains('delete-btn')) {
        deleteTask(taskId);
    }
}

function openTaskModal(task) {
    currentTaskInModal = task;

    document.getElementById('taskModalTitle').textContent = task.title;
    document.getElementById('task-modal-desc').textContent = task.description;
    document.getElementById('task-modal-status').textContent = task.status;
    document.getElementById('task-modal-priority').textContent = task.priority;
    document.getElementById('task-modal-assignee').textContent = task.assignee || 'Unassigned';
    document.getElementById('task-modal-team').textContent = teams.find(t => t.id === task.teamId)?.name || 'No Team';
    document.getElementById('task-modal-created').textContent = formatDate(task.createdAt);

    const commentsContainer = document.getElementById('task-comments');
    commentsContainer.innerHTML = '';
    task.comments.forEach(comment => {
        const commentElement = document.createElement('div');
        commentElement.className = 'card mb-2';
        commentElement.innerHTML = `
            <div class="card-body p-2">
                <div class="d-flex justify-content-between">
                    <strong>${comment.author}</strong>
                    <small class="text-muted">${formatDate(comment.createdAt)}</small>
                </div>
                <p class="mb-0">${comment.text}</p>
            </div>
        `;
        commentsContainer.appendChild(commentElement);
    });

    const attachmentsContainer = document.getElementById('task-attachments');
    attachmentsContainer.innerHTML = '';
    task.attachments.forEach(attachment => {
        const attachmentElement = document.createElement('div');
        attachmentElement.className = 'card mb-2';
        attachmentElement.innerHTML = `
            <div class="card-body p-2 d-flex justify-content-between align-items-center">
                <span>${attachment.name}</span>
                <button class="btn btn-sm btn-outline-danger">Delete</button>
            </div>
        `;
        attachmentsContainer.appendChild(attachmentElement);
    });

    taskModal.show();
}

function editTask(task) {
    const newTitle = prompt('Edit task title:', task.title);
    const newDesc = prompt('Edit task description:', task.description);

    if (newTitle !== null) task.title = newTitle;
    if (newDesc !== null) task.description = newDesc;

    renderTasks();
}

function deleteTask(taskId) {
    if (confirm('Are you sure you want to delete this task?')) {
        tasks = tasks.filter(task => task.id !== taskId);
        renderTasks();
    }
}

function handleCommentSubmit(e) {
    e.preventDefault();
    const commentText = document.getElementById('comment-text').value;

    if (currentTaskInModal) {
        currentTaskInModal.comments.push({
            author: currentUser.email,
            text: commentText,
            createdAt: new Date()
        });
        openTaskModal(currentTaskInModal);
        commentForm.reset();
    }
}

function handleAttachmentSubmit(e) {
    e.preventDefault();
    const fileInput = document.getElementById('attachment-file');

    if (currentTaskInModal && fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        currentTaskInModal.attachments.push({ name: fileName });
        openTaskModal(currentTaskInModal);
        attachmentForm.reset();
    }
}

function setupDragAndDrop() {
    const columns = document.querySelectorAll('.list-group');

    columns.forEach(column => {
        column.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(column, e.clientY);
            const draggable = document.querySelector('.dragging');

            if (afterElement == null) {
                column.appendChild(draggable);
            } else {
                column.insertBefore(draggable, afterElement);
            }
        });
    });

    document.querySelectorAll('.list-group-item').forEach(item => {
        item.addEventListener('dragstart', () => item.classList.add('dragging'));
        item.addEventListener('dragend', () => {
            item.classList.remove('dragging');

            const taskId = parseInt(item.getAttribute('data-id'));
            const task = tasks.find(t => t.id === taskId);
            const newStatus = item.closest('.kanban-column').querySelector('h4').textContent.toLowerCase().replace(' ', '');

            if (task && task.status !== newStatus) {
                task.status = newStatus;
                renderTasks();
            }
        });
    });
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.list-group-item:not(.dragging)')];

    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        return (offset < 0 && offset > closest.offset) ? { offset, element: child } : closest;
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function getPriorityColor(priority) {
    const colors = {
        high: 'danger',
        medium: 'warning',
        low: 'success'
    };
    return colors[priority] || 'primary';
}

function formatDate(date) {
    return new Date(date).toLocaleString();
}*/
