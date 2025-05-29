import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { createUser, getAllUsers } from '../../src/lib/api';

const TestDB = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [users, setUsers] = useState<any[]>([]);
  const [status, setStatus] = useState('');

  const handleCreateUser = async () => {
    try {
      setStatus('Creating user...');
      await createUser({ name, email });
      setStatus('User created successfully!');
      setName('');
      setEmail('');
      fetchUsers(); // Refresh the user list
    } catch (error: any) {
      setStatus(`Error: ${error.message}`);
    }
  };

  const fetchUsers = async () => {
    try {
      const allUsers = await getAllUsers();
      setUsers(allUsers);
    } catch (error: any) {
      setStatus(`Error fetching users: ${error.message}`);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>MongoDB Test</Text>
      
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Name"
          value={name}
          onChangeText={setName}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Button title="Create User" onPress={handleCreateUser} />
      </View>

      <Text style={styles.status}>{status}</Text>

      <View style={styles.userList}>
        <Text style={styles.subtitle}>Users in Database:</Text>
        {users.map((user, index) => (
          <View key={index} style={styles.userItem}>
            <Text>Name: {user.name}</Text>
            <Text>Email: {user.email}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  form: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  status: {
    marginVertical: 10,
    color: '#666',
  },
  userList: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default TestDB; 