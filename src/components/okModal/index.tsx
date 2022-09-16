import { Modal, Text, View } from "react-native";
import { Container, Title, Content, BackModal, ModalBtn } from "./styles";
import { MaterialIcons } from "@expo/vector-icons";

export interface IOkModalProps {
  type?: string;
  title: string;
  text: string;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
}

export default function OkModal({
  type = "success",
  showModal,
  title,
  text,
  setShowModal,
}: IOkModalProps) {
  function handleCloseModal() {
    setShowModal(!showModal);
  }

  function getIcon() {
    switch (type) {
      case "success":
        return <MaterialIcons name="done" size={24} color="black" />;
      case "error":
        return <MaterialIcons name="error" size={24}/>;
      case "warning":
        return <MaterialIcons name="warning" size={24} color="black" />;
    }
  }

  return (
    <Modal
      animationType="slide"
      visible={showModal}
      onRequestClose={handleCloseModal}
      transparent={true}
    >
      <BackModal onPress={handleCloseModal}>
        <Container>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {getIcon()}
            <Title>{title}</Title>
          </View>

          <Content>{text}</Content>
          <View style={{ width: "30%" }}>
            <ModalBtn onPress={handleCloseModal}>
              <Text style={{ textAlign: "center" }}>OK</Text>
            </ModalBtn>
          </View>
        </Container>
      </BackModal>
    </Modal>
  );
}
