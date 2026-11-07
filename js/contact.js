$(document).ready(function() {
    const $form = $("#contactForm");
    if ($form.length === 0) return;

    $form.on("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();

        const formElement = $form[0];

        if (!formElement.checkValidity()) {
            $form.addClass("was-validated");
            return;
        }

        const name = $("#contactName").val().trim();
        const email = $("#contactEmail").val().trim();
        const subject = $("#contactSubject").val().trim();
        const message = $("#contactMessage").val().trim();

        $("#confName").text(name);
        $("#confEmail").text(email);
        $("#confSubject").text(subject);
        $("#confMessage").text(message);

        const modalElement = $("#confirmationModal")[0];
        const confirmationModal = new bootstrap.Modal(modalElement);
        confirmationModal.show();

        formElement.reset();
        $form.removeClass("was-validated");
    });
});