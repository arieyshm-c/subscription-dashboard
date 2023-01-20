import { Modal, useModal, Button, Text } from "@nextui-org/react";

export const DeleteModal = ({ open, setOpenModal, onDelete, setSelectedSubsscription, selectedSubscription }) => {
    const { setVisible, bindings } = useModal(open);
    return (
        <div>
            <Modal
                scroll
                width="600px"
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                {...bindings}
            >
                <Modal.Header>
                    <Text id="modal-title" size={18} b>
                        Delete Subscription
                    </Text>
                </Modal.Header>
                <Modal.Body>
                    <Text id="modal-description" size={18}>
                        Are you sure you want to delete <strong style={{ textDecoration: 'underline' }}>{selectedSubscription?.name}</strong> of <strong style={{ textDecoration: 'underline' }}>{selectedSubscription?.company}</strong>
                    </Text>
                </Modal.Body>
                <Modal.Footer>
                    <Button auto flat color="error" onPress={() => {
                        setOpenModal(false);
                        setSelectedSubsscription({})
                    }}>
                        Close
                    </Button>
                    <Button auto onPress={() => onDelete(selectedSubscription)}>
                        Agree
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
