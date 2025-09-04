import React, { useState } from 'react';
import { enableScreens } from 'react-native-screens';
enableScreens(false);

import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();

function TelaInicial({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Flow</Text>
      <Button title="Entrar" onPress={() => navigation.navigate('TelaLogin')} />
      <Button title="Cadastrar" onPress={() => navigation.navigate('TelaCadastro')} />
    </View>
  );
}

function TelaLogin({ navigation }) {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');

  function entrar() {
    AsyncStorage.getItem(email).then(data => {
      if (!data) return setErro('Não encontramos esse email!');
      const usuario = JSON.parse(data);
      if (usuario.senha === senha) {
        setErro('');
        navigation.replace('TelaUsuario', { nome: usuario.nome, email });
      } else {
        setErro('Senha errada, tente de novo!');
      }
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      {erro ? <Text style={styles.erro}>{erro}</Text> : null}
      <Button title="Entrar" onPress={entrar} />
    </View>
  );
}

function TelaCadastro({ navigation }) {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  function cadastrar() {
    if (!nome || !email || !senha) {
      Alert.alert('Ops!', 'Preencha todos os campos antes de continuar.');
      return;
    }

    AsyncStorage.getItem(email).then(existing => {
      if (existing) {
        Alert.alert('Ei!', 'Esse email já foi usado!');
        return;
      }
      AsyncStorage.setItem(email, JSON.stringify({ nome, email, senha })).then(() => {
        setNome('');
        setEmail('');
        setSenha('');
        Alert.alert('Beleza!', 'Cadastro feito com sucesso!');
        navigation.goBack();
      });
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Seu nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Seu email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Sua senha"
        secureTextEntry
        value={senha}
        onChangeText={setSenha}
      />
      <Button title="Cadastrar" onPress={cadastrar} />
    </View>
  );
}

function TelaUsuario({ route, navigation }) {
  const { nome, email } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Oi, {nome}!</Text>
      <Button
        title="Cadastrar Evento"
        onPress={() => navigation.navigate('TelaEvento', { email })}
      />
      <Button title="Sair" onPress={() => navigation.popToTop()} />
    </View>
  );
}

function TelaEvento({ route, navigation }) {
  const { email } = route.params;
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');

  function salvarEvento() {
    if (!titulo || !descricao) {
      Alert.alert('Ops!', 'Preencha todos os campos do evento.');
      return;
    }
    AsyncStorage.getItem(email + '_eventos').then(data => {
      let eventos = JSON.parse(data) || [];
      eventos.push({ titulo, descricao });
      AsyncStorage.setItem(email + '_eventos', JSON.stringify(eventos)).then(() => {
        setTitulo('');
        setDescricao('');
        Alert.alert('Show!', 'Evento cadastrado com sucesso!');
      });
    });
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Novo Evento</Text>
      <TextInput
        style={styles.input}
        placeholder="Título do evento"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição do evento"
        value={descricao}
        onChangeText={setDescricao}
      />
      <Button title="Salvar" onPress={salvarEvento} />
      <Button title="Voltar" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="TelaInicial">
        <Stack.Screen name="TelaInicial" component={TelaInicial} options={{ title: 'Flow' }} />
        <Stack.Screen name="TelaLogin" component={TelaLogin} options={{ title: 'Flow' }} />
        <Stack.Screen name="TelaCadastro" component={TelaCadastro} options={{ title: 'Flow' }} />
        <Stack.Screen name="TelaUsuario" component={TelaUsuario} options={{ headerLeft: null, title: 'Flow' }} />
        <Stack.Screen name="TelaEvento" component={TelaEvento} options={{ title: 'Flow' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  input: { width: '80%', borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, borderRadius: 5 },
  erro: { color: 'red', marginBottom: 10 },
});
