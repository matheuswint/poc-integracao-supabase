import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Login() {
  // Estados para armazenar o email e a senha digitados pelo usuário
  // Esses estados guardam temporariamente o que o usuário digita nos campos de login.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Permite navegação entre telas
  // O router é usado para mudar de tela, por exemplo, ir para cadastro ou perfil.

  // Função chamada ao clicar no botão "Entrar"
  // Essa função é executada quando o usuário clica para fazer login.
  async function handleLogin() {
    // Tenta fazer login usando o Supabase com email e senha informados
    // Aqui o Supabase é chamado para autenticar o usuário com os dados digitados.
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      // Se der erro, mostra alerta com a mensagem do erro
      // Se o login falhar, aparece uma mensagem de erro na tela para o usuário.
      Alert.alert("Erro", error.message);
    } else {
      // Se login for bem-sucedido, redireciona para a tela de perfil
      // Se funcionar, o usuário é levado para a tela de perfil.
      router.replace("/profile");
    }
  }

  // Renderiza a interface da tela de login
  // O código abaixo monta a tela visual do login.
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {/* Campo para digitar o email 
          Aqui o usuário digita o email para tentar acessar a conta. */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      {/* Campo para digitar a senha 
          Aqui o usuário digita a senha para tentar acessar a conta. */}
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      {/* Botão para tentar fazer login 
          Quando clicado, executa a função de login. */}
      <Button title="Entrar" onPress={handleLogin} />
      {/* Botão para ir para a tela de cadastro 
          Permite ao usuário ir para a tela de cadastro caso não tenha conta. */}
      <Button title="Cadastrar" onPress={() => router.push("/register")} />
    </View>
  );
}
