$(document).ready(function() {
    const $form = $("#contactForm");
    if ($form.length === 0) return;

    $form.on("submit", function(event) {
        event.preventDefault();
        event.stopPropagation();

        const formElement = $form[0];

        //check if form is valid before proceeding
        if (!formElement.checkValidity()) {
            $form.addClass("was-validated");
            return;
        }

        //collect form data and populate confirmation modal
        const name = $("#contactName").val().trim();
        const email = $("#contactEmail").val().trim();
        const subject = $("#contactSubject").val().trim();
        const message = $("#contactMessage").val().trim();

        $("#confName").text(name);
        $("#confEmail").text(email);
        $("#confSubject").text(subject);
        $("#confMessage").text(message);

        //show confirmation modal
        const modalElement = $("#confirmationModal")[0];
        const confirmationModal = new bootstrap.Modal(modalElement);
        confirmationModal.show();

        //reset form after submission
        formElement.reset();
        $form.removeClass("was-validated");
    });
});