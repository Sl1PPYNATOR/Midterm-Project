$(document).ready(function() {
    const STORAGE_KEY = "bmw_garage_tasks";
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    tasks = tasks.map(t => {
        if (!t.status || t.status === "pending") t.status = "todo";
        return t;
    });

    let statusChartInstance = null;
    let priorityChartInstance = null;
    let timelineChartInstance = null; // Add this

    renderDashboard();

    function renderDashboard() {
        updateSummaryMetrics();
        updateCharts();
        updateTimelineChart(); // Add this
        renderKanbanBoard();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    }

    function updateCharts() {
        const todoCount = tasks.filter(t => t.status === "todo").length;
        const inProgressCount = tasks.filter(t => t.status === "in-progress").length;
        const completedCount = tasks.filter(t => t.status === "completed").length;

        const highCount = tasks.filter(t => t.priority === "High").length;
        const medCount = tasks.filter(t => t.priority === "Medium").length;
        const lowCount = tasks.filter(t => t.priority === "Low").length;

        const statusCtx = $('#statusChart')[0].getContext("2d");
        if (statusChartInstance) statusChartInstance.destroy();
        statusChartInstance = new Chart(statusCtx, {
            type: "bar",
            data: {
                labels: ["To Do", "In Progress", "Completed"],
                datasets: [{
                    label: "Jobs Count",
                    data: [todoCount, inProgressCount, completedCount],
                    backgroundColor: ["#6c757d", "#ffc107", "#198754"],
                    borderWidth: 1
                }]
            },
            options: { 
                responsive: true, 
                plugins: { legend: { display: false } },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: { stepSize: 1 }
                    }
                }
            }
        });

        const priorityCtx = $('#priorityChart')[0].getContext("2d");
        if (priorityChartInstance) priorityChartInstance.destroy();
        priorityChartInstance = new Chart(priorityCtx, {
            type: "doughnut",
            data: {
                labels: ["High", "Medium", "Low"],
                datasets: [{
                    data: [highCount, medCount, lowCount],
                    backgroundColor: ["#dc3545", "#ffc107", "#0dcaf0"]
                }]
            },
            options: { responsive: true }
        });
    }

    function updateTimelineChart() {
        const timelineEl = $('#timelineChart')[0];
        if (!timelineEl) return;

        const dateCounts = {};
        tasks.forEach(t => {
            if (t.dueDate && t.status !== "completed") {
                dateCounts[t.dueDate] = (dateCounts[t.dueDate] || 0) + 1;
            }
        });

        const sortedDates = Object.keys(dateCounts).sort((a, b) => new Date(a) - new Date(b));
        const counts = [];
        const formattedDates = [];

        sortedDates.forEach(dateStr => {
            counts.push(dateCounts[dateStr]);

            const parts = dateStr.split("-");
            if (parts.length === 3) {
                formattedDates.push(`${parts[2]}-${parts[1]}-${parts[0].slice(-2)}`);
            } else {
                formattedDates.push(dateStr);
            }
        });

        const hasData = sortedDates.length > 0;

        if (timelineChartInstance) timelineChartInstance.destroy();
        timelineChartInstance = new Chart(timelineEl.getContext("2d"), {
            type: "line",
            data: {
                labels: hasData ? formattedDates : ["No Active Due Dates"],
                datasets: [{
                    label: "Active Jobs Due",
                    data: hasData ? counts : [0],
                    borderColor: "#0d6efd",
                    backgroundColor: "rgba(13, 110, 253, 0.1)",
                    fill: true,
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
            }
        });
    }

    function updateSummaryMetrics() {
        const highActive = tasks.filter(t => t.priority === "High" && t.status !== "completed").length;
        $("#highActiveCount").text(highActive);

        const todayStr = new Date().toISOString().split("T")[0];
        const overdue = tasks.filter(t => t.status !== "completed" && t.dueDate && t.dueDate < todayStr).length;
        $("#overdueCount").text(overdue);

        const total = tasks.length;
        const completed = tasks.filter(t => t.status === "completed").length;
        const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
        $("#completionRate").text(`${rate}%`);
    }

    $("#kanbanSort").on("change", function() {
        renderKanbanBoard();
    });

    function renderKanbanBoard() {
        const todoCol = $("#todoColumn").empty();
        const inProgressCol = $("#inProgressColumn").empty();
        const completedCol = $("#completedColumn").empty();

        let todoCnt = 0, ipCnt = 0, compCnt = 0;
        const sortVal = $("#kanbanSort").val() || "date-asc";

        let sortedTasks = [...tasks].sort((a, b) => {
            if (sortVal === "date-asc") {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(a.dueDate) - new Date(b.dueDate);
            } else if (sortVal === "date-desc") {
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return new Date(b.dueDate) - new Date(a.dueDate);
            } else if (sortVal === "priority-desc") {
                const priorityWeight = { "High": 3, "Medium": 2, "Low": 1 };
                return (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0);
            } else if (sortVal === "name-asc") {
                return (a.name || "").localeCompare(b.name || "");
            }
        });

        sortedTasks.forEach(task => {
            let badgeClass = "bg-secondary";
            if (task.priority === "High") badgeClass = "bg-danger";
            else if (task.priority === "Medium") badgeClass = "bg-warning text-dark";
            else if (task.priority === "Low") badgeClass = "bg-info text-dark";

            const cardHtml = `
                <div class="card shadow-sm p-3 task-card bg-white border" draggable="true" ondragstart="dragTask(event, '${task.id}')" style="cursor: grab;">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <span class="badge ${badgeClass}">${task.priority}</span>
                        <small class="text-muted">${task.dueDate || ""}</small>
                    </div>
                    <h6 class="fw-bold mb-1">${escapeHtml(task.name)}</h6>
                    <p class="text-muted small mb-0 text-truncate">${escapeHtml(task.description || "No description")}</p>
                </div>
            `;

            if (task.status === "todo") {
                todoCol.append(cardHtml);
                todoCnt++;
            } else if (task.status === "in-progress") {
                inProgressCol.append(cardHtml);
                ipCnt++;
            } else if (task.status === "completed") {
                completedCol.append(cardHtml);
                compCnt++;
            }
        });

        $("#todoCount").text(todoCnt);
        $("#inProgressCount").text(ipCnt);
        $("#completedCount").text(compCnt);
    }

    function escapeHtml(string) {
        return $("<div>").text(string).html();
    }
});

function allowDrop(ev) {
    ev.preventDefault();
}

function dragTask(ev, taskId) {
    ev.originalEvent ? ev.originalEvent.dataTransfer.setData("text/plain", taskId) : ev.dataTransfer.setData("text/plain", taskId);
}

function dropTask(ev, newStatus) {
    ev.preventDefault();
    const taskId = ev.originalEvent ? ev.originalEvent.dataTransfer.getData("text/plain") : ev.dataTransfer.getData("text/plain");
    
    const STORAGE_KEY = "bmw_garage_tasks";
    let tasks = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];

    tasks = tasks.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
    location.reload(); 
}