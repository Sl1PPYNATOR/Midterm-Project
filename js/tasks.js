$(document).ready(function() {
    const STORAGE_KEY = "bmw_garage_tasks";
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    renderTasks();

    $("#taskForm").on("submit", function(e) {
        e.preventDefault();
        const name = $("#taskName").val().trim();
        const description = $("#taskDescription").val().trim();
        const dueDate = $("#taskDueDate").val();
        const priority = $("#taskPriority").val();
        if (!name || !dueDate) return;
        const newTask = {
            id: Date.now().toString(),
            name: name,
            description: description,
            dueDate: dueDate,
            priority: priority,
            status: "todo"
        };
        tasks.push(newTask);
        persistAndRender();
        this.reset();
        $("#taskFormCard").slideUp("fast");
        $("#formArrow").css("transform", "rotate(0deg)");
    });

    $(document).on("click", ".delete-btn", function() {
        const taskId = $(this).attr("data-id");
        tasks = tasks.filter(task => task.id !== taskId);
        persistAndRender();
    });

    $(document).on("click", ".toggle-status-btn", function() {
        const taskId = $(this).attr("data-id");
        tasks = tasks.map(task => {
            if (task.id === taskId) {
                if (task.status === "todo" || task.status === "pending") {
                    task.status = "in-progress";
                } else if (task.status === "in-progress") {
                    task.status = "completed";
                } else {
                    task.status = "todo";
                }
            }
            return task;
        });
        persistAndRender();
    });

    $(document).on("click", ".edit-btn", function() {
        const taskId = $(this).attr("data-id");
        const taskToEdit = tasks.find(task => task.id === taskId);

        if (!taskToEdit) return;

        $("#taskName").val(taskToEdit.name);
        $("#taskDescription").val(taskToEdit.description);
        $("#taskDueDate").val(taskToEdit.dueDate);
        $("#taskPriority").val(taskToEdit.priority);

        tasks = tasks.filter(task => task.id !== taskId);
        persistAndRender();

        $("#taskFormCard").slideDown("fast");
        $("#formArrow").css("transform", "rotate(180deg)");
        $("#taskName").focus();
    });

    $("#searchInput, #statusFilter, #priorityFilter, #sortOption").on("input change", function() {
        renderTasks();
    });

    $(document).on("click", "#toggleFormBtn", function() {
        $("#taskFormCard").slideToggle("fast", function() {
            const isVisible = $(this).is(":visible");
            if (isVisible) {
                $("#formArrow").css("transform", "rotate(180deg)");
            } else {
                $("#formArrow").css("transform", "rotate(0deg)");
            }
        });
    });

    function persistAndRender() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
        renderTasks();
    }

    function renderTasks() {
        const searchQuery = $("#searchInput").val().toLowerCase();
        const statusFilter = $("#statusFilter").val();
        const priorityFilter = $("#priorityFilter").val();
        const sortOption = $("#sortOption").val();

        let filteredTasks = tasks.filter(task => {
            const matchesSearch = task.name.toLowerCase().includes(searchQuery) || task.description.toLowerCase().includes(searchQuery);
            let taskStatus = task.status || "todo";
            if (taskStatus === "pending") taskStatus = "todo";
            const matchesStatus = statusFilter === "all" || taskStatus === statusFilter;
            const matchesPriority = priorityFilter === "all" || task.priority === priorityFilter;
            return matchesSearch && matchesStatus && matchesPriority;
        });

        filteredTasks.sort((a, b) => {
            if (sortOption === "date-asc") {
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortOption === "date-desc") {
                return new Date(b.dueDate) - new Date(a.dueDate);
            } else if (sortOption === "name-asc") {
                return a.name.localeCompare(b.name);
            }
        });

        updateSummaryMetrics();

        const tableBody = $("#taskTableBody");
        tableBody.empty();

        if (filteredTasks.length === 0) {
            tableBody.html(`<tr><td colspan="6" class="text-center text-muted py-4">No matching garage jobs found.</td></tr>`);
            return;
        }

        filteredTasks.forEach(task => {
            let priorityBadgeClass = "bg-secondary";
            if (task.priority === "High") priorityBadgeClass = "bg-danger";
            else if (task.priority === "Medium") priorityBadgeClass = "bg-warning text-dark";
            else if (task.priority === "Low") priorityBadgeClass = "bg-info text-dark";

            let currentStatus = task.status || "todo";
            if (currentStatus === "pending") currentStatus = "todo";

            let statusBadgeClass = "bg-secondary";
            let statusText = "To Do";

            if (currentStatus === "in-progress") {
                statusBadgeClass = "bg-warning text-dark";
                statusText = "In Progress";
            } else if (currentStatus === "completed") {
                statusBadgeClass = "bg-success";
                statusText = "Completed";
            }

            let displayDesc = task.description;
            let isTruncated = false;
            if (displayDesc.length > 75) {
                displayDesc = displayDesc.substring(0, 75) + "...";
                isTruncated = true;
            }

            const descHtml = isTruncated 
                ? `<span class="truncated-desc" data-full-text="${encodeURIComponent(task.description)}" title="Click to view full description">${escapeHtml(displayDesc)}</span>`
                : escapeHtml(task.description);

            const row = `
                <tr>
                    <td data-label="Priority"><span class="badge ${priorityBadgeClass}">${task.priority}</span></td>
                    <td data-label="Job Name" class="fw-bold">${escapeHtml(task.name)}</td>
                    <td data-label="Description" class="text-muted small">${descHtml}</td>
                    <td data-label="Due Date">${formatDate(task.dueDate)}</td>
                    <td data-label="Status"><span class="badge ${statusBadgeClass}">${statusText}</span></td>
                    <td data-label="Actions">
                        <div class="d-flex gap-1 justify-content-end align-items-center">
                            <button class="btn btn-sm btn-outline-success toggle-status-btn" data-id="${task.id}" title="Cycle Status">✓</button>
                            <button class="btn btn-sm btn-outline-primary edit-btn" data-id="${task.id}" title="Edit Job">Edit</button>
                            <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${task.id}" title="Delete Job">Delete</button>
                        </div>
                    </td>
                </tr>
            `;
            tableBody.append(row);
        });
    }
 
    $(document).on("click", ".truncated-desc", function() {
        const fullText = decodeURIComponent($(this).attr("data-full-text"));
        $("#modalDescriptionContent").text(fullText);
        const descriptionModal = new bootstrap.Modal($("#descriptionModal")[0]);
        descriptionModal.show();
    });

    function updateSummaryMetrics() {
        const total = tasks.length;
        const completed = tasks.filter(t => t.status === "completed").length;
        const pending = total - completed;

        $("#totalTasksCount").text(total);
        $("#pendingTasksCount").text(pending);
        $("#completedTasksCount").text(completed);
    }

    function formatDate(dateString) {
        if (!dateString) return "";
        const parts = dateString.split("-");
        if (parts.length !== 3) return dateString;
        const year = parts[0].slice(-2);
        const month = parts[1];
        const day = parts[2];
        return `${day}-${month}-${year}`;
    }

    function escapeHtml(string) {
        return $("<div>").text(string).html();
    }
});