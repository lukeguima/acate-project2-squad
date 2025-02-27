import { useRef } from "react";
import { Animated } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { IProfile } from "../../types";
import { IThemeState } from "../../types/IThemeState";
import BackGround from "../../components/backGround";
import DevStars from "../../components/devStars";
import SecondaryHeader from "../../components/SecondaryHeader";
import { logo_footer } from "../../constants/resources";

import {
  CardPressable,
  DevInfoContainer,
  DevInfoText,
  TechContainer,
  AvatarContainer,
  AvatarImage,
  FooterLogo,
} from "./styles";
interface IProfileProps {
  profiles: IProfile[];
}

export default function ProfileList(props) {
  const scrollY = useRef(new Animated.Value(0)).current;
  const { currentTheme } = useSelector(
    (state: IThemeState) => state.themeState
  );

  const { profiles }: IProfileProps = props.route.params;

  return (
    <BackGround>
      <SecondaryHeader
        onPress={() => props.navigation.goBack()}
        title="Resultados"
      />
      <Animated.FlatList
        data={profiles}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: true }
        )}
        keyExtractor={(item, index) => `${item.id}-${index}`}
        contentContainerStyle={{
          marginTop: 30,
          alignItems: "center",
        }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          const inputRange = [-1, 0, 130 * index, 130 * (index + 2)];
          const scale = scrollY.interpolate({
            inputRange,
            outputRange: [1, 1, 1, 0],
          });
          const opacity = scrollY.interpolate({
            inputRange: inputRange,
            outputRange: [1, 1, 1, 0],
          });
          return (
            <CardPressable
              onPress={() => {
                props.navigation.navigate("profile", {
                  profile: item,
                });
              }}
            >
              <Animated.View
                style={{
                  width: "85%",
                  flexDirection: "row",
                  marginBottom: 27,
                  borderRadius: 15,
                  borderWidth: 1,
                  borderColor: currentTheme == "light" ? "#FFF" : "#FFCA28",
                  alignItems: "center",
                  justifyContent: "space-between",
                  opacity,
                  transform: [{ scale }],
                }}
              >
                <AvatarContainer>
                  <AvatarImage source={{ uri: item.photo }} />
                </AvatarContainer>
                <DevInfoContainer>
                  <DevInfoText>{item.fullName}</DevInfoText>
                  <DevInfoText>{item.stack.label}</DevInfoText>
                  <DevStars stars={item?.stars ?? 0} />
                </DevInfoContainer>
                <TechContainer>
                  {/*TODO: Validar será o preenchimento da tecnologia (Regra)*/}
                  <MaterialIcons name={"smartphone"} size={35} />
                </TechContainer>
              </Animated.View>
            </CardPressable>
          );
        }}
      />
      <FooterLogo source={logo_footer} alt="logo" />
    </BackGround>
  );
}
