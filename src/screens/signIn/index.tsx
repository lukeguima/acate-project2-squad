import { useState, HTMLInputTypeAttribute } from "react";
import {
  Alert,
  Dimensions,
  ImageBackground,
  Pressable,
  StatusBar,
  View,
  Text,
  ScrollView,
} from "react-native";

import { Auth } from "aws-amplify";
import { beLogged } from "../../store/modules/Auth.store";

import { useSelector, useDispatch } from "react-redux";
import { IThemeState } from "../../types/IThemeState";
import { toDarkTheme, toLightTheme } from "../../store/modules/Theme.store";

import {
  LinkedinLogo,
  GithubLogo,
  GoogleLogo,
  Sun,
  Moon,
} from "phosphor-react-native";

import SnackSuccess from "../../components/SnackSuccess";
import SnackError from "../../components/SnackError";
import DefaultInput from "../../components/Input";
import Button from "../../components/button";
import Spinner from "../../components/spinner";

import {
  city_day,
  city_night,
  logo_day,
  logo_night,
} from "../../constants/resources";

import {
  BlurCard,
  BtnContainer,
  Container,
  Icons,
  InputContainer,
  Logo,
  ScreenTitle,
  SocialContainer,
  SocialText,
  SwitchButton,
  SwitchTheme,
} from "../signIn/styles";

export default function SignIn({ navigation }) {
  const { currentTheme } = useSelector(
    (state: IThemeState) => state.themeState
  );

  const dispatch = useDispatch();

  const [show, setShow] = useState(true);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [snackErr, setSnackErr] = useState(false);
  const [snackSuc, setSnackSuc] = useState(false);
  const [snackText, setSnackText] = useState("");
  const [loading, setLoading] = useState(false);

  /*  const [logged, setLogged] = useState(false);

  useEffect(() => {
    Auth.currentAuthenticatedUser().then((response) => {
      setLogged(response.attributes.email_verified);
    });
  }, []);

  useEffect(() => {
    if (logged) {
      return;
    }
    navigation.navigate("verifyAccount");
  }, [logged]);
*/

  function setDarkTheme() {
    dispatch(toDarkTheme());
  }
  function setLightTheme() {
    dispatch(toLightTheme());
  }

  async function handleSignIn() {
    setLoading(true);
    try {
      await Auth.signIn(email, password);
      setSnackText("Login realizado!");
      setSnackSuc(true);
      dispatch(beLogged(email));
      setLoading(false);
    } catch (error) {
      setSnackText(error.name);
      setSnackErr(true);
      setLoading(false);
    }
    return;
  }

  function renderButton() {
    if (loading) {
      return (
        <BtnContainer>
          <Spinner />
        </BtnContainer>
      );
    }
    return (
      <BtnContainer>
        <Button primary title="Entrar" onPress={handleSignIn} />
      </BtnContainer>
    );
  }

  return (
    <Container>
      <StatusBar />
      <SnackSuccess
        text={snackText}
        visible={snackSuc}
        setVisible={setSnackSuc}
      />
      <SnackError
        text={snackText}
        visible={snackErr}
        setVisible={setSnackErr}
      />
      <ScrollView>
        <ImageBackground
          source={currentTheme === "light" ? city_day : city_night}
          resizeMode="cover"
          style={{
            position: "relative",
            width: Dimensions.get("screen").width,
            height: Dimensions.get("screen").height + 50,
          }}
        >
          <Logo
            source={currentTheme === "light" ? logo_day : logo_night}
            alt="Logo"
          />

          <BlurCard>
            <SwitchTheme>
              {currentTheme === "light" ? (
                <View
                  style={{
                    backgroundColor: "rgba(231,227,223, 0.8)",
                    padding: 5,
                    borderRadius: 15,
                  }}
                >
                  <SwitchButton onPress={setDarkTheme}>
                    <Text style={{ color: "#28393A", marginRight: 5 }}>
                      Tema escuro
                    </Text>
                    <Moon color="#28393A" weight="regular" size={24} />
                  </SwitchButton>
                </View>
              ) : (
                <View style={{ backgroundColor: "transparent", padding: 5 }}>
                  <SwitchButton onPress={setLightTheme}>
                    <Text style={{ color: "#fff", marginRight: 5 }}>
                      Tema claro
                    </Text>
                    <Sun color="#fff" weight="regular" size={24} />
                  </SwitchButton>
                </View>
              )}
            </SwitchTheme>
            <InputContainer>
              <DefaultInput
                label="Email:"
                placeholder="Informe seu email"
                value={email}
                onChangeText={(e: HTMLInputTypeAttribute) => setEmail(e)}
              />
            </InputContainer>
            <InputContainer>
              <DefaultInput
                secure={show}
                password
                showPassword={() => setShow(!show)}
                label="Senha:"
                placeholder="Mínimo 8 caracteres"
                value={password}
                onChangeText={(e: HTMLInputTypeAttribute) => setPassword(e)}
              />
            </InputContainer>
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
              onPress={() => navigation.navigate("forgotPassword")}
            >
              <ScreenTitle>Recuperar senha</ScreenTitle>
            </Pressable>
            <Pressable
              style={({ pressed }) => [
                {
                  opacity: pressed ? 0.6 : 1,
                },
              ]}
              onPress={() => navigation.navigate("signUp")}
            >
              <ScreenTitle>Não possui uma conta? Cadastre-se ➝</ScreenTitle>
            </Pressable>
            {renderButton()}
          </BlurCard>
          <SocialContainer>
            <SocialText>Ou faça login com:</SocialText>
            <Icons>
              <Pressable
                onPress={() => {
                  Alert.alert("Logar com: LinkedIn?");
                }}
              >
                <LinkedinLogo color="#fff" weight="light" size={36} />
              </Pressable>
              <Pressable
                onPress={() => {
                  Alert.alert("Logar com: GitHub?");
                }}
              >
                <GithubLogo color="#fff" weight="light" size={36} />
              </Pressable>
              <Pressable
                onPress={() => {
                  Alert.alert("Logar com: Google?");
                }}
              >
                <GoogleLogo color="#fff" weight="light" size={36} />
              </Pressable>
            </Icons>
          </SocialContainer>
        </ImageBackground>
      </ScrollView>
    </Container>
  );
}
