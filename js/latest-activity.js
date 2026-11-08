$(document).ready(function() {
    const $activityList = $("#latestActivityList");

    if ($activityList.length === 0) return;

    const savedActivity = localStorage.getItem("bmw_garage_activity");
    
    if (savedActivity) {
        try {
            const activities = JSON.parse(savedActivity);
            
            if (Array.isArray(activities) && activities.length > 0) {
                $activityList.empty(); 
                
                const recentActivities = activities.slice(0, 4); 
                
                recentActivities.forEach(act => {
                    let badgeClass = "bg-secondary text-white";
                    let iconClass = "fa-solid fa-circle-dot text-secondary";
                    let displayStatus = act.status || "To Do";
                    
                    const statusLower = (act.status || "").toLowerCase().trim();

                    //colours and icons for task status using Bootstrap
                    if (statusLower === "completed") {
                        badgeClass = "bg-success text-white";
                        iconClass = "fa-solid fa-circle-check text-success";
                        displayStatus = "Completed";
                    } else if (statusLower === "in progress") {
                        badgeClass = "bg-warning text-dark";
                        iconClass = "fa-solid fa-clock text-warning";
                        displayStatus = "In Progress";
                    } else if (statusLower === "deleted") {
                        badgeClass = "bg-danger text-white";
                        iconClass = "fa-solid fa-trash-can text-danger";
                        displayStatus = "Deleted";
                    } else if (statusLower === "updated") {
                        badgeClass = "bg-info text-dark";
                        iconClass = "fa-solid fa-pen-to-square text-info";
                        displayStatus = "Updated";
                    } else {
                        badgeClass = "bg-secondary text-white";
                        iconClass = "fa-solid fa-circle-dot text-secondary";
                        displayStatus = "To Do";
                    }

                    const listItem = `
                        <li class="list-group-item bg-transparent text-secondary d-flex justify-content-between align-items-center">
                            <span><i class="${iconClass} me-2"></i> ${act.message} <small class="text-muted ms-1">(${act.timestamp})</small></span>
                            <span class="badge ${badgeClass}">${displayStatus}</span>
                        </li>
                    `;
                    $activityList.append(listItem);
                });
                return;
            }
        } catch (e) {
            console.error("Error parsing activity log:", e);
        }
    }
    
    //message if no activity log exists (removed on line 13)
    $activityList.html(`
        <li class="list-group-item bg-transparent text-secondary">
            <i class="fa-solid fa-circle-info text-primary me-2"></i> No recent activity recorded yet. Perform actions on the <a href="tasks.html" class="text-reset fw-bold text-decoration-underline">Tasks Board</a>!
        </li>
    `);
});