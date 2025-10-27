import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Pressable,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { FontAwesome } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const API_URL = 'https://marks.vercel.app/api/members';

export default function DatabaseScreen({ navigation }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingMemberID, setEditingMemberID] = useState(null);
  const [editingField, setEditingField] = useState('');
  const [editingValue, setEditingValue] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRank, setNewRank] = useState('');
  const [newMarks, setNewMarks] = useState('');

  const [userName, setUserName] = useState('User');
  const [userModalVisible, setUserModalVisible] = useState(false);

  const [searchText, setSearchText] = useState('');
  const [sortOption, setSortOption] = useState('none'); // ✅ sort state

  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [infoText, setInfoText] = useState('');

  const richText = useRef();

  // Fetch members
  const fetchMembers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL);
      setMembers(response.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch members');
    }
    setLoading(false);
  };

  // Load username
  const loadUserName = async () => {
    const storedName = await AsyncStorage.getItem('username');
    if (storedName) setUserName(storedName);
  };

  useEffect(() => {
    fetchMembers();
    loadUserName();
  }, []);

  // Logout
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('hasLogged');
      navigation.replace('Verify');
    } catch (error) {
      Alert.alert('Error', 'Failed to logout');
    }
  };

  // Add Member
  const addMember = async () => {
    if (!newName || !newRank || !newMarks) {
      Alert.alert('Validation', 'Please fill all fields');
      return;
    }

    const memberData = {
      memberID: (members.length + 1).toString(),
      name: newName,
      rank: newRank,
      marks: newMarks,
      info: '',
    };

    try {
      await axios.post(API_URL, memberData);
      setModalVisible(false);
      setNewName('');
      setNewRank('');
      setNewMarks('');
      fetchMembers();
    } catch (error) {
      Alert.alert('Error', 'Failed to add member');
    }
  };

  // Delete member
  const deleteMember = (_id) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this member?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await axios.delete(`${API_URL}/${_id}`);
            fetchMembers();
          } catch (error) {
            Alert.alert('Error', 'Failed to delete member');
          }
        },
      },
    ]);
  };

  // Update member field
  const updateMemberField = async (member) => {
    try {
      await axios.put(`${API_URL}/${member._id}`, {
        ...member,
        [editingField]: editingValue,
      });
      setEditingMemberID(null);
      setEditingField('');
      setEditingValue('');
      fetchMembers();
    } catch (error) {
      Alert.alert('Error', 'Failed to update member');
    }
  };

  // Save username
  const saveUserName = async () => {
    try {
      await AsyncStorage.setItem('username', userName);
      setUserModalVisible(false);
    } catch (e) {
      Alert.alert('Error', 'Failed to save username');
    }
  };

  // Filter members
  const filteredMembers = members.filter(
    (m) =>
      m.name.toLowerCase().includes(searchText.toLowerCase()) ||
      m.rank.toLowerCase().includes(searchText.toLowerCase()) ||
      m.marks.toString().includes(searchText)
  );

  // ✅ Sort members
  const sortedMembers = [...filteredMembers].sort((a, b) => {
    if (sortOption === 'high') return b.marks - a.marks;
    if (sortOption === 'low') return a.marks - b.marks;
    if (sortOption === 'az') return a.name.localeCompare(b.name);
    if (sortOption === 'za') return b.name.localeCompare(a.name);
    return 0;
  });

  // Render member
  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => {
        setSelectedMember(item);
        setInfoText(item.info || '');
        setInfoModalVisible(true);
      }}
    >
      <Text style={styles.label}>Name:</Text>
      {editingMemberID === item._id && editingField === 'name' ? (
        <TextInput
          style={styles.inputInline}
          value={editingValue}
          onChangeText={setEditingValue}
          onBlur={() => updateMemberField(item)}
        />
      ) : (
        <Text
          style={styles.value}
          onPress={() => {
            setEditingMemberID(item._id);
            setEditingField('name');
            setEditingValue(item.name);
          }}
        >
          {item.name}
        </Text>
      )}

      <Text style={styles.label}>Rank:</Text>
      {editingMemberID === item._id && editingField === 'rank' ? (
        <TextInput
          style={styles.inputInline}
          value={editingValue}
          onChangeText={setEditingValue}
          onBlur={() => updateMemberField(item)}
        />
      ) : (
        <Text
          style={styles.value}
          onPress={() => {
            setEditingMemberID(item._id);
            setEditingField('rank');
            setEditingValue(item.rank);
          }}
        >
          {item.rank}
        </Text>
      )}

      <Text style={styles.label}>Marks:</Text>
      {editingMemberID === item._id && editingField === 'marks' ? (
        <TextInput
          style={styles.inputInline}
          value={editingValue}
          keyboardType="numeric"
          onChangeText={setEditingValue}
          onBlur={() => updateMemberField(item)}
        />
      ) : (
        <Text
          style={styles.value}
          onPress={() => {
            setEditingMemberID(item._id);
            setEditingField('marks');
            setEditingValue(item.marks);
          }}
        >
          {item.marks}
        </Text>
      )}

      <TouchableOpacity onPress={() => deleteMember(item._id)} style={styles.iconBtn}>
        <FontAwesome name="trash" size={20} color="#ff4d4d" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Hey, {userName}</Text>
        <TouchableOpacity onPress={() => setUserModalVisible(true)}>
          <FontAwesome name="edit" size={22} color="#007bff" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <TextInput
        placeholder="Search by Name, Rank, Marks..."
        style={styles.searchInput}
        value={searchText}
        onChangeText={setSearchText}
      />

      {/* ✅ Sort Dropdown */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <Picker
          selectedValue={sortOption}
          style={styles.sortPicker}
          onValueChange={(value) => setSortOption(value)}
        >
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Highest Marks" value="high" />
          <Picker.Item label="Lowest Marks" value="low" />
          <Picker.Item label="Name A–Z" value="az" />
          <Picker.Item label="Name Z–A" value="za" />
        </Picker>
      </View>

      {/* Add Button */}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.addText}>+ Add Member</Text>
      </TouchableOpacity>

      {/* Members List */}
      <FlatList
        data={sortedMembers}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshing={loading}
        onRefresh={fetchMembers}
      />

      {/* Add Member Modal */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Member</Text>
            <Text style={styles.inputLabel}>Name</Text>
            <TextInput placeholder="Name" value={newName} onChangeText={setNewName} style={styles.input} />
            <Text style={styles.inputLabel}>Rank</Text>
            <TextInput placeholder="Rank" value={newRank} onChangeText={setNewRank} style={styles.input} />
            <Text style={styles.inputLabel}>Marks</Text>
            <TextInput placeholder="Marks" value={newMarks} keyboardType="numeric" onChangeText={setNewMarks} style={styles.input} />
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#000' }]} onPress={addMember}>
                <Text style={styles.addText}>Add</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setModalVisible(false)}>
                <Text style={[styles.addText, { color: '#000' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Info Modal */}
      <Modal visible={infoModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { height: '80%' }]}>
            <Text style={styles.modalTitle}>Info (How marks were earned)</Text>
            <ScrollView>
              <RichEditor
                ref={richText}
                initialContentHTML={infoText}
                onChange={setInfoText}
                style={styles.richEditor}
                placeholder="Type details here..."
              />
            </ScrollView>
            <RichToolbar
              editor={richText}
              actions={[
                actions.setBold,
                actions.setItalic,
                actions.setUnderline,
                actions.insertBulletsList,
                actions.insertOrderedList,
                actions.insertLink,
                actions.undo,
                actions.redo,
              ]}
              style={styles.richToolbar}
            />
            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalBtn, { backgroundColor: '#000' }]}
                onPress={async () => {
                  try {
                    await axios.put(`${API_URL}/${selectedMember._id}`, {
                      ...selectedMember,
                      info: infoText,
                    });
                    setInfoModalVisible(false);
                    fetchMembers();
                  } catch (error) {
                    Alert.alert('Error', 'Failed to update info');
                  }
                }}
              >
                <Text style={styles.addText}>Save</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setInfoModalVisible(false)}>
                <Text style={[styles.addText, { color: '#000' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Username Modal */}
      <Modal visible={userModalVisible} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Edit Username</Text>
            <TextInput placeholder="Username" value={userName} onChangeText={setUserName} style={styles.input} />
            <View style={styles.modalButtons}>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#000' }]} onPress={saveUserName}>
                <Text style={styles.addText}>Save</Text>
              </Pressable>
              <Pressable style={[styles.modalBtn, { backgroundColor: '#ccc' }]} onPress={() => setUserModalVisible(false)}>
                <Text style={[styles.addText, { color: '#000' }]}>Cancel</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.addText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20, marginTop: 40 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  title: { fontSize: 24, fontFamily: 'Poppins_700Bold' },
  searchInput: { borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 8, marginBottom: 10 },
  sortContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  sortLabel: { fontWeight: 'bold', marginRight: 10 },
  sortPicker: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8 },
  card: { backgroundColor: '#f9f9f9', padding: 16, borderRadius: 10, marginBottom: 12, elevation: 2 },
  label: { fontWeight: 'bold', marginTop: 4 },
  value: { fontSize: 16, marginBottom: 6 },
  inputInline: { borderBottomWidth: 1, borderColor: '#000', fontSize: 16, marginVertical: 4 },
  iconBtn: { marginTop: 6 },
  addButton: { backgroundColor: '#000', paddingVertical: 14, paddingHorizontal: 22, borderRadius: 50, alignSelf: 'center', marginBottom: 20 },
  addText: { color: '#fff', fontFamily: 'Poppins_700Bold', textAlign: 'center' },
  logoutBtn: { backgroundColor: '#ff4d4d', paddingVertical: 12, borderRadius: 8, marginTop: 20, width: 100, alignSelf: 'center', marginBottom: 30 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, borderRadius: 8, marginBottom: 10 },
  inputLabel: { fontWeight: 'bold', marginBottom: 5 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: '90%', backgroundColor: '#fff', padding: 20, borderRadius: 10 },
  modalTitle: { fontSize: 20, fontFamily: 'Poppins_700Bold', marginBottom: 10, textAlign: 'center' },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  modalBtn: { paddingVertical: 10, paddingHorizontal: 20, borderRadius: 8 },
  richEditor: { borderWidth: 1, borderColor: '#ccc', borderRadius: 8, minHeight: 200 },
  richToolbar: { backgroundColor: '#f2f2f2', borderRadius: 8, marginVertical: 10 },
});
