import { useRouter } from "expo-router";
import { useState } from "react";
import { Alert, Button, TextInput, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Register() {
  // Estados para armazenar o email e a senha digitados pelo usuário
  // Esses estados guardam temporariamente o que o usuário digita nos campos de cadastro.
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter(); // Permite navegação entre telas
  // O router é usado para mudar de tela, por exemplo, ir para login após cadastro.

  // Função chamada ao clicar no botão "Cadastrar"
  // Essa função é executada quando o usuário clica para criar uma conta.
  async function handleRegister() {
    // Tenta criar uma nova conta no Supabase com email e senha informados
    // Aqui o Supabase é chamado para registrar o usuário com os dados digitados.
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) {
      // Se der erro, mostra alerta com a mensagem do erro
      // Se o cadastro falhar, aparece uma mensagem de erro na tela para o usuário.
      Alert.alert("Erro", error.message);
    } else {
      // Se cadastro for bem-sucedido, avisa para verificar o email
      // Se funcionar, avisa o usuário que ele precisa confirmar o cadastro pelo email.
      Alert.alert("Sucesso", "Verifique seu email para confirmar a conta!");
      // Redireciona para a tela de login
      // Depois do cadastro, o usuário é levado para a tela de login.
      router.replace("/login");
    }
  }

  // Renderiza a interface da tela de cadastro
  // O código abaixo monta a tela visual do cadastro.
  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      {/* Campo para digitar o email 
          Aqui o usuário digita o email que será usado para criar a conta. */}
      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      {/* Campo para digitar a senha 
          Aqui o usuário digita a senha que será usada para criar a conta. */}
      <TextInput
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        style={{ borderWidth: 1, marginBottom: 10 }}
      />
      {/* Botão para tentar cadastrar 
          Quando clicado, executa a função de cadastro. */}
      <Button title="Cadastrar" onPress={handleRegister} />
      {/* Botão para voltar para a tela de login 
          Permite ao usuário retornar para o login caso já tenha conta. */}
      <Button title="Voltar ao Login" onPress={() => router.replace("/login")} />
    </View>
  );
}
