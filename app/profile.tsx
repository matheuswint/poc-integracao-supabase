import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Alert, Button, Image, Text, TextInput, TouchableOpacity, View } from "react-native";
import { supabase } from "../src/lib/supabase";

export default function Profile() {
  // Estados para armazenar os dados do perfil e do usuário logado
  // Aqui são guardados temporariamente o nome, descrição, foto e dados do usuário logado.
  const [nome, setNome] = useState(""); // Guarda o nome do usuário digitado ou carregado do banco.
  const [descricao, setDescricao] = useState(""); // Guarda a descrição do perfil digitada ou carregada do banco.
  const [foto, setFoto] = useState<string | null>(null); // Guarda a foto do perfil, seja uma URL do banco ou URI local do dispositivo.
  const [user, setUser] = useState<any>(null); // Guarda os dados do usuário logado, como id e email.
  const router = useRouter(); // Permite navegação entre telas.
  // O router é usado para mudar de tela, por exemplo, ir para login ou sair do perfil.

  useEffect(() => {
    // Quando a tela carrega, busca o usuário logado no Supabase
    // Assim que a tela abre, verifica se existe um usuário logado no Supabase.
    supabase.auth.getUser().then(async ({ data }) => {
      if (data.user) {
        setUser(data.user); // Salva os dados do usuário logado
        // Guarda os dados do usuário para usar nas operações seguintes.

        // Busca os dados do perfil desse usuário no banco de dados
        // Procura no banco de dados Supabase os dados do perfil desse usuário pelo id.
        const { data: perfil, error } = await supabase
          .from("profiles")
          .select("nome, descricao, foto")
          .eq("id", data.user.id)
          .single();

        // Se encontrar o perfil, preenche os campos na tela
        // Se achar os dados do perfil, coloca eles nos campos para o usuário editar.
        if (!error && perfil) {
          setNome(perfil.nome || "");
          setDescricao(perfil.descricao || "");
          setFoto(perfil.foto || null);
        }
      } else {
        // Se não estiver logado, redireciona para a tela de login
        // Se não houver usuário logado, manda para a tela de login.
        router.replace("/login");
      }
    });
  }, []);

  // Função chamada ao clicar para escolher uma foto
  // Executa quando o usuário quer trocar a foto do perfil.
  async function escolherFoto() {
    // Pede permissão para acessar a galeria do dispositivo
    // Solicita ao sistema permissão para acessar as imagens do celular.
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permissão necessária", "Precisamos de acesso à galeria!");
      return;
    }

    // Abre a galeria para o usuário escolher uma imagem
    // Mostra a galeria para o usuário selecionar uma foto.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    // Se o usuário escolher uma imagem, salva a URI dela no estado
    // Se o usuário selecionar uma imagem, guarda o endereço dela para mostrar e salvar depois.
    if (!result.canceled) {
      setFoto(result.assets[0].uri);
    }
  }

  // Função chamada ao clicar para salvar o perfil
  // Executa quando o usuário clica para salvar as alterações feitas no perfil.
  async function salvarPerfil() {
    if (!user) return; // Se não tiver usuário logado, não faz nada
    // Garante que só salva se houver usuário logado.

    let fotoUrl = foto; // Variável para guardar a URL final da foto
    // Guarda o endereço da foto que será salva no banco.

    // Se a foto for nova (local, começa com "file://"), faz upload para o Supabase Storage
    // Se o usuário trocou a foto e ela está no dispositivo, faz upload para o Supabase.
    if (foto && foto.startsWith("file://")) {
      try {
        const fileName = `${user.id}.jpg`; // Nome do arquivo baseado no id do usuário
        // Usa o id do usuário para nomear a foto e evitar conflitos.

        const formData = new FormData();
        formData.append("file", {
          uri: foto,
          name: fileName,
          type: "image/jpeg",
        } as any);

        // Faz upload da imagem para o bucket "profiles" no Supabase Storage
        // Envia a foto para o armazenamento do Supabase, na pasta "profiles".
        const { error: uploadError } = await supabase.storage
          .from("profiles")
          .upload(fileName, formData, { upsert: true });

        // Se der erro no upload, mostra alerta
        // Se não conseguir enviar a foto, mostra mensagem de erro.
        if (uploadError) return Alert.alert("Erro", uploadError.message);

        // Pega a URL pública da imagem enviada
        // Obtém o link público da foto para mostrar no perfil e salvar no banco.
        const { data } = supabase.storage.from("profiles").getPublicUrl(fileName);
        fotoUrl = data.publicUrl;
      } catch (err: any) {
        // Se der erro no processo, mostra alerta
        // Se acontecer algum erro durante o envio, mostra mensagem de erro.
        return Alert.alert("Erro", err.message || "Falha ao enviar a imagem");
      }
    }

    // Salva ou atualiza os dados do perfil no banco de dados
    // Envia as informações do perfil (nome, descrição, foto) para o banco de dados Supabase.
    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      nome,
      descricao,
      foto: fotoUrl,
    });

    // Mostra alerta de sucesso ou erro
    // Informa ao usuário se salvou com sucesso ou se deu erro.
    if (error) Alert.alert("Erro", error.message);
    else Alert.alert("Sucesso", "Perfil atualizado!");
  }

  // Função chamada ao clicar para sair (logout)
  // Executa quando o usuário clica para sair da conta.
  async function logout() {
    await supabase.auth.signOut(); // Faz logout no Supabase
    // Encerra a sessão do usuário no Supabase.
    router.replace("/login"); // Redireciona para a tela de login
    // Leva o usuário para a tela de login após sair.
  }

  // Renderiza a interface do perfil
  // O código abaixo monta a tela visual do perfil do usuário.
  return (
    <View style={{ flex: 1, alignItems: "center", padding: 20 }}>
      {/* Mostra a foto do perfil e permite trocar ao clicar 
          Exibe a foto do perfil e, ao clicar, permite escolher outra foto. */}
      <TouchableOpacity onPress={escolherFoto}>
        <Image
          source={{
            uri:
              foto ||
              "https://cdn-icons-png.flaticon.com/512/847/847969.png", // Se não tiver foto, mostra avatar padrão
            // Se o usuário não tiver foto, mostra uma imagem padrão.
          }}
          style={{
            width: 120,
            height: 120,
            borderRadius: 60,
            marginBottom: 20,
            borderWidth: 2,
            borderColor: "#ccc",
          }}
        />
        <Text style={{ textAlign: "center", color: "#007AFF" }}>
          Alterar foto
        </Text>
      </TouchableOpacity>

      {/* Campo para editar o nome do perfil 
          Onde o usuário pode editar o nome do perfil. */}
      <TextInput
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          width: "100%",
          borderRadius: 6,
        }}
      />
      {/* Campo para editar a descrição do perfil 
          Onde o usuário pode editar a descrição do perfil. */}
      <TextInput
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
        style={{
          borderWidth: 1,
          marginBottom: 10,
          padding: 8,
          width: "100%",
          borderRadius: 6,
        }}
      />

      {/* Botão para salvar as alterações do perfil 
          Quando clicado, executa a função para salvar as mudanças feitas no perfil. */}
      <Button title="Salvar" onPress={salvarPerfil} />
      <View style={{ marginTop: 10 }}>
        {/* Botão para sair da conta 
            Permite ao usuário sair da conta e voltar para a tela de login. */}
        <Button title="Sair" onPress={logout} color="red" />
      </View>
    </View>
  );
}
