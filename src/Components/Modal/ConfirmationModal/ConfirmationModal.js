import React from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Spinner from "react-bootstrap/Spinner";

function ConfirmationModal({
    show,
    title,
    body,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
    disableCancel = false,
    disableConfirm = false,
    isConfirming = false,
}) {
    return (
        <Modal show={show} onHide={onCancel}>
            <Modal.Header>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>{body}</Modal.Body>
            <Modal.Footer>
                <Button
                    className="cancel-button"
                    type="button"
                    disabled={disableCancel}
                    onClick={onCancel}
                >
                    {cancelText}
                </Button>
                <Button
                    className={
                        confirmText === "Delete" ? "delete-button" : "button"
                    }
                    type="button"
                    disabled={isConfirming || disableConfirm}
                    onClick={onConfirm}
                >
                    {isConfirming ? (
                        <>
                            <Spinner
                                as="span"
                                animation="border"
                                size="sm"
                                role="status"
                                aria-hidden="true"
                            />
                            {` ${confirmText.slice(0, -1)}ing...`}
                        </>
                    ) : (
                        confirmText
                    )}
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ConfirmationModal;
